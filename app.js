class AppData {
    constructor() {
        this.contracts = this.loadData('contracts', []);
        this.payments = this.loadData('payments', []);
        this.invoices = this.loadData('invoices', []);
        
        this.units = this.generateUnits();
        this.saveData('units', this.units);
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
        
        for (let building of buildings) {
            units[building] = [];
            const apt_count = building === 'building_a' ? 32 : 35;
            for (let i = 0; i < apt_count; i++) {
                let size, price, apt_id;
                if (building === 'building_a' && i < building_a_sizes.length) {
                    size = building_a_sizes[i];
                    price = building_a_prices[i];
                    apt_id = building_a_ids[i];
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
                    'status': 'free'
                });
            }
        }
        
        return units;
    }

    addContract(contract) {
        contract.id = 'contract_' + Date.now();
        this.contracts.push(contract);
        this.saveData('contracts', this.contracts);
        return contract;
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
            const totalValue = buildingContracts.reduce((sum, c) => sum + parseFloat(c.totalValue || 0), 0);
            const totalPaid = buildingContracts.reduce((sum, c) => {
                const payments = this.getPaymentsByContract(c.id);
                return sum + payments.reduce((s, p) => s + parseFloat(p.amount || 0), 0);
            }, 0);
            
            const totalUnits = this.units[building] ? this.units[building].filter(u => u.type === 'apartment').length : 0;
            
            stats[building] = {
                totalUnits: totalUnits,
                contractCount: buildingContracts.length,
                totalValue: totalValue,
                totalPaid: totalPaid,
                remaining: totalValue - totalPaid
            };
        });
        
        return stats;
    }
}

let appData = new AppData();
const buildingNames = { 'building_a': 'Сграда А', 'building_b': 'Сграда Б', 'building_c': 'Сграда В', 'building_d': 'Сграда Г', 'building_e': 'Сграда Д' };

function formatPrice(price) {
    let str = price.toFixed(2);
    let parts = str.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join(',');
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
    } else if (tabName === 'invoices') {
        renderInvoices();
    }
}

function updateDashboard() {
    const stats = appData.getStats();
    let html = '';

    for (let [building, stat] of Object.entries(stats)) {
        html += `
            <div class="summary-card clickable" onclick="openBuildingDetail('${building}')">
                <h3>${buildingNames[building]}</h3>
                <div class="summary-item">
                    <span class="summary-label">Апартаменти:</span>
                    <span class="summary-value">${stat.totalUnits}</span>
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
                    <span class="summary-label">Преостатък:</span>
                    <span class="summary-value negative">${formatPrice(stat.remaining)}</span>
                </div>
                <div class="view-more">Виж всички имоти →</div>
            </div>
        `;
    }

    document.getElementById('dashboardSummary').innerHTML = html;

    const totalContracts = appData.contracts.length;
    const totalValue = appData.contracts.reduce((sum, c) => sum + parseFloat(c.totalValue || 0), 0);
    const totalPaid = appData.payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const remaining = totalValue - totalPaid;

    document.getElementById('totalContracts').textContent = totalContracts;
    document.getElementById('totalContractValue').textContent = formatPrice(totalValue);
    document.getElementById('totalPaid').textContent = formatPrice(totalPaid);
    document.getElementById('totalRemaining').textContent = formatPrice(remaining);
}

function openBuildingDetail(building) {
    document.getElementById('apartmentsModalTitle').textContent = buildingNames[building];
    const units = appData.units[building] || [];
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Апартамент</th>
                    <th>Квадратура (м²)</th>
                    <th>Цена</th>
                    <th>Статус</th>
                </tr>
            </thead>
            <tbody>
    `;

    units.forEach((unit, index) => {
        const status = unit.status || 'free';
        const statusClass = status === 'sold' ? 'status-sold' : status === 'reserved' ? 'status-reserved' : 'status-available';
        const statusOptions = `
            <select class="status-select ${statusClass}" onchange="updateUnitStatus('${building}', ${index}, this.value)">
                <option value="free" ${status === 'free' ? 'selected' : ''}>Свободен</option>
                <option value="reserved" ${status === 'reserved' ? 'selected' : ''}>Резервиран</option>
                <option value="sold" ${status === 'sold' ? 'selected' : ''}>Продаден</option>
            </select>
        `;
        
        html += `
            <tr>
                <td data-label="ID">${unit.id}</td>
                <td data-label="Апартамент">${unit.name}</td>
                <td data-label="Квадратура">${unit.sqm ? unit.sqm.toFixed(2) : '-'}</td>
                <td data-label="Цена">${unit.price ? formatPrice(unit.price) : '-'}</td>
                <td data-label="Статус">${statusOptions}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    document.getElementById('apartmentsList').innerHTML = html;
    document.getElementById('apartmentsModal').classList.add('active');
}

function updateUnitStatus(building, index, status) {
    if (!appData.units[building][index]) return;
    appData.units[building][index].status = status;
    appData.saveData('units', appData.units);
    
    const select = document.querySelectorAll('#apartmentsList tr')[index].querySelector('.status-select');
    if (select) {
        select.className = 'status-select ' + (status === 'sold' ? 'status-sold' : status === 'reserved' ? 'status-reserved' : 'status-available');
    }
}

function closeApartmentsModal() {
    document.getElementById('apartmentsModal').classList.remove('active');
}

function openContractModal() {
    document.getElementById('contractModal').classList.add('active');
    document.getElementById('contractDate').valueAsDate = new Date();
    document.getElementById('advanceDate').valueAsDate = new Date();
    document.getElementById('installment1Date').valueAsDate = new Date(Date.now() + 30*24*60*60*1000);
    document.getElementById('installment2Date').valueAsDate = new Date(Date.now() + 60*24*60*60*1000);
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
});

function saveContract(event) {
    event.preventDefault();
    
    const apartmentValue = parseFloat(document.getElementById('apartmentValue').value || 0);
    const totalValue = apartmentValue;
    
    if (totalValue === 0) {
        alert('⚠️ Моля, въведи стойност на апартамент!');
        return;
    }
    
    const contract = {
        owner: document.getElementById('contractOwner').value,
        phone: document.getElementById('contractPhone').value,
        date: document.getElementById('contractDate').value,
        apartment: {
            building: document.getElementById('apartmentBuilding').value,
            unit: document.getElementById('apartmentUnit').value,
            value: apartmentValue
        },
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
        notes: document.getElementById('contractNotes').value
    };

    appData.addContract(contract);
    closeContractModal();
    renderContracts();
    populateContractSelects();
    alert('✅ Договор запазен успешно!');
}

function renderContracts() {
    let html = '';

    appData.contracts.forEach(contract => {
        let unitInfo = '';
        let building = '';
        
        if (contract.apartment && contract.apartment.unit) {
            const apartmentUnit = appData.units[contract.apartment.building] ? appData.units[contract.apartment.building].find(u => u.id === contract.apartment.unit) : null;
            unitInfo += apartmentUnit ? apartmentUnit.name : '';
            building = buildingNames[contract.apartment.building];
        }
        if (!unitInfo) unitInfo = 'Освоено';
        if (!building) building = 'Н/О';
        
        html += `
            <tr>
                <td data-label="Сграда">${building}</td>
                <td data-label="Имот">${unitInfo}</td>
                <td data-label="Собственик">${contract.owner}</td>
                <td data-label="Стойност">${formatPrice(parseFloat(contract.totalValue || 0))}</td>
                <td data-label="Аванс">${contract.advance ? contract.advance.percent : 0}% (${new Date(contract.advance ? contract.advance.date : new Date()).toLocaleDateString('bg-BG')})</td>
                <td data-label="Доплащания">${contract.installment1 ? contract.installment1.percent : 0}% + ${contract.installment2 ? contract.installment2.percent : 0}%</td>
                <td data-label="Действия">
                    <button class="secondary small" onclick="editContract('${contract.id}')">✏️</button>
                    <button class="danger small" onclick="if(confirm('Сигурен ли си?')) deleteContractItem('${contract.id}')">🗑️</button>
                </td>
            </tr>
        `;
    });

    document.getElementById('contractsTable').innerHTML = html || '<tr><td colspan="7" style="text-align: center; padding: 20px;">Няма договори. Създай нов договор!</td></tr>';
}

function deleteContractItem(id) {
    appData.deleteContract(id);
    renderContracts();
    populateContractSelects();
}

function openPaymentModal() {
    document.getElementById('paymentModal').classList.add('active');
    populatePaymentSelects();
    document.getElementById('paymentDate').valueAsDate = new Date();
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

function populatePaymentSelects() {
    const select = document.getElementById('paymentContract');
    select.innerHTML = '<option value="">Изберете договор</option>';
    
    appData.contracts.forEach(contract => {
        const building = contract.apartment ? contract.apartment.building : '';
        const unitId = contract.apartment ? contract.apartment.unit : '';
        const unit = appData.units[building] ? appData.units[building].find(u => u.id === unitId) : null;
        select.innerHTML += '<option value="' + contract.id + '">' + contract.owner + ' - ' + (unit ? unit.name : '') + '</option>';
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
    const payment = {
        date: document.getElementById('paymentDate').value,
        contractId: document.getElementById('paymentContract').value,
        amount: parseFloat(document.getElementById('paymentAmount').value),
        type: document.getElementById('paymentType').value,
        method: document.getElementById('paymentMethod').value,
        notes: document.getElementById('paymentNotes').value,
        status: 'paid'
    };

    appData.addPayment(payment);
    closePaymentModal();
    renderPayments();
    alert('✅ Плащане запазено успешно!');
}

function renderPayments() {
    const typeNames = { 'advance': 'Аванс', 'installment1': '1-во доп.', 'installment2': '2-ро доп.' };
    let html = '';

    appData.payments.slice().reverse().forEach(payment => {
        const contract = appData.contracts.find(c => c.id === payment.contractId);
        if (!contract) return;

        const building = contract.apartment ? contract.apartment.building : '';
        const unitId = contract.apartment ? contract.apartment.unit : '';
        const unit = appData.units[building] ? appData.units[building].find(u => u.id === unitId) : null;
        
        html += `
            <tr>
                <td data-label="Дата">${new Date(payment.date).toLocaleDateString('bg-BG')}</td>
                <td data-label="Собственик">${contract.owner}</td>
                <td data-label="Имот">${unit ? unit.name : ''}</td>
                <td data-label="Тип">${typeNames[payment.type] || payment.type}</td>
                <td data-label="Сума">${formatPrice(payment.amount)}</td>
                <td data-label="Статус"><span class="status-paid">✓ Платено</span></td>
                <td data-label="Действия"><button class="danger small" onclick="if(confirm('Сигурен ли си?')) deletePayment('${payment.id}')">🗑️</button></td>
            </tr>
        `;
    });

    document.getElementById('paymentsTable').innerHTML = html || '<tr><td colspan="7" style="text-align: center; padding: 20px;">Няма плащания.</td></tr>';
}

function deletePayment(id) {
    appData.deletePayment(id);
    renderPayments();
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
        amount: parseFloat(document.getElementById('invoiceAmount').value),
        description: document.getElementById('invoiceDescription').value
    };

    appData.addInvoice(invoice);
    closeInvoiceModal();
    renderInvoices();
    alert('✅ Фактура запазена успешно!');
}

function renderInvoices() {
    const typeNames = { 'proforma': 'Проформа', 'invoice': 'Фактура' };
    let html = '';

    appData.invoices.forEach(invoice => {
        const contract = appData.contracts.find(c => c.id === invoice.contractId);
        if (!contract) return;

        html += `
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

window.addEventListener('load', function() {
    populateContractSelects();
    updateDashboard();
    
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (!input.value) input.value = today;
    });
});

function editContract(id) {
    alert('Редакцията ще бъде добавена в бъдеща версия');
}