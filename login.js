document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        displayMessage('error', 'Username dan Password tidak boleh kosong.');
        return;
    }

    setLoadingState(true);

    // Kita akan mengambil data untuk satu user saja agar lebih efisien
    fetch(`https://dummyjson.com/users/filter?key=username&value=${username}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Gagal mengambil data dari server.');
            }
            return res.json();
        })
        .then(data => {
            // Jeda buatan agar loading terlihat
            setTimeout(() => {
                const user = data.users[0]; // Ambil user pertama dari hasil filter

                // --- BAGIAN YANG DIPERBAIKI ADA DI SINI ---
                if (user && user.password === password) {
                    // 1. Username ditemukan DAN password cocok
                    displayMessage('success', `Selamat datang kembali, ${user.firstName}! Mengalihkan...`);
                    localStorage.setItem('firstName', user.firstName);
                    
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 1500);
                } else {
                    // 2. Jika username tidak ditemukan ATAU password salah
                    displayMessage('error', 'Username atau Password salah. Coba lagi.');
                    setLoadingState(false);
                }
            }, 1000);
        })
        .catch(error => {
            console.error('Error saat login:', error);
            setTimeout(() => {
                displayMessage('error', 'Terjadi masalah dengan koneksi. Coba lagi nanti.');
                setLoadingState(false);
            }, 1000);
        });
}

function displayMessage(type, text) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
    }
}

function setLoadingState(isLoading) {
    const loginButton = document.querySelector('.login-button');
    if (loginButton) {
        if (isLoading) {
            loginButton.classList.add('loading');
            loginButton.disabled = true;
        } else {
            loginButton.classList.remove('loading');
            loginButton.disabled = false;
        }
    }
} 