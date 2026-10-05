function showLoadError(message) {
    let box = document.getElementById('loadErrorBox');
    if (!box) {
        box = document.createElement('div');
        box.id = 'loadErrorBox';
        box.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#c0392b;color:#fff;padding:12px 16px;font-size:0.9rem;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,0.25)';
        document.body.appendChild(box);
    }
    box.textContent = '⚠️ Данните не могат да се заредят: ' + message + ' — опитайте да презаредите страницата (F5).';
}

function clearLoadError() {
    const box = document.getElementById('loadErrorBox');
    if (box) box.remove();
}

async function refreshAll() {
    try {
        await appData.init();
        clearLoadError();
    } catch (e) {
        console.error('Грешка при зареждане на данни:', e);
        showLoadError(e.message || 'неизвестна грешка');
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