async function refreshAll() {
    try {
        await appData.init();
    } catch (e) {
        console.error('Грешка при зареждане на данни:', e);
    }
    try { renderAuthButton(); } catch (e) { console.error(e); }
    try { applyPermissions(); } catch (e) { console.error(e); }
    try { populateContractSelects(); } catch (e) { console.error(e); }
    try { populateContractFilters(); } catch (e) { console.error(e); }
    try { updateDashboard(); } catch (e) { console.error(e); }
}

async function dangerResetAll() {
    if (!confirm('Сигурен ли си? Това ще изтрие ВСИЧКИ данни от базата (вкл. потребители)! Това е необратимо!')) return;
    try {
        await api('/reset', { method: 'DELETE' });
        setSession(null);
        alert('✅ Всички данни са изтрити.');
        location.reload();
    } catch (e) {
        alert('❌ ' + e.message);
    }
}

window.addEventListener('load', function() {
    refreshAll().then(function() {
        const paymentFilterBuilding = document.getElementById('paymentFilterBuilding');
        if (paymentFilterBuilding) {
            Object.keys(buildingNames).forEach(function(key) {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = buildingNames[key];
                paymentFilterBuilding.appendChild(opt);
            });
        }
    });
});