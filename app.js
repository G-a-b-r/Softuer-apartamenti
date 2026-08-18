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
    if (tabName === 'settings' && !isAdmin()) {
        tabName = 'dashboard';
    }

    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    const target = event && event.target ? event.target : document.querySelector('.tab-btn[data-tab="' + tabName + '"]');
    if (target) target.classList.add('active');

    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'contracts') {
        renderContracts();
    } else if (tabName === 'payments') {
        renderPayments();
        if (document.getElementById('invoicesTable')) renderInvoices();
    } else if (tabName === 'settings') {
        renderProfileManagement();
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

    document.getElementById('apartmentsModalActions').innerHTML = isAdmin() ? `
        <select id="deleteUnitSelect" class="status-select">
            ${deleteOptions}
        </select>
        <button class="danger small" onclick="deleteSelectedUnit('${building}')">🗑️ Изтрий</button>
        <button class="small" onclick="openAddUnitModal('${building}', 'apartment')">➕ Нов апартамент</button>
    ` : '';
    
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
        const statusLabel = status === 'sold' ? 'Продаден' : status === 'reserved' ? 'Резервиран' : 'Свободен';
        const statusOptions = isAdmin() ? `
            <select class="status-select ${statusClass}" onchange="updateUnitStatus('${building}', ${originalIndex}, this.value, this)">
                <option value="free" ${status === 'free' ? 'selected' : ''}>Свободен</option>
                <option value="reserved" ${status === 'reserved' ? 'selected' : ''}>Резервиран</option>
                <option value="sold" ${status === 'sold' ? 'selected' : ''}>Продаден</option>
            </select>
        ` : '<span class="' + statusClass + '">' + statusLabel + '</span>';
        
        html += `
            <tr>
                <td data-label="" style="text-align:center"><input type="checkbox" onclick="toggleRowHighlight(this.closest('tr'))"></td>
                <td data-label="Идентификатор">${unit.id}</td>
                <td data-label="Апартамент">${unit.name}</td>
                <td data-label="Вид">${unit.aptType || '-'}</td>
                <td data-label="Квадратура">${unit.sqm ? unit.sqm.toFixed(2) : '-'}</td>
                <td data-label="Цена">${unit.price ? formatPrice(unit.price) : '-'}${isAdmin() ? '&nbsp;&nbsp;<button class="small secondary" onclick="editPrice(\'' + building + '\', ' + originalIndex + ')" title="Редактирай цена">✏️</button>' : ''}</td>
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

    document.getElementById('apartmentsModalActions').innerHTML = isAdmin() ? `
        <select id="deleteUnitSelect" class="status-select">
            ${deleteOptions}
        </select>
        <button class="danger small" onclick="deleteSelectedUnit('parking')">🗑️ Изтрий</button>
        <button class="small" onclick="openAddUnitModal('parking', 'parking')">➕ Ново паркомясто</button>
    ` : '';
    
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
        const statusLabel = status === 'sold' ? 'Продаден' : status === 'reserved' ? 'Резервиран' : 'Свободен';
        const statusOptions = isAdmin() ? `
            <select class="status-select ${statusClass}" onchange="updateUnitStatus('parking', ${index}, this.value, this)">
                <option value="free" ${status === 'free' ? 'selected' : ''}>Свободен</option>
                <option value="reserved" ${status === 'reserved' ? 'selected' : ''}>Резервиран</option>
                <option value="sold" ${status === 'sold' ? 'selected' : ''}>Продаден</option>
            </select>
        ` : '<span class="' + statusClass + '">' + statusLabel + '</span>';
        
        html += `
            <tr>
                <td data-label="" style="text-align:center"><input type="checkbox" onclick="toggleRowHighlight(this.closest('tr'))"></td>
                <td data-label="Идентификатор">${unit.id}</td>
                <td data-label="Име">${unit.name}</td>
                <td data-label="Цена">${unit.price ? formatPrice(unit.price) : '-'}${isAdmin() ? '&nbsp;&nbsp;<button class="small secondary" onclick="editPrice(\'parking\', ' + index + ')" title="Редактирай цена">✏️</button>' : ''}</td>
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
    if (!requireAdmin()) return;
    if (!appData.units[building] || !appData.units[building][index]) return;
    appData.units[building][index].status = status;
    appData.saveData('units', appData.units);
    
    if (selectEl) {
        selectEl.className = 'status-select ' + (status === 'sold' ? 'status-sold' : status === 'reserved' ? 'status-reserved' : 'status-available');
    }
}

function editPrice(building, index) {
    if (!requireAdmin()) return;
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
    if (!requireAdmin()) return;
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
    if (!requireAdmin()) return;
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
    if (!requireAdmin()) return;
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
    if (!requireAdmin()) return;
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
    if (!requireAdmin()) return;
    
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
    
    if (hasApartment) {
        const selectedUnit = (appData.units[building] || []).find(u => u.id === unit);
        if (selectedUnit && selectedUnit.status === 'sold') {
            alert('Грешка: Апартаментът "' + selectedUnit.name + '" е продаден и не може да бъде добавен нов договор!');
            return;
        }
        const existingContract = appData.contracts.find(c => c.id !== editingContractId && c.apartment && c.apartment.building === building && c.apartment.unit === unit);
        if (existingContract) {
            alert('Грешка: Вече има договор за този апартамент (' + unit + ') на име ' + existingContract.owner + '!');
            return;
        }
    }
    
    if (hasParking) {
        const selectedUnit = (appData.units['parking'] || []).find(u => u.id === parkingUnit);
        if (selectedUnit && selectedUnit.status === 'sold') {
            alert('Грешка: Паркомястото "' + selectedUnit.name + '" е продадено и не може да бъде добавен нов договор!');
            return;
        }
        const existingContract = appData.contracts.find(c => c.id !== editingContractId && c.parking && c.parking.unit === parkingUnit);
        if (existingContract) {
            alert('Грешка: Вече има договор за това паркомясто (' + parkingUnit + ') на име ' + existingContract.owner + '!');
            return;
        }
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
        if (hasApartment) {
            const unitObj = (appData.units[building] || []).find(u => u.id === unit);
            if (unitObj) {
                unitObj.status = 'sold';
            }
        }
        if (hasParking) {
            const unitObj = (appData.units['parking'] || []).find(u => u.id === parkingUnit);
            if (unitObj) {
                unitObj.status = 'sold';
            }
        }
        appData.saveData('units', appData.units);
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
                ${isAdmin() ? '<td data-label="Действия"><button class="secondary small" onclick="event.stopPropagation(); editContract(\'' + contract.id + '\')">✏️</button> <button class="danger small" onclick="event.stopPropagation(); if(confirm(\'Сигурен ли си?\')) deleteContractItem(\'' + contract.id + '\')">🗑️</button></td>' : ''}
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
    if (!requireAdmin()) return;
    appData.deleteContract(id);
    renderContracts();
    populateContractSelects();
    populateContractFilters();
}

let editingPaymentId = null;
let editingInvoiceId = null;

function openPaymentModal() {
    if (!requireAdmin()) return;
    editingPaymentId = null;
    document.querySelector('#paymentModal .modal-header span').textContent = 'Ново плащане';
    document.getElementById('paymentModal').classList.add('active');
    document.getElementById('paymentPropertyType').value = '';
    document.getElementById('paymentUnitInfo').value = '';
    populatePaymentSelects();
    document.getElementById('paymentDate').valueAsDate = new Date();
}

function editPayment(id) {
    if (!requireAdmin()) return;
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
    document.getElementById('paymentInvoiceNumber').value = payment.invoiceNumber || '';
    document.getElementById('paymentInvoiceDate').value = payment.invoiceDate || '';
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
    if (!requireAdmin()) return;
    const paymentData = {
        date: document.getElementById('paymentDate').value,
        contractId: document.getElementById('paymentContract').value,
        amount: parseMoney(document.getElementById('paymentAmount').value),
        currency: document.getElementById('paymentCurrency').value,
        type: document.getElementById('paymentType').value,
        propertyType: document.getElementById('paymentPropertyType').value,
        method: document.getElementById('paymentMethod').value,
        invoiceNumber: document.getElementById('paymentInvoiceNumber').value,
        invoiceDate: document.getElementById('paymentInvoiceDate').value,
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
    const propertyTypeNames = { 'apartment': 'Апартамент', 'parking': 'Паркомясто', 'both': 'Апартамент и паркомясто' };
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
        }
        if (contract.parking && contract.parking.unit) {
            const parkingUnits = appData.units['parking'] || [];
            const parkingUnit = parkingUnits.find(u => u.id === contract.parking.unit);
            const parkingInfo = parkingUnit ? parkingUnit.name : contract.parking.unit;
            if (propertyType === 'apartment') {
                propertyType = 'both';
                unitLabel = unitLabel ? unitLabel + ' + ' + parkingInfo : parkingInfo;
            } else {
                unitLabel = parkingInfo;
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
                ${isAdmin() ? '<td data-label="Действия">' + (row.status !== 'paid' ? '<button class="small btn-pay" data-contract="' + cid + '" data-type="' + tp + '" data-remaining="' + row.remaining + '" title="Плати">💳 Плати</button>' : '') + '<button class="small secondary btn-edit" onclick="event.stopPropagation(); quickPay(\'' + row.contractId + '\', \'' + row.type + '\', ' + (row.remaining || 0) + ')" title="Редактирай плащане">✏️</button></td>' : ''}
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
    if (!requireAdmin()) return;
    document.getElementById('paymentContract').value = contractId;
    populatePaymentDetails();
    document.getElementById('paymentType').value = type;
    document.getElementById('paymentAmount').value = amount.toFixed(2);
    document.getElementById('paymentDate').valueAsDate = new Date();
    document.getElementById('paymentModal').classList.add('active');
    populatePaymentSelects();
}

function deletePayment(id) {
    if (!requireAdmin()) return;
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
        paymentsHistoryHtml = '<table><thead><tr><th>Дата</th><th>Сума</th><th>Валута</th><th>Метод</th><th>Номер на фактура</th><th>Дата на фактура</th><th>Бележки</th>' + (isAdmin() ? '<th>Действия</th>' : '') + '</tr></thead><tbody>';
        currentSchedule.forEach(p => {
            paymentsHistoryHtml += `<tr>
                <td data-label="Дата">${new Date(p.date).toLocaleDateString('bg-BG')}</td>
                <td data-label="Сума">${formatPrice(p.amount)} EUR</td>
                <td data-label="Валута">${p.currency || 'EUR'}</td>
                <td data-label="Метод">${methodNames[p.method] || p.method || ''}</td>
                <td data-label="Номер на фактура">${p.invoiceNumber || '-'}</td>
                <td data-label="Дата на фактура">${p.invoiceDate ? new Date(p.invoiceDate).toLocaleDateString('bg-BG') : '-'}</td>
                <td data-label="Бележки">${p.notes || ''}</td>
                ${isAdmin() ? '<td data-label="Действия"><button class="small" onclick="event.stopPropagation(); closePaymentDetail(); editPayment(\'' + p.id + '\')">✏️</button> <button class="danger small" onclick="event.stopPropagation(); if(confirm(\'Сигурен ли си?\')) { deletePayment(\'' + p.id + '\'); openPaymentDetail(\'' + contractId + '\', \'' + paymentType + '\'); }">🗑️</button></td>' : ''}
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
    if (!requireAdmin()) return;
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
    if (!requireAdmin()) return;
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
    if (!document.getElementById('invoicesTable')) return;
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
                <td data-label="Действия">${isAdmin() ? '<button class="danger small" onclick="if(confirm(\'Сигурен ли си?\')) deleteInvoice(\'' + invoice.id + '\')">🗑️</button>' : '-'}</td>
            </tr>
        `;
    });

    document.getElementById('invoicesTable').innerHTML = html || '<tr><td colspan="6" style="text-align: center; padding: 20px;">Няма фактури.</td></tr>';
}

function deleteInvoice(id) {
    if (!requireAdmin()) return;
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
    if (!requireAdmin()) return;
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
            <input type="number" class="extra-inst-percent" data-idx="${idx}" value="${percent || 35}" min="0" max="100" step="0.0001" required oninput="updateInstallmentAmounts()">
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
function editContract(id) {
    if (!requireAdmin()) return;
    const contract = appData.contracts.find(c => c.id === id);
    if (!contract) return;

    editingContractId = id;
    document.querySelector('#contractModal .modal-header span').textContent = 'Редактиране на договор';
    document.getElementById('contractModal').classList.add('active');
    document.getElementById('contractForm').reset();

    document.getElementById('contractOwner').value = contract.owner || '';
    document.getElementById('contractPhone').value = contract.phone || '';
    document.getElementById('contractNumber').value = contract.number || '';
    document.getElementById('contractDate').value = contract.date || '';

    document.getElementById('apartmentBuilding').value = contract.apartment ? contract.apartment.building : '';
    populateApartmentsSelect();
    document.getElementById('apartmentUnit').value = contract.apartment ? contract.apartment.unit : '';
    document.getElementById('apartmentValue').value = contract.apartment ? formatPrice(contract.apartment.value) : '';

    document.getElementById('parkingUnit').value = contract.parking ? contract.parking.unit : '';
    document.getElementById('parkingValue').value = contract.parking ? formatPrice(contract.parking.value) : '';

    document.getElementById('advancePercent').value = contract.advance ? contract.advance.percent : '';
    document.getElementById('advanceDate').value = contract.advance ? contract.advance.date : '';
    document.getElementById('installment1Percent').value = contract.installment1 ? contract.installment1.percent : '';
    document.getElementById('installment1Date').value = contract.installment1 ? contract.installment1.date : '';
    document.getElementById('installment2Percent').value = contract.installment2 ? contract.installment2.percent : '';
    document.getElementById('installment2Date').value = contract.installment2 ? contract.installment2.date : '';

    loadExtraInstallments(contract.extraInstallments);
    document.getElementById('contractNotes').value = contract.notes || '';

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
    const contract = appData.contracts.find(c => c.id === contractId);
    if (!contract) {
        document.getElementById('paymentUnitInfo').value = '';
        return;
    }

    const totalValue = parseMoney(contract.totalValue || 0);
    const payments = appData.getPaymentsByContract(contractId);

    let buildingName = '';
    let unitName = '';
    let parkingName = '';
    if (contract.apartment && contract.apartment.building) {
        buildingName = buildingNames[contract.apartment.building] || '';
        const u = (appData.units[contract.apartment.building] || []).find(u => u.id === contract.apartment.unit);
        if (u) unitName = u.name;
    }
    if (contract.parking && contract.parking.unit) {
        const u = (appData.units['parking'] || []).find(u => u.id === contract.parking.unit);
        if (u) parkingName = u.name;
    }

    let info = contract.owner;
    if (buildingName && unitName) info += ' — ' + buildingName + ' ' + unitName;
    if (parkingName) info += (info ? ', ' : '') + 'Паркомясто ' + parkingName;
    document.getElementById('paymentUnitInfo').value = info;

    const typeNames = getInstallmentTypeNames(contract);
    const typeSelect = document.getElementById('paymentType');
    typeSelect.innerHTML = '<option value="">Изберете</option>';
    const insts = getAllInstallments(contract);
    insts.forEach(sch => {
        if (sch.percent > 0) {
            typeSelect.innerHTML += '<option value="' + sch.type + '">' + (typeNames[sch.type] || sch.type) + '</option>';
        }
    });

    const propertySelect = document.getElementById('paymentPropertyType');
    propertySelect.innerHTML = '<option value="">Изберете</option>';
    if (contract.apartment && contract.apartment.building && contract.parking && contract.parking.unit) {
        propertySelect.innerHTML += '<option value="apartment">Апартамент</option><option value="parking">Паркомясто</option><option value="both">Апартамент и паркомясто</option>';
    } else if (contract.apartment && contract.apartment.building) {
        propertySelect.innerHTML += '<option value="apartment">Апартамент</option>';
    } else if (contract.parking && contract.parking.unit) {
        propertySelect.innerHTML += '<option value="parking">Паркомясто</option>';
    }

    document.getElementById('paymentCurrency').value = 'EUR';

    const firstType = typeSelect.options.length > 1 ? typeSelect.options[1].value : '';
    if (firstType) {
        const sch = insts.find(s => s.type === firstType);
        const scheduled = sch ? totalValue * sch.percent / 100 : 0;
        const paid = payments.filter(p => p.type === firstType).reduce((s, p) => s + parseMoney(p.amount || 0), 0);
        const remaining = scheduled - paid;
        document.getElementById('paymentAmount').value = remaining > 0 ? remaining.toFixed(2) : '';
    }
}

function exportToExcel() {
    if (!requireAdmin()) return;
    const header = [
        'Сграда', 'Договор №', 'Имот', 'Собственик', 'Телефон',
        'Дата', 'Стойност (EUR)',
        'Аванс %', 'Аванс сума', '1-во доп. %', '1-во доп. сума', '2-ро доп. %', '2-ро доп. сума',
        '3-то доп. %', '3-то доп. сума', '4-то доп. %', '4-то доп. сума', '5-то доп. %', '5-то доп. сума',
        'Ап. №', 'Вид', 'Кв.м', 'Цена (EUR)', 'Статус', 'Бележки'
    ];
    const rows = [header];

    appData.contracts.forEach(contract => {
        const totalValue = parseMoney(contract.totalValue || 0);
        let buildingName = '';
        let unitName = '';
        if (contract.apartment && contract.apartment.building) {
            buildingName = buildingNames[contract.apartment.building] || '';
            const u = (appData.units[contract.apartment.building] || []).find(u => u.id === contract.apartment.unit);
            if (u) unitName = u.name;
        } else if (contract.parking && contract.parking.unit) {
            const u = (appData.units['parking'] || []).find(u => u.id === contract.parking.unit);
            if (u) unitName = 'Паркомясто ' + u.name;
        }
        const row = new Array(25).fill('');
        row[0] = buildingName;
        row[1] = contract.number || '';
        row[2] = unitName;
        row[3] = contract.owner || '';
        row[4] = contract.phone || '';
        row[5] = contract.date || '';
        row[6] = totalValue || '';
        const insts = getAllInstallments(contract);
        for (let i = 0; i < 6; i++) {
            const sch = insts[i];
            if (sch && sch.percent > 0) {
                row[7 + i * 2] = sch.percent;
                row[8 + i * 2] = (totalValue * sch.percent / 100).toFixed(2);
            }
        }
        row[24] = contract.notes || '';
        rows.push(row);
    });

    Object.keys(buildingNames).forEach(building => {
        (appData.units[building] || []).forEach(unit => {
            rows.push([
                buildingNames[building], '', '', '', '',
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

    const headerFill = { patternType: 'solid', fgColor: { rgb: '4472C4' } };
    const headerFont = { bold: true, color: { rgb: 'FFFFFF' }, sz: 11, name: 'Calibri' };
    const headerAlign = { horizontal: 'center', vertical: 'center', wrapText: true };
    const cellFont = { sz: 10, name: 'Calibri' };
    const cellAlign = { vertical: 'center' };
    const numRows = rows.length;
    const numCols = header.length;

    for (let C = 0; C < numCols; C++) {
        const addr = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[addr]) ws[addr] = { v: header[C], t: 's' };
        ws[addr].s = { fill: headerFill, font: headerFont, alignment: headerAlign };
    }
    for (let R = 1; R < numRows; R++) {
        for (let C = 0; C < numCols; C++) {
            const addr = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[addr]) continue;
            ws[addr].s = { font: cellFont, alignment: cellAlign };
        }
    }

    ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: numRows - 1, c: numCols - 1 } }) };
    XLSX.utils.book_append_sheet(wb, ws, 'Данни');
    XLSX.writeFile(wb, 'apartments_data_' + new Date().getTime() + '.xlsx');
}

function importFromExcel() {
    if (!requireAdmin()) return;
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
    if (!requireAdmin()) return;
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
