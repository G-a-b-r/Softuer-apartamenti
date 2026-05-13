class AppData {
    constructor() {
        this.contracts = this.loadData('contracts', []);
        this.payments = this.loadData('payments', []);
        this.invoices = this.loadData('invoices', []);
        this.units = this.loadData('units', this.generateUnits());
    }

    loadData(key, defaultValue) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error(`Error loading ${key}:`, e);
            return defaultValue;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving ${key}:`, e);
        }
    }

    generateUnits() {
        const units = {};
        const buildings = ['building_a', 'building_b', 'building_c', 'building_d', 'building_e'];
        
        buildings.forEach(building => {
            units[building] = [];
            for (let i = 1; i <= 35; i++) {
                units[building].push({
                    id: `${building}_apt${i}`,
                    name: `Апартамент ${i}`,
                    type: 'apartment'
                });
            }
            for (let i = 1; i <= 15; i++) {
                units[building].push({
                    id: `${building}_park${i}`,
                    name: `Паркомясто ${i}`,
                    type: 'parking'
                });
            }
        });
        
        return units;
    }

    addContract(contract) {
        contract.id = 'contract_' + Date.now();
        this.contracts.push(contract);
        this.saveData('contracts', this.contracts);
        return contract;
    }

    updateContract(id, contract) {
        const index = this.contracts.findIndex(c => c.id === id);
        if (index !== -1) {
            this.contracts[index] = { ...this.contracts[index], ...contract };
            this.saveData('contracts', this.contracts);
        }
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

    addInvoice(invoice) {
        invoice.id = 'invoice_' + Date.now();
        this.invoices.push(invoice);
        this.saveData('invoices', this.invoices);
        return invoice;
    }

    getContractsByBuilding(building) {
        return this.contracts.filter(c => 
            (c.apartment?.building === building) || (c.parking?.building === building)
        );
    }

    getPaymentsByContract(contractId) {
        return this.payments.filter(p => p.contractId === contractId);
    }

    getInvoicesByContract(contractId) {
        return this.invoices.filter(i => i.contractId === contractId);
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
            
            stats[building] = {
                totalUnits: 35,
                totalParking: 15,
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
            <div class="summary-card">
                <h3>${buildingNames[building]}</h3>
                <div class="summary-item">
                    <span class="summary-label">Апартаменти и паркоместа:</span>
                    <span class="summary-value">${stat.totalUnits + stat.totalParking}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Активни договори:</span>
                    <span class="summary-value">${stat.contractCount}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Обща стойност:</span>
                    <span class="summary-value">${stat.totalValue.toFixed(2)} EUR</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Събрано:</span>
                    <span class="summary-value positive">${stat.totalPaid.toFixed(2)} EUR</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Преостатък:</span>
                    <span class="summary-value negative">${stat.remaining.toFixed(2)} EUR</span>
                </div>
            </div>
        `;
    }

    document.getElementById('dashboardSummary').innerHTML = html;

    const totalContracts = appData.contracts.length;
    const totalValue = appData.contracts.reduce((sum, c) => sum + parseFloat(c.totalValue || 0), 0);
    const totalPaid = appData.payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const remaining = totalValue - totalPaid;

    document.getElementById('totalContracts').textContent = totalContracts;
    document.getElementById('totalContractValue').textContent = totalValue.toFixed(2) + ' EUR';
    document.getElementById('totalPaid').textContent = totalPaid.toFixed(2) + ' EUR';
    document.getElementById('totalRemaining').textContent = remaining.toFixed(2) + ' EUR';
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
    
    const apartments = appData.units[building]?.filter(u => u.type === 'apartment') || [];
    apartments.forEach(unit => {
        select.innerHTML += `<option value="${unit.id}">${unit.name}</option>`;
    });
}

function populateParkingSelect() {
    const building = document.getElementById('parkingBuilding').value;
    const select = document.getElementById('parkingUnit');
    select.innerHTML = '<option value="">Изберете паркомясто</option>';
    if (!building) return;
    
    const parking = appData.units[building]?.filter(u => u.type === 'parking') || [];
    parking.forEach(unit => {
        select.innerHTML += `<option value="${unit.id}">${unit.name}</option>`;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const apartmentBuildingSelect = document.getElementById('apartmentBuilding');
    const parkingBuildingSelect = document.getElementById('parkingBuilding');
    
    if (apartmentBuildingSelect) {
        apartmentBuildingSelect.addEventListener('change', populateApartmentsSelect);
    }
    if (parkingBuildingSelect) {
        parkingBuildingSelect.addEventListener('change', populateParkingSelect);
    }
});

function saveContract(event) {
    event.preventDefault();
    
    const apartmentValue = parseFloat(document.getElementById('apartmentValue').value || 0);
    const parkingValue = parseFloat(document.getElementById('parkingValue').value || 0);
    const totalValue = apartmentValue + parkingValue;
    
    if (totalValue === 0) {
        alert('⚠️ Моля, въведи поне стойност на апартамент или паркомясто!');
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
        parking: {
            building: document.getElementById('parkingBuilding').value,
            unit: document.getElementById('parkingUnit').value,
            value: parkingValue
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
        
        if (contract.apartment?.unit) {
            const apartmentUnit = appData.units[contract.apartment.building]?.find(u => u.id === contract.apartment.unit);
            unitInfo += apartmentUnit ? apartmentUnit.name : '';
            building = buildingNames[contract.apartment.building];
        }
        if (contract.parking?.unit) {
            const parkingUnit = appData.units[contract.parking.building]?.find(u => u.id === contract.parking.unit);
            if (unitInfo) unitInfo += ' + ';
            unitInfo += parkingUnit ? parkingUnit.name : '';
            if (!building) building = buildingNames[contract.parking.building];
        }
        if (!unitInfo) unitInfo = 'Освоено';
        if (!building) building = 'Н/О';
        
        html += `
            <tr>
                <td>${building}</td>
                <td>${unitInfo}</td>
                <td>${contract.owner}</td>
                <td>${contract.totalValue.toFixed(2)} EUR</td>
                <td>${contract.advance.percent}% (${new Date(contract.advance.date).toLocaleDateString('bg-BG')})</td>
                <td>${contract.installment1.percent}% + ${contract.installment2.percent}%</td>
                <td>
                    <button class="secondary" onclick="editContract('${contract.id}')">✏️ Редакция</button>
                    <button class="danger" onclick="if(confirm('Сигурен ли си?')) deleteContractItem('${contract.id}')">🗑️ Изтрий</button>
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
        const building = contract.apartment?.building || contract.parking?.building;
        const unitId = contract.apartment?.unit || contract.parking?.unit;
        const unit = appData.units[building]?.find(u => u.id === unitId);
        select.innerHTML += `<option value="${contract.id}">${contract.owner} - ${unit?.name || ''}</option>`;
    });
}

function populateContractSelects() {
    populatePaymentSelects();
    
    const invoiceSelect = document.getElementById('invoiceContract');
    invoiceSelect.innerHTML = '<option value="">Изберете договор</option>';
    
    appData.contracts.forEach(contract => {
        const building = contract.apartment?.building || contract.parking?.building;
        const unitId = contract.apartment?.unit || contract.parking?.unit;
        const unit = appData.units[building]?.find(u => u.id === unitId);
        invoiceSelect.innerHTML += `<option value="${contract.id}">${contract.owner} - ${unit?.name || ''}</option>`;
    });
}

function populatePaymentDetails() {}

function savePayment(event) {
    event.preventDefault();
    const payment = {
        date: document.getElementById('paymentDate').value,
        contractId: document.getElementById('paymentContract').value,
        amount: parseFloat(document.getElementById('paymentAmount').value),
        currency: document.getElementById('paymentCurrency').value,
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

        const building = contract.apartment?.building || contract.parking?.building;
        const unitId = contract.apartment?.unit || contract.parking?.unit;
        const unit = appData.units[building]?.find(u => u.id === unitId);
        const currency = payment.currency || 'BGN';
        
        html += `
            <tr>
                <td>${new Date(payment.date).toLocaleDateString('bg-BG')}</td>
                <td>${contract.owner}</td>
                <td>${unit?.name || ''}</td>
                <td>${typeNames[payment.type] || payment.type}</td>
                <td>${payment.amount.toFixed(2)} ${currency}</td>
                <td><span class="status-paid">✓ Платено</span></td>
                <td><button class="danger" onclick="if(confirm('Сигурен ли си?')) deletePayment('${payment.id}')">🗑️ Изтрий</button></td>
            </tr>
        `;
    });

    document.getElementById('paymentsTable').innerHTML = html || '<tr><td colspan="7" style="text-align: center; padding: 20px;">Няма плащания.</td></tr>';
    populatePaymentFilters();
}

function deletePayment(id) {
    appData.payments = appData.payments.filter(p => p.id !== id);
    appData.saveData('payments', appData.payments);
    renderPayments();
}

function populatePaymentFilters() {
    const buildingSelect = document.getElementById('paymentFilterBuilding');
    const buildings = [...new Set(appData.contracts.map(c => c.apartment?.building || c.parking?.building).filter(Boolean))];
    const currentValue = buildingSelect.value;
    
    buildingSelect.innerHTML = '<option value="">Всички сгради</option>';
    buildings.forEach(building => {
        buildingSelect.innerHTML += `<option value="${building}">${buildingNames[building]}</option>`;
    });
    buildingSelect.value = currentValue;
}

function filterPayments() {
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
                <td>${invoice.number}</td>
                <td>${new Date(invoice.date).toLocaleDateString('bg-BG')}</td>
                <td>${contract.owner}</td>
                <td>${typeNames[invoice.type]}</td>
                <td>${invoice.amount.toFixed(2)} EUR</td>
                <td><button class="danger" onclick="if(confirm('Сигурен ли си?')) deleteInvoice('${invoice.id}')">🗑️ Изтрий</button></td>
            </tr>
        `;
    });

    document.getElementById('invoicesTable').innerHTML = html || '<tr><td colspan="6" style="text-align: center; padding: 20px;">Няма фактури.</td></tr>';
}

function deleteInvoice(id) {
    appData.invoices = appData.invoices.filter(i => i.id !== id);
    appData.saveData('invoices', appData.invoices);
    renderInvoices();
}

function filterInvoices() {
    renderInvoices();
}

function initializeSampleData() {
    if (appData.contracts.length > 0) {
        if (!confirm('Вече има данни! Изтрий ги и създай примерни?')) return;
        appData.contracts = [];
        appData.payments = [];
        appData.invoices = [];
    }

    const buildings = ['building_a', 'building_b', 'building_c', 'building_d', 'building_e'];
    const firstNames = ['Иван', 'Петър', 'Мария', 'Елена', 'Георги', 'Анна', 'Борис'];
    const lastNames = ['Петров', 'Иванов', 'Атанасов', 'Георгиев', 'Василев', 'Сотиров', 'Тодоров'];

    let contractCount = 0;
    buildings.forEach(building => {
        for (let i = 0; i < 8; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const hasApartment = Math.random() > 0.3;
            const hasParking = Math.random() > 0.5;
            
            const apartmentUnit = hasApartment ? appData.units[building][Math.floor(Math.random() * 35)] : null;
            const parkingUnit = hasParking ? appData.units[building][35 + Math.floor(Math.random() * 15)] : null;
            
            if (!apartmentUnit && !parkingUnit) continue;
            
            const apartmentValue = apartmentUnit ? 50000 + Math.random() * 50000 : 0;
            const parkingValue = parkingUnit ? 5000 + Math.random() * 5000 : 0;
            const totalValue = apartmentValue + parkingValue;

            const contract = {
                id: 'contract_' + contractCount++,
                owner: firstName + ' ' + lastName,
                phone: '088' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0'),
                date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                apartment: {
                    building: hasApartment ? building : '',
                    unit: hasApartment ? apartmentUnit.id : '',
                    value: parseFloat(apartmentValue.toFixed(2))
                },
                parking: {
                    building: hasParking ? building : '',
                    unit: hasParking ? parkingUnit.id : '',
                    value: parseFloat(parkingValue.toFixed(2))
                },
                totalValue: parseFloat(totalValue.toFixed(2)),
                advance: {
                    percent: 30,
                    date: new Date(2024, 0, 15).toISOString().split('T')[0]
                },
                installment1: {
                    percent: 35,
                    date: new Date(2024, 3, 15).toISOString().split('T')[0]
                },
                installment2: {
                    percent: 35,
                    date: new Date(2024, 6, 15).toISOString().split('T')[0]
                },
                notes: 'Примерни данни'
            };

            appData.contracts.push(contract);

            if (Math.random() > 0.3) {
                appData.payments.push({
                    id: 'payment_' + Date.now() + Math.random(),
                    contractId: contract.id,
                    date: contract.advance.date,
                    amount: contract.totalValue * contract.advance.percent / 100,
                    currency: 'EUR',
                    type: 'advance',
                    method: Math.random() > 0.5 ? 'bank' : 'cash',
                    notes: 'Платено',
                    status: 'paid'
                });
            }
        }
    });

    appData.saveData('contracts', appData.contracts);
    appData.saveData('payments', appData.payments);
    alert('✅ Примерни данни създадени успешно!');
    updateDashboard();
    renderContracts();
}

function exportToExcel() {
    let contractsCSV = 'Договор,Собственик,Телефон,Дата,Сграда апартамент,Апартамент,Стойност апартамент,Сграда паркомясто,Паркомясто,Стойност паркомясто,Обща стойност,Аванс %,Дата на аванс,Доплащане 1 %,Дата на доплащане 1,Доплащане 2 %,Дата на доплащане 2,Бележки\n';
    appData.contracts.forEach(contract => {
        const apartmentUnit = contract.apartment?.unit ? appData.units[contract.apartment.building]?.find(u => u.id === contract.apartment.unit) : null;
        const parkingUnit = contract.parking?.unit ? appData.units[contract.parking.building]?.find(u => u.id === contract.parking.unit) : null;
        
        contractsCSV += `"${contract.id}","${contract.owner}","${contract.phone}","${contract.date}","${contract.apartment?.building ? buildingNames[contract.apartment.building] : ''}","${apartmentUnit?.name || ''}","${contract.apartment?.value || ''}","${contract.parking?.building ? buildingNames[contract.parking.building] : ''}","${parkingUnit?.name || ''}","${contract.parking?.value || ''}","${contract.totalValue}","${contract.advance.percent}","${contract.advance.date}","${contract.installment1.percent}","${contract.installment1.date}","${contract.installment2.percent}","${contract.installment2.date}","${contract.notes}"\n`;
    });

    let paymentsCSV = 'Договор,Собственик,Дата на плащане,Сума,Валута,Тип,Метод,Бележки\n';
    appData.payments.forEach(payment => {
        const contract = appData.contracts.find(c => c.id === payment.contractId);
        if (contract) {
            const currency = payment.currency || 'BGN';
            paymentsCSV += `"${contract.id}","${contract.owner}","${payment.date}","${payment.amount}","${currency}","${payment.type}","${payment.method}","${payment.notes}"\n`;
        }
    });

    let invoicesCSV = 'Номер,Дата,Собственик,Тип,Сума (EUR),Описание\n';
    appData.invoices.forEach(invoice => {
        const contract = appData.contracts.find(c => c.id === invoice.contractId);
        if (contract) {
            invoicesCSV += `"${invoice.number}","${invoice.date}","${contract.owner}","${invoice.type}","${invoice.amount}","${invoice.description}"\n`;
        }
    });

    const timestamp = new Date().getTime();
    
    downloadCSV(contractsCSV, `contracts_${timestamp}.csv`);
    setTimeout(() => downloadCSV(paymentsCSV, `payments_${timestamp}.csv`), 500);
    setTimeout(() => downloadCSV(invoicesCSV, `invoices_${timestamp}.csv`), 1000);
    
    alert('✅ Excel файлове експортирани! Ще видиш 3 CSV файла:\n- contracts_*.csv\n- payments_*.csv\n- invoices_*.csv');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importFromExcel() {
    const file = document.getElementById('importExcelFile').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const headers = lines[0];
            
            if (headers.includes('Дата на аванс')) {
                importContractsCSV(lines);
            } else if (headers.includes('Валута')) {
                importPaymentsCSV(lines);
            } else if (headers.includes('Сума (EUR)')) {
                importInvoicesCSV(lines);
            }
            
            alert('✅ Excel файл импортиран успешно!');
            appData.saveData('contracts', appData.contracts);
            appData.saveData('payments', appData.payments);
            appData.saveData('invoices', appData.invoices);
            location.reload();
        } catch (error) {
            alert('❌ Грешка при импортиране: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function importContractsCSV(lines) {
    appData.contracts = [];
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        if (values.length < 19) continue;
        
        const contract = {
            id: values[0],
            owner: values[1],
            phone: values[2],
            date: values[3],
            apartment: {
                building: Object.keys(buildingNames).find(k => buildingNames[k] === values[4]) || '',
                unit: findUnitByName(values[5], values[4]) || '',
                value: parseFloat(values[6] || 0)
            },
            parking: {
                building: Object.keys(buildingNames).find(k => buildingNames[k] === values[7]) || '',
                unit: findUnitByName(values[8], values[7]) || '',
                value: parseFloat(values[9] || 0)
            },
            totalValue: parseFloat(values[10]),
            advance: {
                percent: parseFloat(values[11]),
                date: values[12]
            },
            installment1: {
                percent: parseFloat(values[13]),
                date: values[14]
            },
            installment2: {
                percent: parseFloat(values[15]),
                date: values[16]
            },
            notes: values[17] || ''
        };
        appData.contracts.push(contract);
    }
}

function importPaymentsCSV(lines) {
    appData.payments = [];
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        if (values.length < 8) continue;
        
        const payment = {
            id: 'payment_' + i + '_' + Date.now(),
            contractId: values[0],
            date: values[2],
            amount: parseFloat(values[3]),
            currency: values[4],
            type: values[5],
            method: values[6],
            notes: values[7],
            status: 'paid'
        };
        appData.payments.push(payment);
    }
}

function importInvoicesCSV(lines) {
    appData.invoices = [];
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        if (values.length < 6) continue;
        
        const invoice = {
            id: 'invoice_' + i + '_' + Date.now(),
            contractId: findContractByOwner(values[2]),
            number: values[0],
            date: values[1],
            type: values[3],
            amount: parseFloat(values[4]),
            description: values[5]
        };
        appData.invoices.push(invoice);
    }
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

function findUnitByName(unitName, buildingName) {
    const building = Object.keys(buildingNames).find(k => buildingNames[k] === buildingName);
    if (!building) return '';
    
    const unit = appData.units[building]?.find(u => u.name === unitName);
    return unit ? unit.id : '';
}

function findContractByOwner(ownerName) {
    const contract = appData.contracts.find(c => c.owner === ownerName);
    return contract ? contract.id : '';
}

function exportData() {
    const data = {
        contracts: appData.contracts,
        payments: appData.payments,
        invoices: appData.invoices,
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