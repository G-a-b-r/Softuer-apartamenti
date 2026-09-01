from database import db


class Contract(db.Model):
    __tablename__ = 'contracts'

    id = db.Column(db.String(120), primary_key=True)
    owner = db.Column(db.Text, default='')
    phone = db.Column(db.Text, default='')
    number = db.Column(db.Text, default='')
    date = db.Column(db.Text, default='')
    total_value = db.Column(db.Float, default=0)

    apartment_building = db.Column(db.Text, default='')
    apartment_unit = db.Column(db.Text, default='')
    apartment_value = db.Column(db.Float, default=0)

    parking_unit = db.Column(db.Text, default='')
    parking_value = db.Column(db.Float, default=0)

    advance_percent = db.Column(db.Float, default=0)
    advance_date = db.Column(db.Text, default='')
    installment1_percent = db.Column(db.Float, default=0)
    installment1_date = db.Column(db.Text, default='')
    installment2_percent = db.Column(db.Float, default=0)
    installment2_date = db.Column(db.Text, default='')
    extra_installments = db.Column(db.JSON, default=list)
    notes = db.Column(db.Text, default='')


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.String(120), primary_key=True)
    contract_id = db.Column(db.String(120), default='')
    date = db.Column(db.Text, default='')
    amount = db.Column(db.Float, default=0)
    currency = db.Column(db.Text, default='EUR')
    type = db.Column(db.Text, default='')
    property_type = db.Column(db.Text, default='')
    method = db.Column(db.Text, default='')
    invoice_number = db.Column(db.Text, default='')
    invoice_date = db.Column(db.Text, default='')
    notes = db.Column(db.Text, default='')
    status = db.Column(db.Text, default='paid')


class Invoice(db.Model):
    __tablename__ = 'invoices'

    id = db.Column(db.String(120), primary_key=True)
    contract_id = db.Column(db.String(120), default='')
    number = db.Column(db.Text, default='')
    date = db.Column(db.Text, default='')
    type = db.Column(db.Text, default='')
    amount = db.Column(db.Float, default=0)
    description = db.Column(db.Text, default='')


class Profile(db.Model):
    __tablename__ = 'profiles'

    id = db.Column(db.String(120), primary_key=True)
    username = db.Column(db.Text, default='')
    password_hash = db.Column(db.Text, default='')
    role = db.Column(db.Text, default='user')


class Unit(db.Model):
    __tablename__ = 'units'

    id = db.Column(db.String(160), primary_key=True)
    building = db.Column(db.Text, default='')
    position = db.Column(db.Integer, default=0)
    unit_id = db.Column(db.Text, default='')
    name = db.Column(db.Text, default='')
    type = db.Column(db.Text, default='')
    sqm = db.Column(db.Float, default=0)
    price = db.Column(db.Float, default=0)
    status = db.Column(db.Text, default='free')
    apt_type = db.Column(db.Text, nullable=True)


class Session(db.Model):
    __tablename__ = 'sessions'

    id = db.Column(db.String(64), primary_key=True)
    user_id = db.Column(db.String(120), default='')
    created = db.Column(db.Text, default='')