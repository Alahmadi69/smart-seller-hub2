document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', handleContact);

    if (document.getElementById('dashboardContent')) loadDashboard();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('userSession');
            window.location.href = 'index.html';
        });
    }

    updateNavForSession();
});

function handleContact(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const alertBox = document.getElementById('formAlert');

    if (!name || !email || !message) {
        showAlert(alertBox, 'Please fill in all fields.', 'error');
        return;
    }

    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push({
        name,
        email,
        message,
        date: new Date().toLocaleString()
    });
    localStorage.setItem('contactMessages', JSON.stringify(messages));

    showAlert(alertBox, `Thank you, ${name}! Your message has been received.`, 'success');
    document.getElementById('contactForm').reset();
}

function loadDashboard() {
    const session = JSON.parse(localStorage.getItem('userSession') || 'null');
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('welcomeUser').textContent = session.username;
    document.getElementById('loginTime').textContent = session.loginTime;

    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    document.getElementById('messageCount').textContent = messages.length;

    const list = document.getElementById('messageList');
    if (messages.length === 0) {
        list.innerHTML = '<p class="empty-state">No messages yet.</p>';
        return;
    }

    const items = messages.slice().reverse().map(m => `
        <li>
            <strong>${m.name} (${m.email})</strong>
            <p>${m.message}</p>
            <div class="meta">${m.date}</div>
        </li>
    `).join('');

    list.innerHTML = `<ul class="message-list">${items}</ul>`;
}

function updateNavForSession() {
    const loginLink = document.getElementById('navLogin');
    const session = JSON.parse(localStorage.getItem('userSession') || 'null');
    if (loginLink && session) {
        loginLink.textContent = 'Dashboard';
        loginLink.href = 'dashboard.html';
    }
}

function showAlert(box, message, type) {
    box.textContent = message;
    box.className = `alert show alert-${type}`;
}
