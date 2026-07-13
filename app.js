class AppData {
    constructor() {
        this.contracts = this.loadData('contracts', []);
        this.payments = this.loadData('payments', []);
        this.invoices = this.loadData('invoices', []);
        
        this.units = this.loadData('units', null);
        if (!this.units) {
            this.units = this.generateUnits();
            this.saveData('units', this.units);
        }
    }

    loadData(key, defaultValue) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Error loading ' + key + ':', e);
            return defaultValue;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving ' + key + ':', e);
        }
    }

    generateUnits() {
        const units = {};
        const buildings = ['building_a', 'building_b', 'building_c', 'building_d', 'building_e'];
        const building_a_sizes = [137.60, 190.26, 107.73, 181.31, 134.94, 94.43, 62.66, 108.02, 97.12, 67.13, 77.37, 101.77, 113.48, 100.05, 96.99, 67.27, 77.37, 101.77, 113.48, 100.05, 96.99, 67.27, 77.37, 101.77, 113.48, 100.05, 96.57, 66.97, 77.03, 101.32, 112.98, 99.62];
        const building_a_prices = [220165.00, 304411.00, 172375.00, 281024.00, 202404.00, 146365.00, 100261.00, 172826.00, 150536.00, 107414.00, 123794.00, 162826.00, 181560.00, 160084.00, 155181.00, 107625.00, 123794.00, 162826.00, 181560.00, 160084.00, 155181.00, 110988.00, 127662.00, 173003.00, 192908.00, 170090.00, 159335.00, 113854.00, 130959.00, 172250.00, 192069.00, 169350.00];
        const building_a_ids = [
            '10135.5061.74.1.1', '10135.5061.74.1.2', '10135.5061.74.1.3', '10135.5061.74.1.4', '10135.5061.74.1.5',
            '10135.5061.74.1.6', '10135.5061.74.1.7', '10135.5061.74.1.8', '10135.5061.74.1.9', '10135.5061.74.1.10',
            '10135.5061.74.1.11', '10135.5061.74.1.12', '10135.5061.74.1.13', '10135.5061.74.1.14', '10135.5061.74.1.15',
            '10135.5061.74.1.16', '10135.5061.74.1.17', '10135.5061.74.1.18', '10135.5061.74.1.19', '10135.5061.74.1.20',
            '10135.5061.74.1.21', '10135.5061.74.1.22', '10135.5061.74.1.23', '10135.5061.74.1.24', '10135.5061.74.1.25',
            '10135.5061.74.1.26', '10135.5061.74.1.27', '10135.5061.74.1.28', '10135.5061.74.1.29', '10135.5061.74.1.30',
            '10135.5061.74.1.31', '10135.5061.74.1.32'
        ];
        const building_a_types = ['мезонет', 'мезонет', '3 стаен', 'мезонет', '4 стаен', '2 стаен', '2 инвалиден', '3 стаен', '3 стаен', '2 стаен', '2 стаен', '3 стаен', '3 стаен', '3 стаен', '3 стаен', '2 стаен', '2 стаен', '3 стаен', '3 стаен', '3 стаен', '3 стаен', '2 стаен', '2 стаен', '3 стаен', '3 стаен', '3 стаен', '3 стаен', '2 стаен', '2 стаен', '3 стаен', '3 стаен', '3 стаен'];
        const building_b_ids = [
            '10135.5061.74.2.1', '10135.5061.74.2.2', '10135.5061.74.2.3', '10135.5061.74.2.4', '10135.5061.74.2.5',
            '10135.5061.74.2.6', '10135.5061.74.2.7', '10135.5061.74.2.8', '10135.5061.74.2.9', '10135.5061.74.2.10',
            '10135.5061.74.2.11', '10135.5061.74.2.12', '10135.5061.74.2.13', '10135.5061.74.2.14', '10135.5061.74.2.15',
            '10135.5061.74.2.16', '10135.5061.74.2.17', '10135.5061.74.2.18', '10135.5061.74.2.19', '10135.5061.74.2.20',
            '10135.5061.74.2.21', '10135.5061.74.2.22', '10135.5061.74.2.23', '10135.5061.74.2.24', '10135.5061.74.2.25',
            '10135.5061.74.2.26', '10135.5061.74.2.27', '10135.5061.74.2.28', '10135.5061.74.2.29', '10135.5061.74.2.30',
            '10135.5061.74.2.31', '10135.5061.74.2.32'
        ];
        const building_b_sizes = [137.60, 190.26, 107.73, 181.31, 134.94, 94.43, 62.66, 108.02, 97.12, 67.13, 77.37, 101.77, 113.48, 100.05, 96.99, 67.27, 77.37, 101.77, 113.48, 100.05, 96.99, 67.27, 77.37, 101.77, 113.48, 100.05, 96.57, 66.97, 77.03, 101.32, 112.98, 99.62];
        const building_b_prices = [220165.00, 304411.00, 161601.00, 271959.00, 215898.00, 151086.00, 100261.00, 167425.00, 155392.00, 107414.00, 127662.00, 162826.00, 175887.00, 160084.00, 155181.00, 110988.00, 127662.00, 162826.00, 175887.00, 160084.00, 160031.00, 110988.00, 127662.00, 167914.00, 181560.00, 160084.00, 164163.00, 113854.00, 130959.00, 172250.00, 186420.00, 159388.00];
        const building_b_types = [
            'мезонет', 'мезонет', '3 стаен', 'мезонет', '4 стаен',
            '3 стаен', '2 инвалид', '3 стаен', '3 стаен', '2 стаен',
            '2 стаен', '3 стаен', '3 стаен', '3 стаен', '3 стаен',
            '2 стаен', '2 стаен', '3 стаен', '3 стаен', '3 стаен',
            '3 стаен', '2 стаен', '2 стаен', '3 стаен', '3 стаен',
            '3 стаен', '3 стаен', '2 стаен', '2 стаен', '3 стаен',
            '3 стаен', '3 стаен'
        ];
        const building_c_sizes = [137.60, 190.26, 107.73, 181.31, 134.94, 94.43, 62.66, 108.02, 97.12, 67.13, 77.37, 101.77, 113.48, 100.05, 96.99, 67.27, 77.37, 101.77, 113.48, 100.05, 96.99, 67.27, 77.37, 101.77, 113.48, 100.05, 96.57, 66.97, 77.03, 101.32, 112.98, 99.62];
        const building_c_prices = [213285.00, 294898.00, 172375.00, 281024.00, 202404.00, 146365.00, 100261.00, 172826.00, 155392.00, 107414.00, 127662.00, 167914.00, 187234.00, 160084.00, 155181.00, 107625.00, 127662.00, 167914.00, 187234.00, 160084.00, 155181.00, 107625.00, 131531.00, 173003.00, 192908.00, 160084.00, 159335.00, 107157.00, 130959.00, 172250.00, 192069.00, 164369.00];
        const building_c_types = [
            'мезонет', 'мезонет', '3 стаен', 'мезонет', '4 стаен',
            '3 стаен', '2 инвалид', '2 стаен', '3 стаен', '2 стаен',
            '2 стаен', '3 стаен', '3 стаен', '3 стаен', '3 стаен',
            '2 стаен', '2 стаен', '3 стаен', '3 стаен', '3 стаен',
            '3 стаен', '2 стаен', '2 стаен', '3 стаен', '3 стаен',
            '3 стаен', '3 стаен', '2 стаен', '2 стаен', '3 стаен',
            '3 стаен', '3 стаен'
        ];
        const building_c_ids = [
            '10135.5061.74.3.1', '10135.5061.74.3.2', '10135.5061.74.3.3', '10135.5061.74.3.4', '10135.5061.74.3.5',
            '10135.5061.74.3.6', '10135.5061.74.3.7', '10135.5061.74.3.8', '10135.5061.74.3.9', '10135.5061.74.3.10',
            '10135.5061.74.3.11', '10135.5061.74.3.12', '10135.5061.74.3.13', '10135.5061.74.3.14', '10135.5061.74.3.15',
            '10135.5061.74.3.16', '10135.5061.74.3.17', '10135.5061.74.3.18', '10135.5061.74.3.19', '10135.5061.74.3.20',
            '10135.5061.74.3.21', '10135.5061.74.3.22', '10135.5061.74.3.23', '10135.5061.74.3.24', '10135.5061.74.3.25',
            '10135.5061.74.3.26', '10135.5061.74.3.27', '10135.5061.74.3.28', '10135.5061.74.3.29', '10135.5061.74.3.30',
            '10135.5061.74.3.31', '10135.5061.74.3.32'
        ];
        const building_d_sizes = [137.60, 190.26, 107.73, 181.31, 134.94, 94.43, 62.66, 108.02, 97.12, 67.13, 77.37, 101.77, 113.48, 100.05, 96.99, 67.27, 77.37, 101.77, 113.48, 100.05, 96.99, 67.27, 77.37, 101.77, 113.48, 100.05, 96.57, 66.97, 77.03, 101.32, 112.98, 99.62];
        const building_d_prices = [220165.00, 304411.00, 161601.00, 281024.00, 209151.00, 151086.00, 100261.00, 167425.00, 155392.00, 107414.00, 127662.00, 162826.00, 181560.00, 160084.00, 155181.00, 107625.00, 127662.00, 162826.00, 181560.00, 160084.00, 155181.00, 107625.00, 127662.00, 167914.00, 187234.00, 165087.00, 164163.00, 113854.00, 130959.00, 167184.00, 186420.00, 164369.00];
        const building_d_types = [
            'мезонет', 'мезонет', '3 стаен', 'мезонет', '4 стаен',
            '3 стаен', '2 инвалид', '3 стаен', '3 стаен', '2 стаен',
            '2 стаен', '3 стаен', '3 стаен', '3 стаен', '3 стаен',
            '2 стаен', '2 стаен', '3 стаен', '3 стаен', '3 стаен',
            '3 стаен', '2 стаен', '2 стаен', '3 стаен', '3 стаен',
            '3 стаен', '3 стаен', '2 стаен', '2 стаен', '3 стаен',
            '3 стаен', '3 стаен'
        ];
        const building_d_ids = [
            '10135.5061.74.4.1', '10135.5061.74.4.2', '10135.5061.74.4.3', '10135.5061.74.4.4', '10135.5061.74.4.5',
            '10135.5061.74.4.6', '10135.5061.74.4.7', '10135.5061.74.4.8', '10135.5061.74.4.9', '10135.5061.74.4.10',
            '10135.5061.74.4.11', '10135.5061.74.4.12', '10135.5061.74.4.13', '10135.5061.74.4.14', '10135.5061.74.4.15',
            '10135.5061.74.4.16', '10135.5061.74.4.17', '10135.5061.74.4.18', '10135.5061.74.4.19', '10135.5061.74.4.20',
            '10135.5061.74.4.21', '10135.5061.74.4.22', '10135.5061.74.4.23', '10135.5061.74.4.24', '10135.5061.74.4.25',
            '10135.5061.74.4.26', '10135.5061.74.4.27', '10135.5061.74.4.28', '10135.5061.74.4.29', '10135.5061.74.4.30',
            '10135.5061.74.4.31', '10135.5061.74.4.32'
        ];
        const building_e_ids = [
            '10135.5061.74.5.1', '10135.5061.74.5.2', '10135.5061.74.5.3', '10135.5061.74.5.4', '10135.5061.74.5.5',
            '10135.5061.74.5.6', '10135.5061.74.5.7', '10135.5061.74.5.8', '10135.5061.74.5.9', '10135.5061.74.5.10',
            '10135.5061.74.5.11', '10135.5061.74.5.12', '10135.5061.74.5.13', '10135.5061.74.5.14', '10135.5061.74.5.15',
            '10135.5061.74.5.16', '10135.5061.74.5.17', '10135.5061.74.5.18', '10135.5061.74.5.19', '10135.5061.74.5.20',
            '10135.5061.74.5.21', '10135.5061.74.5.22', '10135.5061.74.5.23', '10135.5061.74.5.24', '10135.5061.74.5.25',
            '10135.5061.74.5.26', '10135.5061.74.5.27', '10135.5061.74.5.28', '10135.5061.74.5.29', '10135.5061.74.5.30',
            '10135.5061.74.5.31', '10135.5061.74.5.32'
        ];
        const building_e_sizes = [137.60, 190.26, 107.73, 181.31, 134.94, 94.43, 62.66, 108.02, 97.12, 67.13, 77.37, 101.77, 113.48, 100.05, 96.99, 67.27, 77.37, 101.77, 113.48, 100.05, 96.99, 67.27, 77.37, 101.77, 113.48, 100.05, 96.57, 66.97, 77.03, 101.32, 112.98, 99.62];
        const building_e_prices = [213285.00, 294898.00, 161601.00, 281024.00, 202404.00, 146365.00, 100261.00, 167425.00, 155392.00, 107414.00, 123794.00, 162826.00, 175887.00, 160084.00, 155181.00, 107625.00, 123794.00, 162826.00, 181560.00, 160084.00, 160031.00, 110988.00, 127662.00, 173003.00, 192908.00, 165087.00, 164163.00, 113854.00, 130959.00, 172250.00, 192069.00, 169350.00];
        const building_e_types = [
            'мезонет', 'мезонет', '3 стаен', 'мезонет', '4 стаен',
            '3 стаен', '2 инвалид', '3 стаен', '3 стаен', '2 стаен',
            '2 стаен', '3 стаен', '3 стаен', '3 стаен', '3 стаен',
            '2 стаен', '2 стаен', '3 стаен', '3 стаен', '3 стаен',
            '3 стаен', '2 стаен', '2 стаен', '3 стаен', '3 стаен',
            '3 стаен', '3 стаен', '2 стаен', '2 стаен', '3 стаен',
            '3 стаен', '3 стаен'
        ];
        
        for (let building of buildings) {
            units[building] = [];
            const apt_count = building === 'building_a' ? 32 : building === 'building_b' ? 32 : building === 'building_c' ? 32 : building === 'building_d' ? 32 : building === 'building_e' ? 32 : 35;
            for (let i = 0; i < apt_count; i++) {
                let size, price, apt_id;
                if (building === 'building_a' && i < building_a_sizes.length) {
                    size = building_a_sizes[i];
                    price = building_a_prices[i];
                    apt_id = building_a_ids[i];
                } else if (building === 'building_b' && i < building_b_ids.length) {
                    size = building_b_sizes[i];
                    price = building_b_prices[i];
                    apt_id = building_b_ids[i];
                } else if (building === 'building_c' && i < building_c_ids.length) {
                    size = building_c_sizes[i];
                    price = building_c_prices[i];
                    apt_id = building_c_ids[i];
                } else if (building === 'building_d' && i < building_d_ids.length) {
                    size = building_d_sizes[i];
                    price = building_d_prices[i];
                    apt_id = building_d_ids[i];
                } else if (building === 'building_e' && i < building_e_ids.length) {
                    size = building_e_sizes[i];
                    price = building_e_prices[i];
                    apt_id = building_e_ids[i];
                } else {
                    size = 50 + (i * 5) % 100;
                    price = size * 850;
                    apt_id = building + '_apt' + (i+1);
                }
                units[building].push({
                    'id': apt_id,
                    'name': 'Апартамент ' + (i+1),
                    'type': 'apartment',
                    'sqm': size,
                    'price': price,
                    'status': 'free',
                    'aptType': (building === 'building_a' && i < building_a_types.length) ? building_a_types[i] : (building === 'building_b' && i < building_b_types.length) ? building_b_types[i] : (building === 'building_c' && i < building_c_types.length) ? building_c_types[i] : (building === 'building_d' && i < building_d_types.length) ? building_d_types[i] : (building === 'building_e' && i < building_e_types.length) ? building_e_types[i] : ''
                });
            }
        }
        
        const parkingDisabled = [1, 2, 58, 59, 113, 114, 154, 175];
        units['parking'] = [];
        for (let i = 1; i <= 191; i++) {
            const id = parkingDisabled.includes(i) ? 'ПМ ' + i + ' инвалидно' : 'ПМ ' + i;
            units['parking'].push({
                'id': id,
                'name': 'Паркомясто ' + i,
                'type': 'parking',
                'sqm': 12,
                'price': 8500,
                'status': 'free'
            });
        }
        
        return units;
    }

    addContract(contract) {
        contract.id = 'contract_' + Date.now();
        this.contracts.push(contract);
        this.saveData('contracts', this.contracts);
        return contract;
    }

    updateContract(id, data) {
        const idx = this.contracts.findIndex(c => c.id === id);
        if (idx === -1) return;
        this.contracts[idx] = { ...this.contracts[idx], ...data };
        this.saveData('contracts', this.contracts);
    }

    deleteContract(id) {
        this.contracts = this.contracts.filter(c => c.id !== id);
        this.saveData('contracts', this.contracts);
    }

    addPayment(payment) {
        payment.id = 'payment_' + Date.now();
        this.payments.push(payment);
        this.saveData('payments', this.payments);
        return payment;
    }

    deletePayment(id) {
        this.payments = this.payments.filter(p => p.id !== id);
        this.saveData('payments', this.payments);
    }

    addInvoice(invoice) {
        invoice.id = 'invoice_' + Date.now();
        this.invoices.push(invoice);
        this.saveData('invoices', this.invoices);
        return invoice;
    }

    deleteInvoice(id) {
        this.invoices = this.invoices.filter(i => i.id !== id);
        this.saveData('invoices', this.invoices);
    }

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

const tabsSentinel = document.createElement('div');
tabsSentinel.style.height = '1px';
tabsSentinel.style.width = '1px';
document.querySelector('.tabs').parentNode.insertBefore(tabsSentinel, document.querySelector('.tabs'));
const tabsObserver = new IntersectionObserver(
    ([e]) => document.querySelector('.tabs').classList.toggle('stuck', !e.isIntersecting),
    { threshold: [0] }
);
tabsObserver.observe(tabsSentinel);

function parseMoney(value) {
    if (typeof value === 'number') return Math.round(value * 100) / 100;
    let str = String(value || '').replace(/[^0-9.,-]/g, '').replace(',', '.');
    if (!str || str === '.') return 0;
    let num = parseFloat(str);
    if (isNaN(num)) return 0;
    return Math.round(num * 100) / 100;
}

function formatPrice(price) {
    let num = parseMoney(price);
    let str = num.toFixed(2);
    let parts = str.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
}

function autoDecimals(el) {
    let val = el.value;
    if (val && !val.includes('.') && !val.includes(',')) {
        el.value = val + '.00';
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'contracts') {
        renderContracts();
    } else if (tabName === 'payments') {
        renderPayments();
        renderInvoices();
    }
}

function updateDashboard() {
    const stats = appData.getStats();
    let html = '';

    const buildings = ['building_a', 'building_b', 'building_c', 'building_d', 'building_e'];

    for (let building of buildings) {
        const stat = stats[building];
        html += `
            <div class="summary-card clickable" onclick="openBuildingDetail('${building}')">
                <h3>${buildingNames[building]}</h3>
                <div class="summary-item">
                    <span class="summary-label">Апартаменти:</span>
                    <span class="summary-value">${stat.totalUnits}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Оставащи:</span>
                    <span class="summary-value">${stat.availableUnits}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Активни договори:</span>
                    <span class="summary-value">${stat.contractCount}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Обща стойност:</span>
                    <span class="summary-value">${formatPrice(stat.totalValue)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Събрано:</span>
                    <span class="summary-value positive">${formatPrice(stat.totalPaid)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Остатък:</span>
                    <span class="summary-value negative">${formatPrice(stat.remaining)}</span>
                </div>
                <div class="view-more">Виж всички имоти →</div>
            </div>
        `;
    }

    const p = stats.parking;
    html += `
        <div class="summary-card clickable" onclick="openParkingDetail()">
            <h3>Паркоместа</h3>
            <div class="summary-item">
                <span class="summary-label">Общо:</span>
                <span class="summary-value">${p.total}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Продадени:</span>
                <span class="summary-value positive">${p.sold}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Свободни:</span>
                <span class="summary-value negative">${p.available}</span>
            </div>
            <div class="view-more">Виж всички паркоместа →</div>
        </div>
    `;

    document.getElementById('dashboardSummary').innerHTML = html;

    const totalContracts = appData.contracts.length;
    const totalValue = appData.contracts.reduce((sum, c) => sum + parseMoney(c.totalValue || 0), 0);
    const totalPaid = appData.payments.reduce((sum, p) => sum + parseMoney(p.amount || 0), 0);
    const remaining = totalValue - totalPaid;

    document.getElementById('totalContracts').textContent = totalContracts;
    document.getElementById('totalContractValue').textContent = formatPrice(totalValue);
    document.getElementById('totalPaid').textContent = formatPrice(totalPaid);
    document.getElementById('totalRemaining').textContent = formatPrice(remaining);
}

function openBuildingDetail(building) {
    document.getElementById('apartmentsModalTitle').textContent = buildingNames[building];
    const units = appData.units[building] ? appData.units[building].filter(u => u.type === 'apartment') : [];
    
    let deleteOptions = '<option value="">Избери апартамент...</option>';
    units.forEach((unit, index) => {
        const originalIndex = appData.units[building].indexOf(unit);
        deleteOptions += '<option value="' + originalIndex + '">' + unit.name + ' (' + unit.id + ')</option>';
    });

    document.getElementById('apartmentsModalActions').innerHTML = `
        <select id="deleteUnitSelect" class="status-select">
            ${deleteOptions}
        </select>
        <button class="danger small" onclick="deleteSelectedUnit('${building}')">🗑️ Изтрий</button>
        <button class="small" onclick="openAddUnitModal('${building}', 'apartment')">➕ Нов апартамент</button>
    `;
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th style="width:40px"></th>
                    <th>Идентификатор</th>
                    <th>Апартамент</th>
                    <th>Вид</th>
                    <th>Квадратура (м²)</th>
                    <th>Цена (€)</th>
                    <th>Статус</th>
                </tr>
            </thead>
            <tbody>
    `;

    units.forEach((unit, index) => {
        const originalIndex = appData.units[building].indexOf(unit);
        const status = unit.status || 'free';
        const statusClass = status === 'sold' ? 'status-sold' : status === 'reserved' ? 'status-reserved' : 'status-available';
        const statusOptions = `
            <select class="status-select ${statusClass}" onchange="updateUnitStatus('${building}', ${originalIndex}, this.value, this)">
                <option value="free" ${status === 'free' ? 'selected' : ''}>Свободен</option>
                <option value="reserved" ${status === 'reserved' ? 'selected' : ''}>Резервиран</option>
                <option value="sold" ${status === 'sold' ? 'selected' : ''}>Продаден</option>
            </select>
        `;
        
        html += `
            <tr>
                <td data-label="" style="text-align:center"><input type="checkbox" onclick="toggleRowHighlight(this.closest('tr'))"></td>
                <td data-label="Идентификатор">${unit.id}</td>
                <td data-label="Апартамент">${unit.name}</td>
                <td data-label="Вид">${unit.aptType || '-'}</td>
                <td data-label="Квадратура">${unit.sqm ? unit.sqm.toFixed(2) : '-'}</td>
                <td data-label="Цена">${unit.price ? formatPrice(unit.price) : '-'}&nbsp;&nbsp;<button class="small secondary" onclick="editPrice('${building}', ${originalIndex})" title="Редактирай цена">✏️</button></td>
                <td data-label="Статус">${statusOptions}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    document.getElementById('apartmentsList').innerHTML = html;
    document.getElementById('apartmentsModal').classList.add('active');
    document.body.classList.add('modal-open');
}

function openParkingDetail() {
    document.getElementById('apartmentsModalTitle').textContent = 'Паркоместа';
    const parkingUnits = appData.units['parking'] || [];

    let deleteOptions = '<option value="">Избери паркомясто...</option>';
    parkingUnits.forEach((unit, index) => {
        deleteOptions += '<option value="' + index + '">' + unit.name + ' (' + unit.id + ')</option>';
    });

    document.getElementById('apartmentsModalActions').innerHTML = `
        <select id="deleteUnitSelect" class="status-select">
            ${deleteOptions}
        </select>
        <button class="danger small" onclick="deleteSelectedUnit('parking')">🗑️ Изтрий</button>
        <button class="small" onclick="openAddUnitModal('parking', 'parking')">➕ Ново паркомясто</button>
    `;
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th style="width:40px"></th>
                    <th>Идентификатор</th>
                    <th>Име</th>
                    <th>Цена</th>
                    <th>Статус</th>
                </tr>
            </thead>
            <tbody>
    `;

    parkingUnits.forEach((unit, index) => {
        const status = unit.status || 'free';
        const statusClass = status === 'sold' ? 'status-sold' : status === 'reserved' ? 'status-reserved' : 'status-available';
        const statusOptions = `
            <select class="status-select ${statusClass}" onchange="updateUnitStatus('parking', ${index}, this.value, this)">
                <option value="free" ${status === 'free' ? 'selected' : ''}>Свободен</option>
                <option value="reserved" ${status === 'reserved' ? 'selected' : ''}>Резервиран</option>
                <option value="sold" ${status === 'sold' ? 'selected' : ''}>Продаден</option>
            </select>
        `;
        
        html += `
            <tr>
                <td data-label="" style="text-align:center"><input type="checkbox" onclick="toggleRowHighlight(this.closest('tr'))"></td>
                <td data-label="Идентификатор">${unit.id}</td>
                <td data-label="Име">${unit.name}</td>
                <td data-label="Цена">${unit.price ? formatPrice(unit.price) : '-'}&nbsp;&nbsp;<button class="small secondary" onclick="editPrice('parking', ${index})" title="Редактирай цена">✏️</button></td>
                <td data-label="Статус">${statusOptions}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    document.getElementById('apartmentsList').innerHTML = html;
    document.getElementById('apartmentsModal').classList.add('active');
    document.body.classList.add('modal-open');
}

function updateUnitStatus(building, index, status, selectEl) {
    if (!appData.units[building] || !appData.units[building][index]) return;
    appData.units[building][index].status = status;
    appData.saveData('units', appData.units);
    
    if (selectEl) {
        selectEl.className = 'status-select ' + (status === 'sold' ? 'status-sold' : status === 'reserved' ? 'status-reserved' : 'status-available');
    }
}

function editPrice(building, index) {
    if (!appData.units[building] || !appData.units[building][index]) return;
    const unit = appData.units[building][index];
    const newPrice = prompt('Нова цена за ' + unit.name + ' (в €):', unit.price);
    if (newPrice === null) return;
    const num = parseMoney(newPrice);
    if (isNaN(num) || num <= 0) {
        alert('Моля, въведете валидна цена!');
        return;
    }
    unit.price = num;
    appData.saveData('units', appData.units);
    openBuildingDetail(building);
}

function closeApartmentsModal() {
    document.getElementById('apartmentsModal').classList.remove('active');
    document.body.classList.remove('modal-open');
}

function deleteSelectedUnit(building) {
    const select = document.getElementById('deleteUnitSelect');
    if (!select) return;
    const index = parseInt(select.value);
    if (isNaN(index)) {
        alert('Моля, изберете имот за изтриване!');
        return;
    }
    const unit = appData.units[building] ? appData.units[building][index] : null;
    if (!unit) return;

    if (!confirm('Сигурен ли си, че искаш да изтриеш "' + unit.name + '" (' + unit.id + ')?\nТова е необратимо!')) return;

    appData.units[building].splice(index, 1);
    appData.saveData('units', appData.units);

    if (building === 'parking') {
        openParkingDetail();
    } else {
        openBuildingDetail(building);
    }
}

let currentAddUnitBuilding = '';
let currentAddUnitType = '';

function openAddUnitModal(building, type) {
    currentAddUnitBuilding = building;
    currentAddUnitType = type;
    document.getElementById('addUnitBuilding').value = building;
    document.getElementById('addUnitType').value = type;
    document.getElementById('addUnitModalTitle').textContent = type === 'parking' ? 'Ново паркомясто' : 'Нов апартамент';
    document.getElementById('addUnitId').value = '';
    document.getElementById('addUnitName').value = '';
    document.getElementById('addUnitSqm').value = '';
    document.getElementById('addUnitPrice').value = '';
    document.getElementById('addUnitAptTypeGroup').style.display = type === 'parking' ? 'none' : 'block';
    document.getElementById('addUnitModal').classList.add('active');
}

function closeAddUnitModal() {
    document.getElementById('addUnitModal').classList.remove('active');
}

function saveNewUnit(event) {
    event.preventDefault();
    const building = currentAddUnitBuilding;
    const type = currentAddUnitType;

    if (!appData.units[building]) {
        appData.units[building] = [];
    }

    const newUnit = {
        id: document.getElementById('addUnitId').value.trim(),
        name: document.getElementById('addUnitName').value.trim(),
        type: type,
        sqm: parseMoney(document.getElementById('addUnitSqm').value || 0),
        price: parseMoney(document.getElementById('addUnitPrice').value || 0),
        status: 'free'
    };

    if (type === 'apartment') {
        newUnit.aptType = document.getElementById('addUnitAptType').value;
    }

    const exists = appData.units[building].some(u => u.id === newUnit.id);
    if (exists) {
        alert('Вече съществува имот с ID: ' + newUnit.id);
        return;
    }

    appData.units[building].push(newUnit);
    appData.saveData('units', appData.units);
    closeAddUnitModal();

    if (type === 'parking') {
        openParkingDetail();
    } else {
        openBuildingDetail(building);
    }
}

function toggleRowHighlight(row) {
    row.classList.toggle('row-highlighted');
    const checkbox = row.querySelector('input[type="checkbox"]');
    if (checkbox) checkbox.checked = row.classList.contains('row-highlighted');
}

let editingContractId = null;

function openContractModal() {
    editingContractId = null;
    document.getElementById('contractModal').classList.add('active');
    document.querySelector('#contractModal .modal-header span').textContent = 'Нов договор';
    document.getElementById('contractForm').reset();
    document.getElementById('contractDate').valueAsDate = new Date();
    document.getElementById('advanceDate').valueAsDate = new Date();
    document.getElementById('installment1Date').valueAsDate = new Date(Date.now() + 30*24*60*60*1000);
    document.getElementById('installment2Date').valueAsDate = new Date(Date.now() + 60*24*60*60*1000);
    document.getElementById('extraInstallmentsContainer').innerHTML = '';
    extraInstallmentCounter = 0;
    populateApartmentsSelect();
    populateParkingSelect();
    updateInstallmentAmounts();
}

function closeContractModal() {
    document.getElementById('contractModal').classList.remove('active');
}

function populateApartmentsSelect() {
    const building = document.getElementById('apartmentBuilding').value;
    const select = document.getElementById('apartmentUnit');
    select.innerHTML = '<option value="">Изберете апартамент</option>';
    if (!building) return;
    
    const apartments = appData.units[building] ? appData.units[building].filter(u => u.type === 'apartment') : [];
    apartments.forEach(unit => {
        select.innerHTML += '<option value="' + unit.id + '">' + unit.name + '</option>';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const apartmentBuildingSelect = document.getElementById('apartmentBuilding');
    if (apartmentBuildingSelect) {
        apartmentBuildingSelect.addEventListener('change', populateApartmentsSelect);
    }

    const apartmentUnitSelect = document.getElementById('apartmentUnit');
    if (apartmentUnitSelect) {
        apartmentUnitSelect.addEventListener('change', function() {
            const building = document.getElementById('apartmentBuilding').value;
            const unitId = this.value;
            if (building && unitId) {
                const unit = (appData.units[building] || []).find(u => u.id === unitId);
                if (unit && unit.price) {
                    document.getElementById('apartmentValue').value = formatPrice(unit.price);
                    updateInstallmentAmounts();
                }
            }
        });
    }

    if (document.getElementById('parkingUnit')) {
        populateParkingSelect();
    }

    const parkingUnitSelect = document.getElementById('parkingUnit');
    if (parkingUnitSelect) {
        parkingUnitSelect.addEventListener('change', function() {
            const unitId = this.value;
            if (unitId) {
                const unit = (appData.units['parking'] || []).find(u => u.id === unitId);
                if (unit && unit.price) {
                    document.getElementById('parkingValue').value = formatPrice(unit.price);
                    updateInstallmentAmounts();
                }
            } else {
                document.getElementById('parkingValue').value = '';
                updateInstallmentAmounts();
            }
        });
    }
});

function populateParkingSelect() {
    const select = document.getElementById('parkingUnit');
    if (!select) return;
    select.innerHTML = '<option value="">Без паркомясто</option>';
    const parkingUnits = appData.units['parking'] || [];
    parkingUnits.forEach(unit => {
        select.innerHTML += '<option value="' + unit.id + '">' + unit.name + '</option>';
    });
}

function saveContract(event) {
    event.preventDefault();
    
    const building = document.getElementById('apartmentBuilding').value;
    const unit = document.getElementById('apartmentUnit').value;
    const apartmentValue = parseMoney(document.getElementById('apartmentValue').value || 0);
    
    const parkingUnit = document.getElementById('parkingUnit').value;
    const parkingValue = parseMoney(document.getElementById('parkingValue').value || 0);
    
    const hasApartment = !!building;
    const hasParking = !!parkingUnit;
    
    if (hasApartment && (!apartmentValue || apartmentValue <= 0)) {
        alert('Моля, въведи стойност на апартамента!');
        return;
    }
    
    if (hasParking && (!parkingValue || parkingValue <= 0)) {
        alert('Моля, въведи стойност на паркомястото!');
        return;
    }
    
    if (!hasApartment && !hasParking) {
        alert('Моля, избери апартамент или паркомясто!');
        return;
    }
    
    const totalValue = apartmentValue + parkingValue;
    
    if (totalValue <= 0) {
        alert('Моля, въведи стойност на имота!');
        return;
    }

    const data = {
        owner: document.getElementById('contractOwner').value,
        phone: document.getElementById('contractPhone').value,
        number: document.getElementById('contractNumber').value,
        date: document.getElementById('contractDate').value,
        totalValue: totalValue,
        advance: {
            percent: parseFloat(document.getElementById('advancePercent').value),
            date: document.getElementById('advanceDate').value
        },
        installment1: {
            percent: parseFloat(document.getElementById('installment1Percent').value),
            date: document.getElementById('installment1Date').value
        },
        installment2: {
            percent: parseFloat(document.getElementById('installment2Percent').value),
            date: document.getElementById('installment2Date').value
        },
        extraInstallments: getExtraInstallments(),
        notes: document.getElementById('contractNotes').value
    };

    if (hasApartment) {
        data.apartment = { building: building, unit: unit, value: apartmentValue };
    }

    if (hasParking) {
        data.parking = { unit: parkingUnit, value: parkingValue };
    }

    if (editingContractId) {
        appData.updateContract(editingContractId, data);
    } else {
        appData.addContract(data);
    }
    closeContractModal();
    renderContracts();
    populateContractSelects();
    populateContractFilters();
    alert('✅ Договорът е запазен успешно!');
}

function filterContracts() {
    renderContracts();
}

function populateContractFilters() {
    const buildingSelect = document.getElementById('contractFilterBuilding');
    if (buildingSelect && buildingSelect.options.length <= 1) {
        Object.keys(buildingNames).forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = buildingNames[key];
            buildingSelect.appendChild(opt);
        });
    }

    const ownerSelect = document.getElementById('contractFilterOwner');
    if (ownerSelect && ownerSelect.options.length <= 1) {
        const owners = [...new Set(appData.contracts.map(c => c.owner).filter(Boolean))];
        owners.sort();
        owners.forEach(owner => {
            const opt = document.createElement('option');
            opt.value = owner;
            opt.textContent = owner;
            ownerSelect.appendChild(opt);
        });
    }
}

function renderContracts() {
    let html = '';

    const filterBuilding = document.getElementById('contractFilterBuilding') ? document.getElementById('contractFilterBuilding').value : '';
    const filterParking = document.getElementById('contractFilterParking') ? document.getElementById('contractFilterParking').value : '';
    const filterOwner = document.getElementById('contractFilterOwner') ? document.getElementById('contractFilterOwner').value : '';

    let contractsToShow = appData.contracts.slice();

    if (filterBuilding) {
        contractsToShow = contractsToShow.filter(c => c.apartment && c.apartment.building === filterBuilding);
    }

    if (filterParking === 'with') {
        contractsToShow = contractsToShow.filter(c => !!c.parking && !!c.parking.unit);
    } else if (filterParking === 'without') {
        contractsToShow = contractsToShow.filter(c => !c.parking || !c.parking.unit);
    }

    if (filterOwner) {
        contractsToShow = contractsToShow.filter(c => c.owner === filterOwner);
    }

    contractsToShow.forEach(contract => {
        let unitInfo = '';
        let building = '';
        
        if (contract.apartment && contract.apartment.building) {
            building = buildingNames[contract.apartment.building] || contract.apartment.building;
            if (contract.apartment.unit) {
                const apartmentUnit = appData.units[contract.apartment.building] ? appData.units[contract.apartment.building].find(u => u.id === contract.apartment.unit) : null;
                unitInfo = apartmentUnit ? apartmentUnit.name : contract.apartment.unit;
            }
        }
        
        if (contract.parking && contract.parking.unit) {
            const parkingUnits = appData.units['parking'] || [];
            const parkingUnit = parkingUnits.find(u => u.id === contract.parking.unit);
            const parkingInfo = parkingUnit ? parkingUnit.name : contract.parking.unit;
            unitInfo = unitInfo ? unitInfo + ' + ' + parkingInfo : parkingInfo;
        }
        
        if (!unitInfo) unitInfo = 'Без имот';
        if (!building) building = 'Н/О';
        
        html += `
            <tr class="contract-row" onclick="openContractDetail('${contract.id}')" style="cursor: pointer;">
                <td data-label="Сграда">${building}</td>
                <td data-label="Имот">${unitInfo}</td>
                <td data-label="Собственик">${contract.owner}</td>
                <td data-label="Стойност">${formatPrice(parseMoney(contract.totalValue || 0))}</td>
                <td data-label="Аванс">${contract.advance ? contract.advance.percent : 0}% (${new Date(contract.advance ? contract.advance.date : new Date()).toLocaleDateString('bg-BG')})</td>
                <td data-label="Доплащания">${(() => { const insts = getAllInstallments(contract).filter(s => s.type !== 'advance' && s.percent > 0); return insts.map(s => s.percent + '%').join(' + '); })()}</td>
                <td data-label="Действия">
                    <button class="secondary small" onclick="event.stopPropagation(); editContract('${contract.id}')">✏️</button>
                    <button class="danger small" onclick="event.stopPropagation(); if(confirm('Сигурен ли си?')) deleteContractItem('${contract.id}')">🗑️</button>
                </td>
            </tr>
        `;
    });

    document.getElementById('contractsTable').innerHTML = html || '<tr><td colspan="7" style="text-align: center; padding: 20px;">Няма договори. Създай нов договор!</td></tr>';
}

function openContractDetail(id) {
    const contract = appData.contracts.find(c => c.id === id);
    if (!contract) return;

    const payments = appData.getPaymentsByContract(id);
    const totalPaid = payments.reduce((sum, p) => sum + parseMoney(p.amount || 0), 0);
    const totalValue = parseMoney(contract.totalValue || 0);
    const remaining = totalValue - totalPaid;

    let buildingName = 'Н/О';
    let unitName = 'Без имот';
    let unitSqm = '';
    let unitType = '';
    let unitId = '';
    let parkingName = '';

    if (contract.apartment && contract.apartment.building) {
        buildingName = buildingNames[contract.apartment.building] || contract.apartment.building;
        if (contract.apartment.unit) {
            const unit = appData.units[contract.apartment.building] ? appData.units[contract.apartment.building].find(u => u.id === contract.apartment.unit) : null;
            if (unit) {
                unitName = unit.name;
                unitSqm = unit.sqm ? unit.sqm.toFixed(2) + ' м²' : '';
                unitType = unit.aptType || '';
                unitId = unit.id;
            }
        }
    }

    if (contract.parking && contract.parking.unit) {
        const parkingUnits = appData.units['parking'] || [];
        const parkingUnit = parkingUnits.find(u => u.id === contract.parking.unit);
        parkingName = parkingUnit ? parkingUnit.name : contract.parking.unit;
    }

    const methodNames = { 'cash': 'Брой', 'bank': 'Банков превод', 'check': 'Чек' };
    const typeNames = getInstallmentTypeNames(contract);
    const allInsts = getAllInstallments(contract);

    let scheduleRows = '';
    allInsts.forEach(sch => {
        if (sch.percent <= 0) return;
        const schAmount = totalValue * sch.percent / 100;
        const schPaid = payments.filter(p => p.type === sch.type).reduce((s, p) => s + parseMoney(p.amount || 0), 0);
        const schRemaining = schAmount - schPaid;
        const schStatus = schRemaining <= 0 ? '<span class="status-paid">✓ Платено</span>' : '<span class="status-pending">Чакаща сума: ' + formatPrice(schRemaining) + '</span>';
        scheduleRows += `<tr>
            <td data-label="Етап">${typeNames[sch.type] || sch.type}</td>
            <td data-label="Процент">${sch.percent}%</td>
            <td data-label="Сума">${formatPrice(schAmount)} EUR</td>
            <td data-label="Дата">${sch.date ? new Date(sch.date).toLocaleDateString('bg-BG') : '-'}</td>
            <td data-label="Платено">${formatPrice(schPaid)} EUR</td>
            <td data-label="Статус">${schStatus}</td>
        </tr>`;
    });

    let paymentsHtml = '';
    if (payments.length > 0) {
        paymentsHtml = '<table><thead><tr><th>Дата</th><th>Тип</th><th>Сума</th><th>Валута</th><th>Метод</th><th>Бележки</th></tr></thead><tbody>';
        payments.forEach(p => {
            paymentsHtml += `<tr>
                <td data-label="Дата">${new Date(p.date).toLocaleDateString('bg-BG')}</td>
                <td data-label="Тип">${typeNames[p.type] || p.type || ''}</td>
                <td data-label="Сума">${formatPrice(p.amount)}</td>
                <td data-label="Валута">${p.currency || 'EUR'}</td>
                <td data-label="Метод">${methodNames[p.method] || p.method || ''}</td>
                <td data-label="Бележки">${p.notes || ''}</td>
            </tr>`;
        });
        paymentsHtml += '</tbody></table>';
    } else {
        paymentsHtml = '<p style="text-align:center; color:#999; padding: 15px;">Няма записани плащания.</p>';
    }

    const progressPercent = totalValue > 0 ? Math.round((totalPaid / totalValue) * 100) : 0;

    document.getElementById('contractDetailTitle').textContent = 'Договор — ' + contract.owner;
    document.getElementById('contractDetailContent').innerHTML = `
        <div class="detail-section">
            <h4>Информация за имота</h4>
            <div class="detail-grid">
                ${buildingName !== 'Н/О' ? '<div class="detail-item"><span class="detail-label">Сграда:</span><span class="detail-value">' + buildingName + '</span></div>' : ''}
                ${unitName !== 'Без имот' ? '<div class="detail-item"><span class="detail-label">Апартамент:</span><span class="detail-value">' + unitName + '</span></div>' : ''}
                ${unitId ? '<div class="detail-item"><span class="detail-label">ID:</span><span class="detail-value">' + unitId + '</span></div>' : ''}
                ${unitType ? '<div class="detail-item"><span class="detail-label">Вид:</span><span class="detail-value">' + unitType + '</span></div>' : ''}
                ${unitSqm ? '<div class="detail-item"><span class="detail-label">Квадратура:</span><span class="detail-value">' + unitSqm + '</span></div>' : ''}
                ${parkingName ? '<div class="detail-item"><span class="detail-label">Паркомясто:</span><span class="detail-value">' + parkingName + '</span></div>' : ''}
            </div>
        </div>

        <div class="detail-section">
            <h4>Данни за собственика</h4>
            <div class="detail-grid">
                <div class="detail-item"><span class="detail-label">Име:</span><span class="detail-value">${contract.owner || ''}</span></div>
                <div class="detail-item"><span class="detail-label">Телефон:</span><span class="detail-value">${contract.phone || '-'}</span></div>
                <div class="detail-item"><span class="detail-label">Дата на договор:</span><span class="detail-value">${contract.date ? new Date(contract.date).toLocaleDateString('bg-BG') : '-'}</span></div>
            </div>
            ${contract.notes ? '<div style="margin-top: 10px;"><span class="detail-label">Бележки:</span><div style="margin-top: 5px; padding: 8px; background: #f8f9fa; border-radius: 4px;">' + contract.notes + '</div></div>' : ''}
        </div>

        <div class="detail-section">
            <h4>Финансова информация</h4>
            <div class="detail-grid">
                <div class="detail-item"><span class="detail-label">Обща стойност:</span><span class="detail-value" style="font-size: 1.1em; font-weight: 700;">${formatPrice(totalValue)} EUR</span></div>
                <div class="detail-item"><span class="detail-label">Платено:</span><span class="detail-value" style="color: #27ae60;">${formatPrice(totalPaid)} EUR</span></div>
                <div class="detail-item"><span class="detail-label">Остатък:</span><span class="detail-value" style="color: #e74c3c;">${formatPrice(remaining)} EUR</span></div>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${progressPercent}%"></div>
                <span class="progress-text">${progressPercent}%</span>
            </div>
        </div>

        <div class="detail-section">
            <h4>График на плащане</h4>
            <table>
                <thead><tr><th>Етап</th><th>Процент</th><th>Сума</th><th>Дата</th><th>Платено</th><th>Статус</th></tr></thead>
                <tbody>
                    ${scheduleRows}
                </tbody>
            </table>
        </div>

        <div class="detail-section">
            <h4>История на плащанията (${payments.length})</h4>
            ${paymentsHtml}
        </div>
    `;

    document.getElementById('contractDetailModal').classList.add('active');
    document.body.classList.add('modal-open');
}

function closeContractDetail() {
    document.getElementById('contractDetailModal').classList.remove('active');
    document.body.classList.remove('modal-open');
}

function deleteContractItem(id) {
    appData.deleteContract(id);
    renderContracts();
    populateContractSelects();
    populateContractFilters();
}

let editingPaymentId = null;
let editingInvoiceId = null;

function openPaymentModal() {
    editingPaymentId = null;
    document.querySelector('#paymentModal .modal-header span').textContent = 'Ново плащане';
    document.getElementById('paymentModal').classList.add('active');
    document.getElementById('paymentPropertyType').value = '';
    document.getElementById('paymentUnitInfo').value = '';
    populatePaymentSelects();
    document.getElementById('paymentDate').valueAsDate = new Date();
}

function editPayment(id) {
    const payment = appData.payments.find(p => p.id === id);
    if (!payment) return;

    editingPaymentId = id;
    document.querySelector('#paymentModal .modal-header span').textContent = 'Редактиране на плащане';
    populatePaymentSelects();
    document.getElementById('paymentContract').value = payment.contractId;
    populatePaymentDetails();
    document.getElementById('paymentDate').value = payment.date || '';
    document.getElementById('paymentAmount').value = payment.amount || '';
    document.getElementById('paymentType').value = payment.type || '';
    document.getElementById('paymentPropertyType').value = payment.propertyType || '';
    document.getElementById('paymentMethod').value = payment.method || '';
    document.getElementById('paymentNotes').value = payment.notes || '';
    document.getElementById('paymentModal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

function populatePaymentSelects() {
    const select = document.getElementById('paymentContract');
    select.innerHTML = '<option value="">Изберете договор</option>';
    
    appData.contracts.forEach(contract => {
        let unitName = '';
        if (contract.apartment && contract.apartment.building) {
            const building = contract.apartment.building;
            const unitId = contract.apartment.unit;
            const unit = appData.units[building] ? appData.units[building].find(u => u.id === unitId) : null;
            unitName = unit ? unit.name : '';
        } else if (contract.parking && contract.parking.unit) {
            const parkingUnits = appData.units['parking'] || [];
            const parkingUnit = parkingUnits.find(u => u.id === contract.parking.unit);
            unitName = parkingUnit ? parkingUnit.name : contract.parking.unit;
        }
        select.innerHTML += '<option value="' + contract.id + '">' + contract.owner + ' - ' + unitName + '</option>';
    });
}

function populateContractSelects() {
    populatePaymentSelects();
    
    const invoiceSelect = document.getElementById('invoiceContract');
    if (invoiceSelect) {
        invoiceSelect.innerHTML = '<option value="">Изберете договор</option>';
        
        appData.contracts.forEach(contract => {
            const building = contract.apartment ? contract.apartment.building : '';
            const unitId = contract.apartment ? contract.apartment.unit : '';
            const unit = appData.units[building] ? appData.units[building].find(u => u.id === unitId) : null;
            invoiceSelect.innerHTML += '<option value="' + contract.id + '">' + contract.owner + ' - ' + (unit ? unit.name : '') + '</option>';
        });
    }
}

function savePayment(event) {
    event.preventDefault();
    const paymentData = {
        date: document.getElementById('paymentDate').value,
        contractId: document.getElementById('paymentContract').value,
        amount: parseMoney(document.getElementById('paymentAmount').value),
        currency: document.getElementById('paymentCurrency').value,
        type: document.getElementById('paymentType').value,
        propertyType: document.getElementById('paymentPropertyType').value,
        method: document.getElementById('paymentMethod').value,
        notes: document.getElementById('paymentNotes').value,
        status: 'paid'
    };

    if (editingPaymentId) {
        const payment = appData.payments.find(p => p.id === editingPaymentId);
        if (payment) {
            Object.assign(payment, paymentData);
            appData.saveData('payments', appData.payments);
        }
        alert('✅ Плащането е редактирано успешно!');
    } else {
        appData.addPayment(paymentData);
        alert('✅ Плащане запазено успешно!');
    }

    editingPaymentId = null;
    closePaymentModal();
    renderPayments();
}

function renderPayments(filters) {
    const propertyTypeNames = { 'apartment': 'Апартамент', 'parking': 'Паркомясто' };
    let html = '';

    const filterBuilding = filters ? filters.building : (document.getElementById('paymentFilterBuilding') ? document.getElementById('paymentFilterBuilding').value : '');
    const filterStatus = filters ? filters.status : (document.getElementById('paymentFilterStatus') ? document.getElementById('paymentFilterStatus').value : '');

    let allRows = [];

    appData.contracts.forEach(contract => {
        const totalValue = parseMoney(contract.totalValue || 0);
        if (totalValue <= 0) return;

        let buildingLabel = '';
        let unitLabel = '';
        let contractBuilding = '';
        let propertyType = 'apartment';

        if (contract.apartment && contract.apartment.building) {
            contractBuilding = contract.apartment.building;
            buildingLabel = buildingNames[contract.apartment.building] || contract.apartment.building;
            if (contract.apartment.unit) {
                const unit = appData.units[contract.apartment.building] ? appData.units[contract.apartment.building].find(u => u.id === contract.apartment.unit) : null;
                unitLabel = unit ? unit.name : '';
            }
        } else {
            propertyType = 'parking';
            if (contract.parking && contract.parking.unit) {
                const parkingUnits = appData.units['parking'] || [];
                const parkingUnit = parkingUnits.find(u => u.id === contract.parking.unit);
                unitLabel = parkingUnit ? parkingUnit.name : contract.parking.unit;
            }
        }

        const payments = appData.getPaymentsByContract(contract.id);
        const typeNames = getInstallmentTypeNames(contract);
        const schedules = getAllInstallments(contract);

        schedules.forEach(schedule => {
            if (schedule.percent <= 0) return;
            const scheduledAmount = parseMoney(totalValue * schedule.percent / 100);
            const paidAmount = payments.filter(p => p.type === schedule.type).reduce((s, p) => s + parseMoney(p.amount || 0), 0);
            const remaining = parseMoney(scheduledAmount - paidAmount);

            if (remaining > 0) {
                allRows.push({
                    date: schedule.date || '',
                    owner: contract.owner || '',
                    buildingLabel: buildingLabel,
                    unitLabel: unitLabel,
                    contractBuilding: contractBuilding,
                    propertyType: propertyType,
                    propertyTypeName: propertyTypeNames[propertyType] || propertyType,
                    type: schedule.type,
                    typeName: typeNames[schedule.type] || schedule.type,
                    scheduledAmount: scheduledAmount,
                    paidAmount: paidAmount,
                    remaining: remaining,
                    status: paidAmount >= scheduledAmount ? 'paid' : (schedule.date && new Date(schedule.date) < new Date() ? 'unpaid' : 'pending'),
                    contractId: contract.id
                });
            } else {
                allRows.push({
                    date: schedule.date || '',
                    owner: contract.owner || '',
                    buildingLabel: buildingLabel,
                    unitLabel: unitLabel,
                    contractBuilding: contractBuilding,
                    propertyType: propertyType,
                    propertyTypeName: propertyTypeNames[propertyType] || propertyType,
                    type: schedule.type,
                    typeName: typeNames[schedule.type] || schedule.type,
                    scheduledAmount: scheduledAmount,
                    paidAmount: paidAmount,
                    remaining: 0,
                    status: 'paid',
                    contractId: contract.id
                });
            }
        });
    });

    if (filterBuilding) {
        allRows = allRows.filter(r => r.contractBuilding === filterBuilding);
    }

    if (filterStatus) {
        allRows = allRows.filter(r => r.status === filterStatus);
    }

    allRows.sort((a, b) => {
        const statusOrder = { 'unpaid': 0, 'pending': 1, 'paid': 2 };
        const orderA = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 1;
        const orderB = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 1;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(a.date) - new Date(b.date);
    });

    allRows.forEach((row, idx) => {
        const statusClass = row.status === 'paid' ? 'status-paid' : (row.status === 'unpaid' ? 'status-unpaid' : 'status-pending');
        const statusText = row.status === 'paid' ? '✓ Платено' : (row.status === 'unpaid' ? '✗ Неплатено' : 'Чакащо');
        const dateClass = (row.status === 'pending' || row.status === 'unpaid') && new Date(row.date) < new Date() ? 'overdue' : '';

        const rowClass = row.status === 'pending' || row.status === 'unpaid' ? 'row-pending' : '';
        const cid = row.contractId.replace(/"/g, '&quot;');
        const tp = row.type.replace(/"/g, '&quot;');
        html += `
            <tr class="${rowClass}" data-contract="${cid}" data-type="${tp}" style="cursor: pointer;">
                <td data-label="Дата" class="${dateClass}">${row.date ? new Date(row.date).toLocaleDateString('bg-BG') : '-'}</td>
                <td data-label="Собственик">${row.owner}</td>
                <td data-label="Имот">${row.buildingLabel}${row.unitLabel ? (row.buildingLabel ? ' — ' : '') + row.unitLabel : ''}</td>
                <td data-label="Вид имот">${row.propertyTypeName}</td>
                <td data-label="Тип">${row.typeName}</td>
                <td data-label="Сума">${formatPrice(row.scheduledAmount)} EUR</td>
                <td data-label="Статус"><span class="${statusClass}">${statusText}</span></td>
<td data-label="Действия">
                    ${row.status !== 'paid' ? '<button class="small btn-pay" data-contract="' + cid + '" data-type="' + tp + '" data-remaining="' + row.remaining + '" title="Плати">💳 Плати</button>' : ''}
                    <button class="small secondary btn-edit" onclick="event.stopPropagation(); quickPay('${row.contractId}', '${row.type}', ${row.remaining || 0})" title="Редактирай плащане">✏️</button>
                </td>
            </tr>
        `;
    });

    const tbody = document.getElementById('paymentsTable');
    tbody.innerHTML = html || '<tr><td colspan="8" style="text-align: center; padding: 20px;">Няма плащания.</td></tr>';

    tbody.querySelectorAll('tr[data-contract]').forEach(tr => {
        tr.addEventListener('click', function(e) {
            if (e.target.closest('button')) return;
            openPaymentDetail(this.dataset.contract, this.dataset.type);
        });
    });

    tbody.querySelectorAll('.btn-pay').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            quickPay(this.dataset.contract, this.dataset.type, parseFloat(this.dataset.remaining));
        });
    });

    tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            openPaymentDetail(this.dataset.contract, this.dataset.type);
        });
    });

    console.log('renderPayments done, rows:', tbody.querySelectorAll('tr[data-contract]').length, 'edit btns:', tbody.querySelectorAll('.btn-edit').length);
}

function quickPay(contractId, type, amount) {
    document.getElementById('paymentContract').value = contractId;
    populatePaymentDetails();
    document.getElementById('paymentType').value = type;
    document.getElementById('paymentAmount').value = amount.toFixed(2);
    document.getElementById('paymentDate').valueAsDate = new Date();
    document.getElementById('paymentModal').classList.add('active');
    populatePaymentSelects();
}

function deletePayment(id) {
    appData.deletePayment(id);
    renderPayments();
}

function openPaymentDetail(contractId, paymentType) {
    const contract = appData.contracts.find(c => c.id === contractId);
    if (!contract) return;

    const totalValue = parseMoney(contract.totalValue || 0);
    const payments = appData.getPaymentsByContract(contractId);

    let buildingName = 'Н/О';
    let unitName = 'Без имот';
    let parkingName = '';

    if (contract.apartment && contract.apartment.building) {
        buildingName = buildingNames[contract.apartment.building] || contract.apartment.building;
        if (contract.apartment.unit) {
            const unit = appData.units[contract.apartment.building] ? appData.units[contract.apartment.building].find(u => u.id === contract.apartment.unit) : null;
            if (unit) unitName = unit.name;
        }
    }

    if (contract.parking && contract.parking.unit) {
        const parkingUnits = appData.units['parking'] || [];
        const parkingUnit = parkingUnits.find(u => u.id === contract.parking.unit);
        parkingName = parkingUnit ? parkingUnit.name : contract.parking.unit;
    }

    const typeNames = getInstallmentTypeNames(contract);
    const methodNames = { 'cash': 'Брой', 'bank': 'Банков превод', 'check': 'Чек' };
    const allInsts = getAllInstallments(contract);

    let instData = {};
    allInsts.forEach(sch => {
        if (sch.percent <= 0) return;
        const schAmount = totalValue * sch.percent / 100;
        const schPaid = payments.filter(p => p.type === sch.type).reduce((s, p) => s + parseMoney(p.amount || 0), 0);
        const schRemaining = schAmount - schPaid;
        instData[sch.type] = { amount: schAmount, paid: schPaid, remaining: schRemaining, percent: sch.percent, date: sch.date };
    });

    const totalPaid = Object.values(instData).reduce((s, d) => s + d.paid, 0);
    const totalRemaining = totalValue - totalPaid;

    const currentSchedule = payments.filter(p => p.type === paymentType);
    const currentScheduled = (instData[paymentType] && instData[paymentType].amount) || 0;
    const currentPaid = currentSchedule.reduce((s, p) => s + parseMoney(p.amount || 0), 0);
    const currentRemaining = currentScheduled - currentPaid;

    let paymentsHistoryHtml = '';
    if (currentSchedule.length > 0) {
        paymentsHistoryHtml = '<table><thead><tr><th>Дата</th><th>Сума</th><th>Валута</th><th>Метод</th><th>Бележки</th><th>Действия</th></tr></thead><tbody>';
        currentSchedule.forEach(p => {
            paymentsHistoryHtml += `<tr>
                <td data-label="Дата">${new Date(p.date).toLocaleDateString('bg-BG')}</td>
                <td data-label="Сума">${formatPrice(p.amount)} EUR</td>
                <td data-label="Валута">${p.currency || 'EUR'}</td>
                <td data-label="Метод">${methodNames[p.method] || p.method || ''}</td>
                <td data-label="Бележки">${p.notes || ''}</td>
                <td data-label="Действия"><button class="small" onclick="event.stopPropagation(); closePaymentDetail(); editPayment('${p.id}')">✏️</button> <button class="danger small" onclick="event.stopPropagation(); if(confirm('Сигурен ли си?')) { deletePayment('${p.id}'); openPaymentDetail('${contractId}', '${paymentType}'); }">🗑️</button></td>
            </tr>`;
        });
        paymentsHistoryHtml += '</tbody></table>';
    } else {
        paymentsHistoryHtml = '<p style="text-align:center; color:#999; padding: 15px;">Няма записани плащания за този етап.</p>';
    }

    const progressPercent = totalValue > 0 ? Math.round((totalPaid / totalValue) * 100) : 0;

    document.getElementById('paymentDetailTitle').textContent = typeNames[paymentType] + ' — ' + contract.owner;
    document.getElementById('paymentDetailContent').innerHTML = `
        <div class="detail-section">
            <h4>Информация за договора</h4>
            <div class="detail-grid">
                <div class="detail-item"><span class="detail-label">Собственик:</span><span class="detail-value">${contract.owner || ''}</span></div>
                <div class="detail-item"><span class="detail-label">Телефон:</span><span class="detail-value">${contract.phone || '-'}</span></div>
                <div class="detail-item"><span class="detail-label">Дата на договор:</span><span class="detail-value">${contract.date ? new Date(contract.date).toLocaleDateString('bg-BG') : '-'}</span></div>
            </div>
        </div>

        <div class="detail-section">
            <h4>Информация за имота</h4>
            <div class="detail-grid">
                ${buildingName !== 'Н/О' ? '<div class="detail-item"><span class="detail-label">Сграда:</span><span class="detail-value">' + buildingName + '</span></div>' : ''}
                ${unitName !== 'Без имот' ? '<div class="detail-item"><span class="detail-label">Апартамент:</span><span class="detail-value">' + unitName + '</span></div>' : ''}
                ${parkingName ? '<div class="detail-item"><span class="detail-label">Паркомясто:</span><span class="detail-value">' + parkingName + '</span></div>' : ''}
            </div>
        </div>

        <div class="detail-section">
            <h4>Финансова информация</h4>
            <div class="detail-grid">
                <div class="detail-item"><span class="detail-label">Обща стойност:</span><span class="detail-value" style="font-size: 1.1em; font-weight: 700;">${formatPrice(totalValue)} EUR</span></div>
                <div class="detail-item"><span class="detail-label">Платено общо:</span><span class="detail-value" style="color: #27ae60;">${formatPrice(totalPaid)} EUR</span></div>
                <div class="detail-item"><span class="detail-label">Остатък общо:</span><span class="detail-value" style="color: #e74c3c;">${formatPrice(totalRemaining)} EUR</span></div>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${progressPercent}%"></div>
                <span class="progress-text">${progressPercent}%</span>
            </div>
        </div>

        <div class="detail-section">
            <h4>Детайли за ${typeNames[paymentType]}</h4>
            <div class="detail-grid">
                <div class="detail-item"><span class="detail-label">Процент:</span><span class="detail-value">${(instData[paymentType] && instData[paymentType].percent) || 0}%</span></div>
                <div class="detail-item"><span class="detail-label">Дължима сума:</span><span class="detail-value">${formatPrice(currentScheduled)} EUR</span></div>
                <div class="detail-item"><span class="detail-label">Платено:</span><span class="detail-value" style="color: #27ae60;">${formatPrice(currentPaid)} EUR</span></div>
                <div class="detail-item"><span class="detail-label">Остатък:</span><span class="detail-value" style="color: #e74c3c; font-weight: 700;">${formatPrice(currentRemaining)} EUR</span></div>
            </div>
        </div>

        <div class="detail-section">
            <h4>График на целия договор</h4>
            <table>
                <thead><tr><th>Етап</th><th>Процент</th><th>Сума</th><th>Дата</th><th>Платено</th><th>Остатък</th><th>Статус</th></tr></thead>
                <tbody>
                    ${allInsts.map(sch => {
                        if (sch.percent <= 0) return '';
                        const d = instData[sch.type];
                        if (!d) return '';
                        const status = d.remaining <= 0 ? '<span class="status-paid">✓ Платено</span>' : '<span class="status-pending">Оставаща сума: ' + formatPrice(d.remaining) + ' EUR</span>';
                        const highlighted = paymentType === sch.type ? 'background: #e8f4fd; font-weight: 600;' : '';
                        return `<tr style="${highlighted}">
                            <td data-label="Етап">${typeNames[sch.type] || sch.type}</td>
                            <td data-label="Процент">${d.percent}%</td>
                            <td data-label="Сума">${formatPrice(d.amount)} EUR</td>
                            <td data-label="Дата">${d.date ? new Date(d.date).toLocaleDateString('bg-BG') : '-'}</td>
                            <td data-label="Платено">${formatPrice(d.paid)} EUR</td>
                            <td data-label="Остатък">${formatPrice(d.remaining)} EUR</td>
                            <td data-label="Статус">${status}</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <div class="detail-section">
            <h4>История на плащанията за ${typeNames[paymentType]} (${currentSchedule.length})</h4>
            ${paymentsHistoryHtml}
        </div>
    `;

    document.getElementById('paymentDetailModal').classList.add('active');
    document.body.classList.add('modal-open');
}

function closePaymentDetail() {
    document.getElementById('paymentDetailModal').classList.remove('active');
    document.body.classList.remove('modal-open');
}

function openInvoiceModal() {
    document.getElementById('invoiceModal').classList.add('active');
    populateContractSelects();
    document.getElementById('invoiceDate').valueAsDate = new Date();
    document.getElementById('invoiceNumber').value = 'ФК-' + new Date().getFullYear() + '-' + (appData.invoices.length + 1).toString().padStart(4, '0');
}

function closeInvoiceModal() {
    document.getElementById('invoiceModal').classList.remove('active');
}

function saveInvoice(event) {
    event.preventDefault();
    const invoice = {
        contractId: document.getElementById('invoiceContract').value,
        number: document.getElementById('invoiceNumber').value,
        date: document.getElementById('invoiceDate').value,
        type: document.getElementById('invoiceType').value,
        amount: parseMoney(document.getElementById('invoiceAmount').value),
        description: document.getElementById('invoiceDescription').value
    };

    appData.addInvoice(invoice);
    closeInvoiceModal();
    renderInvoices();
    alert('✅ Фактура запазена успешно!');
}

function renderInvoices(filters) {
    const typeNames = { 'proforma': 'Проформа', 'invoice': 'Фактура' };
    let html = '';

    const filterType = filters ? filters.type : (document.getElementById('invoiceFilterType') ? document.getElementById('invoiceFilterType').value : '');

    let invoicesToShow = appData.invoices.slice();

    if (filterType) {
        invoicesToShow = invoicesToShow.filter(invoice => invoice.type === filterType);
    }

    invoicesToShow.forEach(invoice => {
        const contract = appData.contracts.find(c => c.id === invoice.contractId);
        if (!contract) return;

        html += `\
            <tr>
                <td data-label="Номер">${invoice.number}</td>
                <td data-label="Дата">${new Date(invoice.date).toLocaleDateString('bg-BG')}</td>
                <td data-label="Собственик">${contract.owner}</td>
                <td data-label="Тип">${typeNames[invoice.type]}</td>
                <td data-label="Сума">${formatPrice(invoice.amount)}</td>
                <td data-label="Действия"><button class="danger small" onclick="if(confirm('Сигурен ли си?')) deleteInvoice('${invoice.id}')">🗑️</button></td>
            </tr>
        `;
    });

    document.getElementById('invoicesTable').innerHTML = html || '<tr><td colspan="6" style="text-align: center; padding: 20px;">Няма фактури.</td></tr>';
}

function deleteInvoice(id) {
    appData.deleteInvoice(id);
    renderInvoices();
}

function exportData() {
    const data = {
        contracts: appData.contracts,
        payments: appData.payments,
        invoices: appData.invoices,
        units: appData.units,
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'apartments_data_' + new Date().getTime() + '.json';
    link.click();
}

function importData() {
    const file = document.getElementById('importFile').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.contracts) appData.contracts = data.contracts;
            if (data.payments) appData.payments = data.payments;
            if (data.invoices) appData.invoices = data.invoices;
            if (data.units) {
                appData.units = data.units;
                appData.saveData('units', appData.units);
            }

            appData.saveData('contracts', appData.contracts);
            appData.saveData('payments', appData.payments);
            appData.saveData('invoices', appData.invoices);

            alert('✅ Данни импортирани успешно!');
            location.reload();
        } catch (error) {
            alert('❌ Грешка при импортиране: ' + error.message);
        }
    };
    reader.readAsText(file);
}

let extraInstallmentCounter = 0;

function addInstallmentRow(percent, date) {
    extraInstallmentCounter++;
    const idx = extraInstallmentCounter;
    const container = document.getElementById('extraInstallmentsContainer');
    const div = document.createElement('div');
    div.className = 'form-row';
    div.id = 'extraInstallmentRow_' + idx;
    div.innerHTML = `
        <div class="form-group">
            <label>${idx + 2}-ро доплащане (%):</label>
            <input type="number" class="extra-inst-percent" data-idx="${idx}" value="${percent || 35}" min="0" max="100" step="0.01" required oninput="updateInstallmentAmounts()">
        </div>
        <div class="form-group">
            <label>Сума (EUR):</label>
            <span id="extraInstAmount_${idx}" class="amount-display">0.00 EUR</span>
        </div>
        <div class="form-group">
            <label>Дата:</label>
            <input type="date" class="extra-inst-date" data-idx="${idx}" value="${date || ''}" required>
        </div>
        <div class="form-group" style="flex: 0 0 auto; align-self: flex-end;">
            <button type="button" class="danger small" onclick="removeInstallmentRow(${idx}); updateInstallmentAmounts()" title="Премахни">✕</button>
        </div>
    `;
    container.appendChild(div);
    updateInstallmentAmounts();
}

function removeInstallmentRow(idx) {
    const row = document.getElementById('extraInstallmentRow_' + idx);
    if (row) row.remove();
}

function getExtraInstallments() {
    const result = [];
    document.querySelectorAll('.extra-inst-percent').forEach(input => {
        const idx = input.dataset.idx;
        const dateInput = document.querySelector('.extra-inst-date[data-idx="' + idx + '"]');
        result.push({
            percent: parseFloat(input.value) || 0,
            date: dateInput ? dateInput.value : ''
        });
    });
    return result;
}

function loadExtraInstallments(extra) {
    document.getElementById('extraInstallmentsContainer').innerHTML = '';
    extraInstallmentCounter = 0;
    if (extra && extra.length > 0) {
        extra.forEach(item => {
            addInstallmentRow(item.percent, item.date);
        });
    }
    updateInstallmentAmounts();
}

function getInstallmentTypeNames(contract) {
    const names = { 'advance': 'Аванс', 'installment1': '1-во доплащане', 'installment2': '2-ро доплащане' };
    if (contract && contract.extraInstallments) {
        contract.extraInstallments.forEach((inst, i) => {
            const key = 'installment' + (i + 3);
            const suffix = (i + 3) + '-то';
            names[key] = suffix + ' доплащане';
        });
    }
    return names;
}

function getAllInstallments(contract) {
    const list = [
        { type: 'advance', percent: contract.advance ? contract.advance.percent : 0, date: contract.advance ? contract.advance.date : '' },
        { type: 'installment1', percent: contract.installment1 ? contract.installment1.percent : 0, date: contract.installment1 ? contract.installment1.date : '' },
        { type: 'installment2', percent: contract.installment2 ? contract.installment2.percent : 0, date: contract.installment2 ? contract.installment2.date : '' }
    ];
    if (contract.extraInstallments) {
        contract.extraInstallments.forEach((inst, i) => {
            list.push({
                type: 'installment' + (i + 3),
                percent: inst.percent,
                date: inst.date
            });
        });
    }
    return list;
}

function formatPriceInput(el) {
    if (el.value) {
        el.value = formatPrice(parseMoney(el.value));
    }
}

function updateInstallmentAmounts() {
    const apartmentVal = parseMoney(document.getElementById('apartmentValue').value) || 0;
    const parkingVal = parseMoney(document.getElementById('parkingValue').value) || 0;
    const total = apartmentVal + parkingVal;

    const pairs = [
        { inputId: 'advancePercent', displayId: 'advanceAmountDisplay' },
        { inputId: 'installment1Percent', displayId: 'installment1AmountDisplay' },
        { inputId: 'installment2Percent', displayId: 'installment2AmountDisplay' }
    ];
    for (const p of pairs) {
        const pct = parseFloat(document.getElementById(p.inputId).value) || 0;
        document.getElementById(p.displayId).textContent = (total * pct / 100).toFixed(2) + ' EUR';
    }

    document.querySelectorAll('.extra-inst-percent').forEach(input => {
        const idx = input.dataset.idx;
        const pct = parseFloat(input.value) || 0;
        const span = document.getElementById('extraInstAmount_' + idx);
        if (span) span.textContent = (total * pct / 100).toFixed(2) + ' EUR';
    });
}

window.addEventListener('load', function() {
    populateContractSelects();
    populateContractFilters();
    updateDashboard();

    const paymentFilterBuilding = document.getElementById('paymentFilterBuilding');
    if (paymentFilterBuilding) {
        Object.keys(buildingNames).forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = buildingNames[key];
            paymentFilterBuilding.appendChild(opt);
        });
    }
    
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (!input.value) input.value = today;
    });
});

function editContract(id) {
    const contract = appData.contracts.find(c => c.id === id);
    if (!contract) return;

    editingContractId = id;
    document.getElementById('contractModal').classList.add('active');
    document.querySelector('#contractModal .modal-header span').textContent = 'Редактиране на договор';
    document.getElementById('contractOwner').value = contract.owner || '';
    document.getElementById('contractPhone').value = contract.phone || '';
    document.getElementById('contractNumber').value = contract.number || '';
    document.getElementById('contractDate').value = contract.date || '';
    document.getElementById('contractNotes').value = contract.notes || '';

    if (contract.apartment) {
        document.getElementById('apartmentBuilding').value = contract.apartment.building || '';
        populateApartmentsSelect();
        document.getElementById('apartmentUnit').value = contract.apartment.unit || '';
        document.getElementById('apartmentValue').value = formatPrice(contract.apartment.value || 0);
    }

    if (contract.parking) {
        populateParkingSelect();
        document.getElementById('parkingValue').value = formatPrice(contract.parking.value || 0);
    }

    document.getElementById('advancePercent').value = contract.advance ? contract.advance.percent : 30;
    document.getElementById('advanceDate').value = contract.advance ? contract.advance.date : '';
    document.getElementById('installment1Percent').value = contract.installment1 ? contract.installment1.percent : 35;
    document.getElementById('installment1Date').value = contract.installment1 ? contract.installment1.date : '';
    document.getElementById('installment2Percent').value = contract.installment2 ? contract.installment2.percent : 35;
    document.getElementById('installment2Date').value = contract.installment2 ? contract.installment2.date : '';

    loadExtraInstallments(contract.extraInstallments || []);
    updateInstallmentAmounts();
}

function filterPayments() {
    renderPayments();
}

function filterInvoices() {
    renderInvoices();
}

function populatePaymentDetails() {
    const contractId = document.getElementById('paymentContract').value;
    const amountInput = document.getElementById('paymentAmount');
    const typeSelect = document.getElementById('paymentType');
    const propertyTypeSelect = document.getElementById('paymentPropertyType');
    const unitInfoInput = document.getElementById('paymentUnitInfo');
    if (!contractId) {
        amountInput.value = '';
        typeSelect.value = '';
        propertyTypeSelect.value = '';
        unitInfoInput.value = '';
        return;
    }

    const contract = appData.contracts.find(c => c.id === contractId);
    if (!contract) return;

    const typeNames = getInstallmentTypeNames(contract);

    let unitName = '';
    if (contract.apartment && contract.apartment.building) {
        propertyTypeSelect.value = 'apartment';
        const building = contract.apartment.building;
        const unitId = contract.apartment.unit;
        const unit = appData.units[building] ? appData.units[building].find(u => u.id === unitId) : null;
        unitName = unit ? unit.name : '';
    } else {
        propertyTypeSelect.value = 'parking';
        if (contract.parking && contract.parking.unit) {
            const parkingUnits = appData.units['parking'] || [];
            const parkingUnit = parkingUnits.find(u => u.id === contract.parking.unit);
            unitName = parkingUnit ? parkingUnit.name : contract.parking.unit;
        }
    }
    unitInfoInput.value = unitName;

    const totalValue = parseMoney(contract.totalValue || 0);
    const payments = appData.getPaymentsByContract(contractId);
    const totalPaid = payments.reduce((sum, p) => sum + parseMoney(p.amount || 0), 0);
    const remaining = totalValue - totalPaid;

    amountInput.value = remaining > 0 ? remaining.toFixed(2) : '';

    const allInsts = getAllInstallments(contract);
    typeSelect.innerHTML = '<option value="">Изберете</option>';
    allInsts.forEach(sch => {
        if (sch.percent <= 0) return;
        const opt = document.createElement('option');
        opt.value = sch.type;
        opt.textContent = typeNames[sch.type] || sch.type;
        typeSelect.appendChild(opt);
    });

    let suggestedType = '';
    let suggestedAmount = 0;
    for (const sch of allInsts) {
        if (sch.percent <= 0) continue;
        const schAmount = totalValue * sch.percent / 100;
        const schPaid = payments.filter(p => p.type === sch.type).reduce((s, p) => s + parseMoney(p.amount || 0), 0);
        if (schPaid < schAmount) {
            suggestedType = sch.type;
            suggestedAmount = schAmount - schPaid;
            break;
        }
    }
    if (suggestedType) {
        typeSelect.value = suggestedType;
        amountInput.value = suggestedAmount.toFixed(2);
    }
}

function exportToExcel() {
    const buildings = ['building_a', 'building_b', 'building_c', 'building_d', 'building_e'];
    const header = [
        'Тип запис', 'Сграда', 'Имот', 'Собственик', 'Телефон',
        'Дата', 'Обща стойност',
        'Аванс %', 'Аванс дата', '1-во доп %', '1-во доп дата', '2-ро доп %', '2-ро доп дата',
        'Вид плащане', 'Сума плащане', 'Валута', 'Метод',
        'Фактура номер', 'Тип фактура',
        'ID имот', 'Тип имот', 'Квадратура', 'Цена',
        'Статус', 'Бележки/Описание'
    ];

    const methodNames = { 'cash': 'Брой', 'bank': 'Банков превод', 'check': 'Чек' };
    const invTypeNames = { 'proforma': 'Проформа', 'invoice': 'Фактура' };

    const rows = [];
    rows.push(header);

    appData.contracts.forEach(contract => {
        const bKey = contract.apartment ? contract.apartment.building : '';
        const unitId = contract.apartment ? contract.apartment.unit : '';
        const unit = bKey && appData.units[bKey] ? appData.units[bKey].find(u => u.id === unitId) : null;
        const building = bKey ? buildingNames[bKey] || '' : '';
        const unitName = unit ? unit.name : '';
        rows.push([
            'Договор', building, unitName,
            contract.owner || '', contract.phone || '',
            contract.date || '', contract.totalValue || 0,
            contract.advance ? contract.advance.percent : '', contract.advance ? contract.advance.date : '',
            contract.installment1 ? contract.installment1.percent : '', contract.installment1 ? contract.installment1.date : '',
            contract.installment2 ? contract.installment2.percent : '', contract.installment2 ? contract.installment2.date : '',
            '', '', '', '',
            '', '',
            '', '', '', '',
            '', (contract.notes || '').replace(/;/g, ',')
        ]);

        const typeNames = getInstallmentTypeNames(contract);
        const relatedPayments = appData.payments.filter(p => p.contractId === contract.id);
        relatedPayments.forEach(payment => {
            rows.push([
                'Плащане', building, unitName,
                contract.owner || '', '',
                payment.date || '', '',
                '', '', '', '', '', '',
                typeNames[payment.type] || payment.type || '', payment.amount || 0, payment.currency || 'EUR', methodNames[payment.method] || payment.method || '',
                '', '',
                '', '', '', '',
                payment.status || 'paid', (payment.notes || '').replace(/;/g, ',')
            ]);
        });

        const relatedInvoices = appData.invoices.filter(inv => inv.contractId === contract.id);
        relatedInvoices.forEach(invoice => {
            rows.push([
                'Фактура', building, unitName,
                contract.owner || '', '',
                invoice.date || '', '',
                '', '', '', '', '', '',
                '', '', '', '',
                invoice.number || '', invTypeNames[invoice.type] || invoice.type || '',
                '', '', '', '',
                '', (invoice.description || '').replace(/;/g, ',')
            ]);
        });
    });

    buildings.forEach(building => {
        const units = appData.units[building] || [];
        units.forEach(unit => {
            rows.push([
                'Имот', buildingNames[building] || building, '',
                '', '',
                '', '',
                '', '', '', '', '', '',
                '', '', '', '',
                '', '',
                unit.id || '', unit.aptType || unit.type || '', unit.sqm || '', unit.price || '',
                unit.status || 'свободен', ''
            ]);
        });
    });

    if (appData.units['parking']) {
        appData.units['parking'].forEach(unit => {
            rows.push([
                'Паркомясто', '', '',
                '', '',
                '', '',
                '', '', '', '', '', '',
                '', '', '', '',
                '', '',
                unit.id || '', '', '', unit.price || '',
                unit.status || 'свободен', ''
            ]);
        });
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);

    ws['!cols'] = [
        { wch: 14 }, { wch: 12 }, { wch: 14 }, { wch: 18 }, { wch: 12 },
        { wch: 12 }, { wch: 14 },
        { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 12 },
        { wch: 16 }, { wch: 14 }, { wch: 10 }, { wch: 14 },
        { wch: 14 }, { wch: 14 },
        { wch: 10 }, { wch: 14 }, { wch: 10 }, { wch: 14 },
        { wch: 14 }, { wch: 30 }
    ];

    const numRows = rows.length;
    const numCols = header.length;

    const headerFill = { patternType: 'solid', fgColor: { rgb: '4472C4' } };
    const headerFont = { bold: true, color: { rgb: 'FFFFFF' }, sz: 11, name: 'Calibri' };
    const headerAlign = { horizontal: 'center', vertical: 'center', wrapText: true };

    const cellFont = { sz: 10, name: 'Calibri' };
    const cellAlign = { vertical: 'center' };
    const thinBorder = {
        top: { style: 'thin', color: { rgb: 'B4C6E7' } },
        bottom: { style: 'thin', color: { rgb: 'B4C6E7' } },
        left: { style: 'thin', color: { rgb: 'B4C6E7' } },
        right: { style: 'thin', color: { rgb: 'B4C6E7' } }
    };

    for (let C = 0; C < numCols; C++) {
        const addr = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[addr]) ws[addr] = { v: header[C], t: 's' };
        ws[addr].s = { fill: headerFill, font: headerFont, alignment: headerAlign, border: thinBorder };
    }

    for (let R = 1; R < numRows; R++) {
        for (let C = 0; C < numCols; C++) {
            const addr = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[addr]) continue;
            ws[addr].s = { font: cellFont, alignment: cellAlign, border: thinBorder };
        }
    }

    ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: numRows - 1, c: numCols - 1 } }) };

    XLSX.utils.book_append_sheet(wb, ws, 'Данни');
    XLSX.writeFile(wb, 'apartments_data_' + new Date().getTime() + '.xlsx');
}

function importFromExcel() {
    const file = document.getElementById('importExcelFile').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim());

            let currentSection = '';
            let imported = { contracts: 0, payments: 0, invoices: 0 };

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (line === 'ДОГОВОРИ') { currentSection = 'contracts'; continue; }
                if (line === 'ПЛАЩАНИЯ') { currentSection = 'payments'; continue; }
                if (line === 'ФАКТУРИ') { currentSection = 'invoices'; continue; }
                if (line === 'ИМОТИ' || line === 'ПАРКОМЕСТА') { currentSection = ''; continue; }

                if (line.startsWith('Сграда;') || line.startsWith('Дата;') || line.startsWith('Номер;') || line.startsWith('ID;')) continue;

                const parts = line.split(';');
                if (parts.length < 2) continue;

                if (currentSection === 'contracts') {
                    const buildingReverse = { 'Сграда А': 'building_a', 'Сграда Б': 'building_b', 'Сграда В': 'building_c', 'Сграда Г': 'building_d', 'Сграда Д': 'building_e' };
                    const buildingKey = buildingReverse[parts[0]] || '';
                    const contract = {
                        owner: parts[2] || '',
                        phone: parts[3] || '',
                        date: parts[4] || '',
                        totalValue: parseMoney(parts[5]),
                        apartment: buildingKey ? { building: buildingKey, unit: '', value: parseMoney(parts[5]) } : null,
                        advance: { percent: parseMoney(parts[6]) || 30, date: parts[7] || '' },
                        installment1: { percent: parseMoney(parts[8]) || 35, date: parts[9] || '' },
                        installment2: { percent: parseMoney(parts[10]) || 35, date: parts[11] || '' },
                        notes: parts[12] || ''
                    };
                    appData.addContract(contract);
                    imported.contracts++;
                } else if (currentSection === 'payments') {
                    const typeReverse = { 'Аванс': 'advance', '1-во доп.': 'installment1', '2-ро доп.': 'installment2' };
                    const methodReverse = { 'Брой': 'cash', 'Банков превод': 'bank', 'Чек': 'check' };
                    const propertyTypeReverse = { 'Апартамент': 'apartment', 'Паркомясто': 'parking' };
                    const contract = appData.contracts.find(c => c.owner === parts[1]);
                    if (contract) {
                        const payment = {
                            date: parts[0] || '',
                            contractId: contract.id,
                            amount: parseMoney(parts[5]),
                            currency: parts[6] || 'EUR',
                            type: typeReverse[parts[4]] || parts[4] || '',
                            propertyType: propertyTypeReverse[parts[3]] || parts[3] || (contract.apartment && contract.apartment.building ? 'apartment' : 'parking'),
                            method: methodReverse[parts[7]] || parts[7] || '',
                            status: parts[8] || 'paid',
                            notes: parts[9] || ''
                        };
                        appData.addPayment(payment);
                        imported.payments++;
                    }
                } else if (currentSection === 'invoices') {
                    const typeReverse = { 'Проформа': 'proforma', 'Фактура': 'invoice' };
                    const contract = appData.contracts.find(c => c.owner === parts[2]);
                    if (contract) {
                        const invoice = {
                            number: parts[0] || '',
                            date: parts[1] || '',
                            contractId: contract.id,
                            type: typeReverse[parts[3]] || parts[3] || '',
                            amount: parseMoney(parts[4]),
                            description: parts[5] || ''
                        };
                        appData.addInvoice(invoice);
                        imported.invoices++;
                    }
                }
            }

            alert('✅ Импорт завършен!\nДоговори: ' + imported.contracts + '\nПлащания: ' + imported.payments + '\nФактури: ' + imported.invoices);
            location.reload();
        } catch (error) {
            alert('❌ Грешка при импортиране: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function initializeSampleData() {
    if (!confirm('Това ще създаде примерни данни. Сигурен ли си?')) return;

    const sampleOwners = [
        'Иван Петров', 'Мария Георгиева', 'Димитър Иванов', 'Елена Димитрова',
        'Георги Стоянов', 'Анна Тодорова', 'Николай Йорданов', 'Силвия Христова',
        'Пламен Вълков', 'Биляна Красимирова', 'Тодор Добрев', 'Калина Радева',
        'Васил Михайлов', 'Радостина Борисова', 'Красимир Ангелов', 'Юлия Ташева',
        'Станислав Генчев', 'Десислава Пенева', 'Огнян Мартинов', 'Цветелина Бонева'
    ];

    const buildings = ['building_a', 'building_b', 'building_c', 'building_d', 'building_e'];

    buildings.forEach(building => {
        const units = appData.units[building] || [];
        const freeUnits = units.filter(u => u.type === 'apartment' && u.status === 'free');
        const numContracts = Math.min(3, freeUnits.length);

        for (let i = 0; i < numContracts; i++) {
            const unit = freeUnits[i];
            const owner = sampleOwners[Math.floor(Math.random() * sampleOwners.length)];
            const totalValue = unit.price;
            const advancePercent = 30;
            const installment1Percent = 35;
            const installment2Percent = 35;

            const today = new Date();
            const advanceDate = new Date(today);
            advanceDate.setDate(advanceDate.getDate() + 7);
            const installment1Date = new Date(today);
            installment1Date.setDate(installment1Date.getDate() + 37);
            const installment2Date = new Date(today);
            installment2Date.setDate(installment2Date.getDate() + 67);

            const contract = appData.addContract({
                owner: owner,
                phone: '088' + Math.floor(1000000 + Math.random() * 9000000),
                date: today.toISOString().split('T')[0],
                totalValue: totalValue,
                apartment: { building: building, unit: unit.id, value: totalValue },
                advance: { percent: advancePercent, date: advanceDate.toISOString().split('T')[0] },
                installment1: { percent: installment1Percent, date: installment1Date.toISOString().split('T')[0] },
                installment2: { percent: installment2Percent, date: installment2Date.toISOString().split('T')[0] },
                notes: 'Примерен договор'
            });

            unit.status = 'sold';

            appData.addPayment({
                date: today.toISOString().split('T')[0],
                contractId: contract.id,
                amount: totalValue * advancePercent / 100,
                currency: 'EUR',
                type: 'advance',
                method: 'bank',
                status: 'paid',
                notes: 'Авансово плащане'
            });

            appData.addInvoice({
                contractId: contract.id,
                number: 'ФК-' + today.getFullYear() + '-' + (appData.invoices.length + 1).toString().padStart(4, '0'),
                date: today.toISOString().split('T')[0],
                type: 'proforma',
                amount: totalValue,
                description: 'Проформа за ' + unit.name
            });
        }
    });

    const parking = appData.units['parking'] || [];
    for (let i = 0; i < 5; i++) {
        if (parking[i] && parking[i].status === 'free') {
            const owner = sampleOwners[Math.floor(Math.random() * sampleOwners.length)];
            const contract = appData.addContract({
                owner: owner,
                phone: '088' + Math.floor(1000000 + Math.random() * 9000000),
                date: new Date().toISOString().split('T')[0],
                totalValue: parking[i].price,
                apartment: null,
                advance: { percent: 100, date: new Date().toISOString().split('T')[0] },
                installment1: { percent: 0, date: '' },
                installment2: { percent: 0, date: '' },
                extraInstallments: [],
                notes: 'Примерен договор за паркомясто'
            });

            parking[i].status = 'sold';

            appData.addPayment({
                date: new Date().toISOString().split('T')[0],
                contractId: contract.id,
                amount: parking[i].price,
                currency: 'EUR',
                type: 'advance',
                method: 'cash',
                status: 'paid',
                notes: 'Пълно плащане'
            });
        }
    }

    appData.saveData('units', appData.units);
    alert('✅ Примерни данни създадени успешно!\n' +
          'Договори: ' + appData.contracts.length + '\n' +
          'Плащания: ' + appData.payments.length + '\n' +
          'Фактури: ' + appData.invoices.length);
    location.reload();
}