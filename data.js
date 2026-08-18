class AppData {
    constructor() {
        this.contracts = this.loadData('contracts', []);
        this.payments = this.loadData('payments', []);
        this.invoices = this.loadData('invoices', []);
        this.profiles = this.loadData('profiles', []);
        
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

    addProfile(profile) {
        profile.id = 'profile_' + Date.now();
        this.profiles.push(profile);
        this.saveData('profiles', this.profiles);
        return profile;
    }

    updateProfile(id, data) {
        const idx = this.profiles.findIndex(p => p.id === id);
        if (idx === -1) return;
        this.profiles[idx] = { ...this.profiles[idx], ...data };
        this.saveData('profiles', this.profiles);
    }

    deleteProfile(id) {
        this.profiles = this.profiles.filter(p => p.id !== id);
        this.saveData('profiles', this.profiles);
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
