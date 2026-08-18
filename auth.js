function getSession() {
    try {
        return localStorage.getItem('currentUser');
    } catch (e) {
        return null;
    }
}

function setSession(id) {
    try {
        if (id) localStorage.setItem('currentUser', id);
        else localStorage.removeItem('currentUser');
    } catch (e) {}
}

function getCurrentUser() {
    const id = getSession();
    if (!id) return null;
    return appData.profiles.find(p => p.id === id) || null;
}

function isLoggedIn() {
    return !!getCurrentUser();
}

function isAdmin() {
    const u = getCurrentUser();
    return u && u.role === 'admin';
}

function requireAdmin() {
    if (isAdmin()) return true;
    alert('⚠️ Нямате права за тази операция. Само администратор може да променя и редактира данни!');
    return false;
}

function renderAuthButton() {
    const u = getCurrentUser();
    const el = document.getElementById('authButton');
    if (!el) return;
    if (u) {
        el.innerHTML = '<span class="auth-user">' + (u.role === 'admin' ? '🛡️' : '👤') + ' ' + escapeHtml(u.username) + '</span> <button class="secondary small" onclick="logout()">Изход</button>';
    } else {
        el.innerHTML = '<button class="small" onclick="openLoginModal()">🔐 Вход</button>';
    }
}

function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('loginError').textContent = '';
    showLoginForm();
}

function showLoginForm() {
    document.getElementById('loginModalTitle').textContent = '🔐 Вход';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginError').textContent = '';
}

function showRegisterForm() {
    document.getElementById('loginModalTitle').textContent = '📝 Регистрация';
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
    document.getElementById('regUsername').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('loginError').textContent = '';
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

function doLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const profile = appData.profiles.find(p => p.username.toLowerCase() === username.toLowerCase() && p.password === password);
    if (!profile) {
        document.getElementById('loginError').textContent = 'Грешни потребителско име или парола!';
        return;
    }
    setSession(profile.id);
    closeLoginModal();
    applyPermissions();
    renderAuthButton();
    renderProfileManagement();
    alert('✅ Здравей, ' + profile.username + '! Влязъл си като ' + (profile.role === 'admin' ? 'администратор' : 'потребител') + '.');
}

function doRegister() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    if (!username || !password) {
        document.getElementById('loginError').textContent = 'Моля, попълни потребителско име и парола!';
        return;
    }
    if (appData.profiles.some(p => p.username.toLowerCase() === username.toLowerCase())) {
        document.getElementById('loginError').textContent = 'Това потребителско име вече съществува!';
        return;
    }
    const isFirst = appData.profiles.length === 0;
    const profile = appData.addProfile({
        username: username,
        password: password,
        role: isFirst ? 'admin' : 'user'
    });
    setSession(profile.id);
    closeLoginModal();
    applyPermissions();
    renderAuthButton();
    renderProfileManagement();
    alert('✅ Профилът е създаден! Ти си ' + (isFirst ? 'първият потребител и автоматично стана АДМИНИСТРАТОР.' : 'потребител с достъп само за преглед.') + '');
}

function logout() {
    setSession(null);
    applyPermissions();
    renderAuthButton();
    openLoginModal();
}

function renderProfileManagement() {
    const container = document.getElementById('profileManagement');
    if (!container) return;
    if (!isAdmin()) {
        container.innerHTML = '<p style="color:#888;">Само администратор може да управлява профили.</p>';
        return;
    }
    const current = getCurrentUser();
    let html = '<table><thead><tr><th>Потребител</th><th>Роля</th></tr></thead><tbody>';
    appData.profiles.forEach(p => {
        const isSelf = current && p.id === current.id;
        const select = '<select class="status-select" onchange="changeUserRole(\'' + p.id + '\', this.value)" ' + (isSelf ? 'disabled' : '') + '>' +
            '<option value="admin" ' + (p.role === 'admin' ? 'selected' : '') + '>Администратор</option>' +
            '<option value="user" ' + (p.role === 'user' ? 'selected' : '') + '>Потребител</option>' +
            '</select>';
        html += '<tr><td data-label="Потребител">' + escapeHtml(p.username) + (isSelf ? ' (ти)' : '') + '</td><td data-label="Роля">' + select + '</td></tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

function changeUserRole(profileId, role) {
    if (!isAdmin()) return;
    const profile = appData.profiles.find(p => p.id === profileId);
    if (!profile) return;
    const current = getCurrentUser();
    if (current && current.id === profileId) return;
    profile.role = role;
    appData.saveData('profiles', appData.profiles);
    alert('✅ Ролята на "' + profile.username + '" е променена на ' + (role === 'admin' ? 'администратор' : 'потребител') + '.');
    renderProfileManagement();
}

function applyPermissions() {
    const admin = isAdmin();
    const body = document.body;
    body.classList.toggle('logged-in', isLoggedIn());
    body.classList.toggle('role-user', !admin);
    body.classList.toggle('role-admin', admin);

    if (!isLoggedIn()) {
        openLoginModal();
        return;
    }

    if (admin) {
        document.getElementById('settings').classList.add('admin-only');
        renderProfileManagement();
    } else {
        document.getElementById('settings').classList.remove('admin-only');
        const st = document.getElementById('settings');
        if (st.classList.contains('active')) {
            switchTab('dashboard');
        }
    }
}

function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
}
