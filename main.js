window.addEventListener('load', function() {
    try { renderAuthButton(); } catch (e) { console.error(e); }
    try { applyPermissions(); } catch (e) { console.error(e); }
    try { populateContractSelects(); } catch (e) { console.error(e); }
    try { populateContractFilters(); } catch (e) { console.error(e); }
    try { updateDashboard(); } catch (e) { console.error(e); }

    const paymentFilterBuilding = document.getElementById('paymentFilterBuilding');
    if (paymentFilterBuilding) {
        Object.keys(buildingNames).forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = buildingNames[key];
            paymentFilterBuilding.appendChild(opt);
        });
    }
});