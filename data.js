const API_BASE = (window.API_BASE !== undefined) ? window.API_BASE : '/api';

function httpStatusText(code) {
    const map = {
        400: 'Невалидна заявка (HTTP 400)',
        401: 'Не сте влезли или сесията е изтекла (HTTP 401)',
        403: 'Нямате права за тази операция (HTTP 403)',
        404: 'Заявеният ресурс не е намерен (HTTP 404)',
        405: 'Грешен метод на заявката (HTTP 405) — презаредете страницата',
        409: 'Конфликт — записът вече съществува или е променен (HTTP 409)',
        422: 'Невалидни данни (HTTP 422)',
        429: 'Прекалено много заявки (HTTP 429) — опитайте по-късно',
        500: 'Грешка в сървъра (HTTP 500) — опитайте по-късно',
        502: 'Лош шлюз (HTTP 502)',
        503: 'Услугата е временно недостъпна (HTTP 503)',
        504: 'Изчакване на сървъра (HTTP 504)'
    };
    return map[code] || ('HTTP грешка ' + code);
}

async function api(path, options) {
    const headers = { 'Content-Type': 'application/json' };
    const sess = getSession();
    if (sess && sess.token) headers['Authorization'] = 'Bearer ' + sess.token;
    if (options && options.headers) Object.assign(headers, options.headers);

    const res = await fetch(API_BASE + path, Object.assign({}, options, { headers }));
    const text = await res.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch (e) { body = null; }
    if (!res.ok) {
        if (res.status === 401 && path !== '/login' && path !== '/register') {
            setSession(null);
            setTimeout(function() { openLoginModal(); }, 100);
        }
        const msg = body && body.error ? body.error : httpStatusText(res.status);
        throw new Error(msg);
    }
    return body;
}

function alertErr(action, err) {
    alert('❌ ' + action + ': ' + err.message);
}

function saveButtonOf(event) {
    if (event && event.submitter) return event.submitter;
    if (event && event.currentTarget) {
        const s = event.currentTarget.querySelector('button[type="submit"]');
        if (s) return s;
    }
    return null;
}

function beginSave(event) {
    const btn = saveButtonOf(event);
    if (btn) {
        if (btn.disabled) return false;
        btn.disabled = true;
    }
    return true;
}

function endSave(event) {
    const btn = saveButtonOf(event);
    if (btn) btn.disabled = false;
}

class AppData {
    constructor() {
        this.contracts = [];
        this.payments = [];
        this.invoices = [];
        this.profiles = [];
        this.units = {};
        this._unitSync = {};
        this.ready = false;
    }

    newId(prefix) {
        return prefix + '_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }

    async init() {
        const data = await api('/bootstrap');
        this.contracts = Array.isArray(data.contracts) ? data.contracts : [];
        this.payments = Array.isArray(data.payments) ? data.payments : [];
        this.invoices = Array.isArray(data.invoices) ? data.invoices : [];
        this.profiles = Array.isArray(data.profiles) ? data.profiles : [];
        this.units = data.units && typeof data.units === 'object' ? data.units : {};
        this._unitSync = JSON.parse(JSON.stringify(this.units));
        this.ready = true;
    }

    // ------------------------------------------------------------ contracts

    async addContract(contract) {
        if (!contract.id) contract.id = this.newId('contract');
        this.contracts.push(contract);
        try {
            await api('/contracts', { method: 'POST', body: JSON.stringify(contract) });
            return contract;
        } catch (err) {
            this.contracts = this.contracts.filter(c => c.id !== contract.id);
            alertErr('Грешка при запис на договора', err);
            throw err;
        }
    }

    async updateContract(id, data) {
        const idx = this.contracts.findIndex(c => c.id === id);
        if (idx === -1) return;
        this.contracts[idx] = Object.assign({}, this.contracts[idx], data);
        const contract = this.contracts[idx];
        try {
            await api('/contracts/' + encodeURIComponent(id), { method: 'PUT', body: JSON.stringify(contract) });
        } catch (err) {
            alertErr('Грешка при запис на договора', err);
            throw err;
        }
    }

    async deleteContract(id) {
        this.contracts = this.contracts.filter(c => c.id !== id);
        try {
            await api('/contracts/' + encodeURIComponent(id), { method: 'DELETE' });
        } catch (err) {
            alertErr('Грешка при изтриване на договора', err);
        }
    }

    // ------------------------------------------------------------- payments

    async addPayment(payment) {
        if (!payment.id) payment.id = this.newId('payment');
        this.payments.push(payment);
        try {
            await api('/payments', { method: 'POST', body: JSON.stringify(payment) });
            return payment;
        } catch (err) {
            this.payments = this.payments.filter(p => p.id !== payment.id);
            alertErr('Грешка при запис на плащането', err);
            throw err;
        }
    }

    async updatePayment(id, data) {
        const idx = this.payments.findIndex(p => p.id === id);
        if (idx === -1) return;
        this.payments[idx] = Object.assign({}, this.payments[idx], data);
        const payment = this.payments[idx];
        try {
            await api('/payments/' + encodeURIComponent(id), { method: 'PUT', body: JSON.stringify(payment) });
        } catch (err) {
            alertErr('Грешка при запис на плащането', err);
            throw err;
        }
    }

    async deletePayment(id) {
        this.payments = this.payments.filter(p => p.id !== id);
        try {
            await api('/payments/' + encodeURIComponent(id), { method: 'DELETE' });
        } catch (err) {
            alertErr('Грешка при изтриване на плащането', err);
        }
    }

    // --------------------------------------------------------------- invoices

    async addInvoice(invoice) {
        if (!invoice.id) invoice.id = this.newId('invoice');
        this.invoices.push(invoice);
        try {
            await api('/invoices', { method: 'POST', body: JSON.stringify(invoice) });
            return invoice;
        } catch (err) {
            this.invoices = this.invoices.filter(i => i.id !== invoice.id);
            alertErr('Грешка при запис на фактурата', err);
            throw err;
        }
    }

    async updateInvoice(id, data) {
        const idx = this.invoices.findIndex(i => i.id === id);
        if (idx === -1) return;
        this.invoices[idx] = Object.assign({}, this.invoices[idx], data);
        const invoice = this.invoices[idx];
        try {
            await api('/invoices/' + encodeURIComponent(id), { method: 'PUT', body: JSON.stringify(invoice) });
        } catch (err) {
            alertErr('Грешка при запис на фактурата', err);
            throw err;
        }
    }

    async deleteInvoice(id) {
        this.invoices = this.invoices.filter(i => i.id !== id);
        try {
            await api('/invoices/' + encodeURIComponent(id), { method: 'DELETE' });
        } catch (err) {
            alertErr('Грешка при изтриване на фактурата', err);
        }
    }

    // ----------------------------------------------------------------- units

    async addUnit(building, unit) {
        try {
            await api('/units', {
                method: 'POST',
                body: JSON.stringify({ building: building, unit: unit })
            });
        } catch (err) {
            alertErr('Грешка при добавяне на имот', err);
            throw err;
        }
    }

    async updateUnit(building, unitId, data) {
        try {
            await api('/units/' + encodeURIComponent(building) + '/' + encodeURIComponent(unitId), {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        } catch (err) {
            alertErr('Грешка при запис на имота', err);
            throw err;
        }
    }

    async deleteUnit(building, unitId) {
        try {
            await api('/units/' + encodeURIComponent(building) + '/' + encodeURIComponent(unitId), {
                method: 'DELETE'
            });
        } catch (err) {
            alertErr('Грешка при изтриване на имота', err);
            throw err;
        }
    }

    async syncUnits() {
        const keys = new Set(
            Object.keys(this.units).concat(Object.keys(this._unitSync))
                .filter(b => b === 'parking' || String(b).startsWith('building'))
        );
        const promises = [];
        for (const building of keys) {
            const arr = this.units[building] || [];
            const syncArr = this._unitSync[building] || [];
            const syncMap = new Map(syncArr.map(u => [u.id, u]));
            for (const u of arr) {
                const s = syncMap.get(u.id);
                if (!s) {
                    promises.push(this.addUnit(building, u));
                } else if (JSON.stringify(s) !== JSON.stringify(u)) {
                    promises.push(this.updateUnit(building, u.id, u));
                }
                syncMap.delete(u.id);
            }
            for (const s of syncArr) {
                if (!arr.some(u => u.id === s.id)) {
                    promises.push(this.deleteUnit(building, s.id));
                } else if (syncMap.has(s.id)) {
                    promises.push(this.deleteUnit(building, s.id));
                }
            }
        }
        await Promise.allSettled(promises);
        this._unitSync = JSON.parse(JSON.stringify(this.units));
    }

    async saveData(key, data) {
        if (key === 'units') {
            await this.syncUnits();
        }
    }

    // ----------------------------------------------------------------- import

    async importAll(data) {
        const res = await api('/import', {
            method: 'POST',
            body: JSON.stringify({
                contracts: data.contracts || [],
                payments: data.payments || [],
                invoices: data.invoices || [],
                units: data.units
            })
        });
        this.contracts = data.contracts || [];
        this.payments = data.payments || [];
        this.invoices = data.invoices || [];
        this.units = data.units || {};
        this._unitSync = JSON.parse(JSON.stringify(this.units));
        return res;
    }

    // ------------------------------------------------------------------ misc

    getContractsByBuilding(building) {
        return this.contracts.filter(c =>
            (c.apartment && c.apartment.building === building) || (c.parking && c.parking.building === building)
        );
    }

    getPaymentsByContract(contractId) {
        return this.payments.filter(p => p.contractId === contractId);
    }

    getStats() {
        const stats = {};
        const buildings = ['building_a', 'building_b', 'building_c', 'building_d', 'building_e'];
        buildings.forEach(building => {
            const buildingContracts = this.getContractsByBuilding(building);
            const totalValue = buildingContracts.reduce((sum, c) => sum + parseMoney(c.totalValue || 0), 0);
            const totalPaid = buildingContracts.reduce((sum, c) => {
                const payments = this.getPaymentsByContract(c.id);
                return sum + payments.reduce((s, p) => s + parseMoney(p.amount || 0), 0);
            }, 0);

            const totalUnits = this.units[building] ? this.units[building].filter(u => u.type === 'apartment').length : 0;
            const contractedIds = new Set(
                this.contracts
                    .filter(c => c.apartment && c.apartment.building === building)
                    .map(c => c.apartment.unit)
            );
            const availableUnits = totalUnits - contractedIds.size;

            stats[building] = {
                totalUnits: totalUnits,
                availableUnits: availableUnits,
                contractCount: buildingContracts.length,
                totalValue: totalValue,
                totalPaid: totalPaid,
                remaining: totalValue - totalPaid
            };
        });

        const parkingUnits = this.units['parking'] || [];
        stats.parking = {
            total: parkingUnits.length,
            sold: parkingUnits.filter(u => u.status === 'sold').length,
            available: parkingUnits.filter(u => u.status !== 'sold').length
        };

        return stats;
    }
}

let appData = new AppData();
const buildingNames = { 'building_a': 'Сграда А', 'building_b': 'Сграда Б', 'building_c': 'Сграда В', 'building_d': 'Сграда Г', 'building_e': 'Сграда Д' };