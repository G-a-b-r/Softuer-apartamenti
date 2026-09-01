import os
import threading
import uuid
from datetime import datetime, timezone
from functools import wraps

from flask import Flask, abort, g, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

from database import db, DATABASE_URL, BASE_DIR
from models import Contract, Invoice, Payment, Profile, Session, Unit
from seed import BUILDINGS, generate_units

FRONTEND_DIR = os.path.dirname(BASE_DIR)
VALID_BUILDINGS = set(BUILDINGS) | {'parking'}
ALLOWED_STATIC = {'index.html', 'style.css', 'app.js', 'auth.js', 'data.js', 'main.js', 'config.js', 'favicon.ico'}

app = Flask(__name__, static_folder=None)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

_cors_origins = os.getenv('CORS_ALLOWED_ORIGINS', '*')
CORS(app, resources={r'/api/*': {'origins': [o.strip() for o in _cors_origins.split(',') if o.strip()]}})


# ---------------------------------------------------------------- helpers

def current_user():
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    token = auth[7:]
    sess = Session.query.filter_by(id=token).first()
    if not sess:
        return None
    return Profile.query.filter_by(id=sess.user_id).first()


def create_session(profile):
    token = uuid.uuid4().hex
    db.session.add(Session(id=token, user_id=profile.id, created=datetime.now(timezone.utc).isoformat()))
    db.session.commit()
    return token


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user = current_user()
        if not user:
            return jsonify({'error': 'Моля, влезте в профила си.'}), 401
        g.user = user
        return f(*args, **kwargs)
    return wrapper


def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user = current_user()
        if not user:
            return jsonify({'error': 'Моля, влезте в профила си.'}), 401
        if user.role != 'admin':
            return jsonify({'error': 'Само администратор може да извършва тази операция.'}), 403
        g.user = user
        return f(*args, **kwargs)
    return wrapper


def as_float(value, default=None):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


# ------------------------------------------------------------- validation

def validate_contract(c):
    if not isinstance(c, dict):
        return 'Невалиден договор.'
    if not c.get('id'):
        return 'Договорът няма ID.'
    owner = str(c.get('owner', '') or '').strip()
    if not owner:
        return 'Собственикът е задължителен.'
    if len(owner) > 200:
        return 'Името на собственика е твърде дълго.'
    if as_float(c.get('totalValue')) is None:
        return 'Невалидна обща стойност.'
    if as_float(c.get('totalValue')) <= 0:
        return 'Общата стойност трябва да е положително число.'

    ap = c.get('apartment') or {}
    pk = c.get('parking') or {}
    if not ap and not pk:
        return 'Договорът трябва да съдържа апартамент или паркомясто.'
    if ap:
        if ap.get('building') not in BUILDINGS:
            return 'Неизвестна сграда на апартамента.'
        if not ap.get('unit'):
            return 'Липсва номер на апартамента.'
        av = as_float(ap.get('value'))
        if av is None or av <= 0:
            return 'Стойността на апартамента трябва да е положително число.'
    if pk:
        if not pk.get('unit'):
            return 'Липсва номер на паркомястото.'
        pv = as_float(pk.get('value'))
        if pv is None or pv <= 0:
            return 'Стойността на паркомястото трябва да е положително число.'

    for key in ('advance', 'installment1', 'installment2'):
        item = c.get(key) or {}
        pct = as_float(item.get('percent'))
        if pct is None or not (0 <= pct <= 100):
            return 'Процентът в графика трябва да е между 0 и 100.'
    extra = c.get('extraInstallments') or []
    if not isinstance(extra, list):
        return 'Невалиден списък с доплащания.'
    for e in extra:
        if not isinstance(e, dict):
            return 'Невалидно доплащане в графика.'
        pct = as_float(e.get('percent'))
        if pct is None or not (0 <= pct <= 100):
            return 'Процентът в доплащането трябва да е между 0 и 100.'
    return None


def validate_payment(p):
    if not isinstance(p, dict):
        return 'Невалидно плащане.'
    if not p.get('id'):
        return 'Плащането няма ID.'
    if not p.get('contractId'):
        return 'Липсва номер на договор.'
    if not p.get('date'):
        return 'Липсва дата на плащането.'
    amount = as_float(p.get('amount'))
    if amount is None or amount <= 0:
        return 'Сумата на плащането трябва да е положително число.'
    ptype = p.get('type', '') or ''
    if ptype != 'advance' and not ptype.startswith('installment'):
        return 'Невалиден тип на плащането.'
    if p.get('method') not in ('cash', 'bank', 'check', '', None):
        return 'Невалиден метод на плащане.'
    if p.get('status') not in ('paid', 'pending', 'unpaid', '', None):
        return 'Невалиден статус на плащането.'
    return None


def validate_invoice(i):
    if not isinstance(i, dict):
        return 'Невалидна фактура.'
    if not i.get('id'):
        return 'Фактурата няма ID.'
    if not i.get('contractId'):
        return 'Липсва номер на договор.'
    amount = as_float(i.get('amount'))
    if amount is None or amount < 0:
        return 'Сумата на фактурата не може да е отрицателна.'
    if i.get('type') not in ('proforma', 'invoice'):
        return 'Невалиден тип на фактурата.'
    return None


def validate_unit(building, u):
    if not isinstance(u, dict):
        return 'Невалиден имот.'
    if building not in VALID_BUILDINGS:
        return 'Неизвестна сграда.'
    if not u.get('id'):
        return 'Имотът няма ID.'
    if u.get('type') not in ('apartment', 'parking'):
        return 'Невалиден тип на имота.'
    price = as_float(u.get('price'))
    if price is None or price < 0:
        return 'Цената на имота не може да е отрицателна.'
    sqm = as_float(u.get('sqm', 0))
    if sqm is None or sqm < 0:
        return 'Квадратурата не може да е отрицателна.'
    if u.get('status') not in ('free', 'reserved', 'sold'):
        return 'Невалиден статус на имота.'
    return None


def validate_unit_update(building, ups):
    if building not in VALID_BUILDINGS:
        return 'Неизвестна сграда.'
    allowed = {'id', 'name', 'type', 'sqm', 'price', 'status', 'aptType'}
    for k in ups:
        if k not in allowed:
            return 'Неизвестно поле за имота: ' + str(k)
    if 'id' in ups and not ups.get('id'):
        return 'ID на имота е задължително.'
    if 'type' in ups and ups.get('type') not in ('apartment', 'parking'):
        return 'Невалиден тип на имота.'
    if 'status' in ups and ups.get('status') not in ('free', 'reserved', 'sold'):
        return 'Невалиден статус на имота.'
    for k in ('price', 'sqm'):
        if k in ups:
            v = as_float(ups.get(k))
            if v is None or v < 0:
                return 'Стойността на ' + k + ' не може да е отрицателна.'
    return None


# ----------------------------------------------------------------- units

def units_to_dict():
    grouped = {}
    for u in Unit.query.order_by(Unit.building, Unit.position).all():
        item = {
            'id': u.unit_id,
            'name': u.name,
            'type': u.type,
            'sqm': u.sqm,
            'price': u.price,
            'status': u.status,
        }
        if u.apt_type:
            item['aptType'] = u.apt_type
        grouped.setdefault(u.building, []).append(item)
    return grouped


def replace_units(units):
    Unit.query.delete()
    if not units:
        db.session.commit()
        return
    for building, arr in units.items():
        for i, u in enumerate(arr):
            db.session.add(Unit(
                id=building + '::' + str(uuid.uuid4().hex[:8]),
                building=building,
                position=i,
                unit_id=u.get('id', ''),
                name=u.get('name', ''),
                type=u.get('type', ''),
                sqm=u.get('sqm', 0) or 0,
                price=u.get('price', 0) or 0,
                status=u.get('status', 'free'),
                apt_type=u.get('aptType'),
            ))
    db.session.commit()


def seed_units_if_empty():
    if Unit.query.count() == 0:
        replace_units(generate_units())


# ------------------------------------------------------------- contracts

def contract_to_dict(c):
    return {
        'id': c.id,
        'owner': c.owner,
        'phone': c.phone,
        'number': c.number,
        'date': c.date,
        'totalValue': c.total_value,
        'apartment': {
            'building': c.apartment_building,
            'unit': c.apartment_unit,
            'value': c.apartment_value,
        } if c.apartment_building else None,
        'parking': {
            'unit': c.parking_unit,
            'value': c.parking_value,
        } if c.parking_unit else None,
        'advance': {'percent': c.advance_percent, 'date': c.advance_date},
        'installment1': {'percent': c.installment1_percent, 'date': c.installment1_date},
        'installment2': {'percent': c.installment2_percent, 'date': c.installment2_date},
        'extraInstallments': c.extra_installments or [],
        'notes': c.notes,
    }


def contract_row(c):
    ap = c.get('apartment') or {}
    pk = c.get('parking') or {}
    adv = c.get('advance') or {}
    i1 = c.get('installment1') or {}
    i2 = c.get('installment2') or {}
    return {
        'id': c.get('id'),
        'owner': c.get('owner', '') or '',
        'phone': c.get('phone', '') or '',
        'number': c.get('number', '') or '',
        'date': c.get('date', '') or '',
        'total_value': c.get('totalValue', 0) or 0,
        'apartment_building': ap.get('building', '') or '',
        'apartment_unit': ap.get('unit', '') or '',
        'apartment_value': ap.get('value', 0) or 0,
        'parking_unit': pk.get('unit', '') or '',
        'parking_value': pk.get('value', 0) or 0,
        'advance_percent': adv.get('percent', 0) or 0,
        'advance_date': adv.get('date', '') or '',
        'installment1_percent': i1.get('percent', 0) or 0,
        'installment1_date': i1.get('date', '') or '',
        'installment2_percent': i2.get('percent', 0) or 0,
        'installment2_date': i2.get('date', '') or '',
        'extra_installments': c.get('extraInstallments') or [],
        'notes': c.get('notes', '') or '',
    }


@app.post('/api/contracts')
@admin_required
def create_contract():
    body = request.get_json(silent=True) or {}
    err = validate_contract(body)
    if err:
        return jsonify({'error': err}), 400
    if Contract.query.filter_by(id=body['id']).first():
        return jsonify({'error': 'Договор с това ID вече съществува.'}), 400
    db.session.add(Contract(**contract_row(body)))
    db.session.commit()
    return jsonify({'ok': True}), 201


@app.put('/api/contracts/<contract_id>')
@admin_required
def update_contract(contract_id):
    body = request.get_json(silent=True) or {}
    body['id'] = contract_id
    err = validate_contract(body)
    if err:
        return jsonify({'error': err}), 400
    contract = Contract.query.filter_by(id=contract_id).first()
    if not contract:
        return jsonify({'error': 'Договорът не е намерен.'}), 404
    row = contract_row(body)
    for k, v in row.items():
        setattr(contract, k, v)
    db.session.commit()
    return jsonify({'ok': True})


@app.delete('/api/contracts/<contract_id>')
@admin_required
def delete_contract(contract_id):
    contract = Contract.query.filter_by(id=contract_id).first()
    if not contract:
        return jsonify({'error': 'Договорът не е намерен.'}), 404
    db.session.delete(contract)
    db.session.commit()
    return jsonify({'ok': True})


# --------------------------------------------------------------- payments

def payment_to_dict(p):
    return {
        'id': p.id,
        'contractId': p.contract_id,
        'date': p.date,
        'amount': p.amount,
        'currency': p.currency,
        'type': p.type,
        'propertyType': p.property_type,
        'method': p.method,
        'invoiceNumber': p.invoice_number,
        'invoiceDate': p.invoice_date,
        'notes': p.notes,
        'status': p.status,
    }


def payment_row(p):
    return {
        'id': p.get('id'),
        'contract_id': p.get('contractId', '') or '',
        'date': p.get('date', '') or '',
        'amount': p.get('amount', 0) or 0,
        'currency': p.get('currency', 'EUR') or 'EUR',
        'type': p.get('type', '') or '',
        'property_type': p.get('propertyType', '') or '',
        'method': p.get('method', '') or '',
        'invoice_number': p.get('invoiceNumber', '') or '',
        'invoice_date': p.get('invoiceDate', '') or '',
        'notes': p.get('notes', '') or '',
        'status': p.get('status', 'paid') or 'paid',
    }


@app.post('/api/payments')
@admin_required
def create_payment():
    body = request.get_json(silent=True) or {}
    err = validate_payment(body)
    if err:
        return jsonify({'error': err}), 400
    if Payment.query.filter_by(id=body['id']).first():
        return jsonify({'error': 'Плащане с това ID вече съществува.'}), 400
    db.session.add(Payment(**payment_row(body)))
    db.session.commit()
    return jsonify({'ok': True}), 201


@app.put('/api/payments/<payment_id>')
@admin_required
def update_payment(payment_id):
    body = request.get_json(silent=True) or {}
    body['id'] = payment_id
    err = validate_payment(body)
    if err:
        return jsonify({'error': err}), 400
    payment = Payment.query.filter_by(id=payment_id).first()
    if not payment:
        return jsonify({'error': 'Плащането не е намерено.'}), 404
    row = payment_row(body)
    for k, v in row.items():
        setattr(payment, k, v)
    db.session.commit()
    return jsonify({'ok': True})


@app.delete('/api/payments/<payment_id>')
@admin_required
def delete_payment(payment_id):
    payment = Payment.query.filter_by(id=payment_id).first()
    if not payment:
        return jsonify({'error': 'Плащането не е намерено.'}), 404
    db.session.delete(payment)
    db.session.commit()
    return jsonify({'ok': True})


# ---------------------------------------------------------------- invoices

def invoice_to_dict(i):
    return {
        'id': i.id,
        'contractId': i.contract_id,
        'number': i.number,
        'date': i.date,
        'type': i.type,
        'amount': i.amount,
        'description': i.description,
    }


def invoice_row(i):
    return {
        'id': i.get('id'),
        'contract_id': i.get('contractId', '') or '',
        'number': i.get('number', '') or '',
        'date': i.get('date', '') or '',
        'type': i.get('type', '') or '',
        'amount': i.get('amount', 0) or 0,
        'description': i.get('description', '') or '',
    }


@app.post('/api/invoices')
@admin_required
def create_invoice():
    body = request.get_json(silent=True) or {}
    err = validate_invoice(body)
    if err:
        return jsonify({'error': err}), 400
    if Invoice.query.filter_by(id=body['id']).first():
        return jsonify({'error': 'Фактура с това ID вече съществува.'}), 400
    db.session.add(Invoice(**invoice_row(body)))
    db.session.commit()
    return jsonify({'ok': True}), 201


@app.put('/api/invoices/<invoice_id>')
@admin_required
def update_invoice(invoice_id):
    body = request.get_json(silent=True) or {}
    body['id'] = invoice_id
    err = validate_invoice(body)
    if err:
        return jsonify({'error': err}), 400
    invoice = Invoice.query.filter_by(id=invoice_id).first()
    if not invoice:
        return jsonify({'error': 'Фактурата не е намерена.'}), 404
    row = invoice_row(body)
    for k, v in row.items():
        setattr(invoice, k, v)
    db.session.commit()
    return jsonify({'ok': True})


@app.delete('/api/invoices/<invoice_id>')
@admin_required
def delete_invoice(invoice_id):
    invoice = Invoice.query.filter_by(id=invoice_id).first()
    if not invoice:
        return jsonify({'error': 'Фактурата не е намерена.'}), 404
    db.session.delete(invoice)
    db.session.commit()
    return jsonify({'ok': True})


# ------------------------------------------------------------------ units

@app.post('/api/units')
@admin_required
def create_unit():
    body = request.get_json(silent=True) or {}
    building = body.get('building', '')
    unit = body.get('unit') or {}
    err = validate_unit(building, unit)
    if err:
        return jsonify({'error': err}), 400
    if Unit.query.filter_by(building=building, unit_id=unit['id']).first():
        return jsonify({'error': 'Вече съществува имот с това ID в тази сграда.'}), 400
    pos = Unit.query.filter_by(building=building).count()
    db.session.add(Unit(
        id=building + '::' + uuid.uuid4().hex[:8],
        building=building,
        position=pos,
        unit_id=unit['id'],
        name=unit.get('name', ''),
        type=unit.get('type', ''),
        sqm=unit.get('sqm', 0) or 0,
        price=unit.get('price', 0) or 0,
        status=unit.get('status', 'free'),
        apt_type=unit.get('aptType'),
    ))
    db.session.commit()
    return jsonify({'ok': True}), 201


@app.put('/api/units/<building>/<unit_id>')
@admin_required
def update_unit(building, unit_id):
    body = request.get_json(silent=True) or {}
    err = validate_unit_update(building, body)
    if err:
        return jsonify({'error': err}), 400
    row = Unit.query.filter_by(building=building, unit_id=unit_id).first()
    if not row:
        return jsonify({'error': 'Имотът не е намерен.'}), 404
    if 'id' in body:
        row.unit_id = body['id']
    if 'name' in body:
        row.name = body['name']
    if 'type' in body:
        row.type = body['type']
    if 'sqm' in body:
        row.sqm = as_float(body['sqm'])
    if 'price' in body:
        row.price = as_float(body['price'])
    if 'status' in body:
        row.status = body['status']
    if 'aptType' in body:
        row.apt_type = body['aptType']
    db.session.commit()
    return jsonify({'ok': True})


@app.delete('/api/units/<building>/<unit_id>')
@admin_required
def delete_unit(building, unit_id):
    row = Unit.query.filter_by(building=building, unit_id=unit_id).first()
    if not row:
        return jsonify({'error': 'Имотът не е намерен.'}), 404
    db.session.delete(row)
    db.session.commit()
    return jsonify({'ok': True})


# ----------------------------------------------------------------- routes

@app.get('/api/health')
def health():
    return jsonify({'ok': True})


@app.get('/api/bootstrap')
@login_required
def bootstrap():
    data = {
        'contracts': [contract_to_dict(c) for c in Contract.query.all()],
        'payments': [payment_to_dict(p) for p in Payment.query.all()],
        'invoices': [invoice_to_dict(i) for i in Invoice.query.all()],
        'profiles': [
            {'id': p.id, 'username': p.username, 'role': p.role}
            for p in Profile.query.all()
        ],
        'units': units_to_dict(),
    }
    return jsonify(data)


@app.post('/api/register')
def register():
    body = request.get_json(silent=True) or {}
    username = (body.get('username') or '').strip()
    password = body.get('password') or ''
    if len(username) < 2 or len(username) > 60:
        return jsonify({'error': 'Потребителското име трябва да е между 2 и 60 знака.'}), 400
    if len(password) < 4:
        return jsonify({'error': 'Паролата трябва да е поне 4 знака.'}), 400

    existing = Profile.query.filter(db.func.lower(Profile.username) == username.lower()).first()
    if existing:
        return jsonify({'error': 'Това потребителско име вече съществува!'}), 400

    is_first = Profile.query.count() == 0
    profile = Profile(
        id='profile_' + uuid.uuid4().hex[:12],
        username=username,
        password_hash=generate_password_hash(password),
        role='admin' if is_first else 'user',
    )
    db.session.add(profile)
    db.session.commit()

    token = create_session(profile)
    return jsonify({
        'id': profile.id,
        'username': profile.username,
        'role': profile.role,
        'token': token,
    })


@app.post('/api/login')
def login():
    body = request.get_json(silent=True) or {}
    username = (body.get('username') or '').strip()
    password = body.get('password') or ''
    if not username or not password:
        return jsonify({'error': 'Моля, попълни потребителско име и парола!'}), 400

    profile = Profile.query.filter(db.func.lower(Profile.username) == username.lower()).first()
    if not profile or not check_password_hash(profile.password_hash, password):
        return jsonify({'error': 'Грешни потребителско име или парола!'}), 401

    token = create_session(profile)
    return jsonify({
        'id': profile.id,
        'username': profile.username,
        'role': profile.role,
        'token': token,
    })


@app.post('/api/logout')
def logout():
    auth = request.headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        sess = Session.query.filter_by(id=auth[7:]).first()
        if sess:
            db.session.delete(sess)
            db.session.commit()
    return jsonify({'ok': True})


@app.get('/api/profiles')
@login_required
def profiles():
    return jsonify([
        {'id': p.id, 'username': p.username, 'role': p.role}
        for p in Profile.query.all()
    ])


@app.put('/api/profiles/<profile_id>/role')
@admin_required
def change_role(profile_id):
    profile = Profile.query.filter_by(id=profile_id).first()
    if not profile:
        return jsonify({'error': 'Профилът не е намерен.'}), 404
    if g.user.id == profile_id:
        return jsonify({'error': 'Не можеш да промениш собствената си роля.'}), 400
    body = request.get_json(silent=True) or {}
    role = body.get('role')
    if role not in ('admin', 'user'):
        return jsonify({'error': 'Невалидна роля.'}), 400
    profile.role = role
    db.session.commit()
    return jsonify({'ok': True})


@app.post('/api/import')
@admin_required
def import_all():
    body = request.get_json(silent=True) or {}
    contracts = body.get('contracts') or []
    payments = body.get('payments') or []
    invoices = body.get('invoices') or []
    units = body.get('units')

    if not isinstance(contracts, list) or not isinstance(payments, list) or not isinstance(invoices, list):
        return jsonify({'error': 'Невалиден формат на данните.'}), 400
    if units is None:
        units = {}
    if not isinstance(units, dict):
        return jsonify({'error': 'Невалиден формат на данните.'}), 400

    for c in contracts:
        err = validate_contract(c)
        if err:
            return jsonify({'error': 'Грешен договор: ' + err}), 400
    for p in payments:
        err = validate_payment(p)
        if err:
            return jsonify({'error': 'Грешно плащане: ' + err}), 400
    for i in invoices:
        err = validate_invoice(i)
        if err:
            return jsonify({'error': 'Грешна фактура: ' + err}), 400
    for building, arr in units.items():
        if building not in VALID_BUILDINGS:
            return jsonify({'error': 'Неизвестна сграда: ' + building}), 400
        for u in arr:
            err = validate_unit(building, u)
            if err:
                return jsonify({'error': 'Грешен имот: ' + err}), 400

    Contract.query.delete()
    Payment.query.delete()
    Invoice.query.delete()
    db.session.flush()
    for c in contracts:
        db.session.add(Contract(**contract_row(c)))
    for p in payments:
        db.session.add(Payment(**payment_row(p)))
    for i in invoices:
        db.session.add(Invoice(**invoice_row(i)))
    db.session.commit()
    if units:
        replace_units(units)
    return jsonify({'ok': True, 'contracts': len(contracts), 'payments': len(payments), 'invoices': len(invoices)})


@app.delete('/api/reset')
@admin_required
def reset():
    Contract.query.delete()
    Payment.query.delete()
    Invoice.query.delete()
    Profile.query.delete()
    Session.query.delete()
    replace_units(generate_units())
    return jsonify({'ok': True})


# ---------------------------------------------------------------- frontend

@app.route('/')
def index():
    return send_from_directory(FRONTEND_DIR, 'index.html')


@app.route('/<path:filename>')
def frontend_file(filename):
    if filename not in ALLOWED_STATIC:
        abort(404)
    return send_from_directory(FRONTEND_DIR, filename)


# ---------------------------------------------------------------- startup

_schema_lock = threading.Lock()
_schema_ready = False


def ensure_schema():
    global _schema_ready
    if _schema_ready:
        return
    with _schema_lock:
        if _schema_ready:
            return
        db.create_all()
        seed_units_if_empty()
        _schema_ready = True


@app.before_request
def ensure_schema_before_request():
    try:
        ensure_schema()
    except Exception as exc:
        return jsonify({
            'error': 'Базата данни не е налична. Провери дали DATABASE_URL е зададен в настройките и дали връзката е активна.'
        }), 503
    return None


if __name__ == '__main__':
    port = int(os.getenv('PORT', '5000'))
    host = os.getenv('HOST', '127.0.0.1')
    debug = os.getenv('FLASK_DEBUG', '0') == '1'
    app.run(host=host, port=port, debug=debug)