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

    fetch(`https://dummyjson.com/users/filter?key=username&value=${username}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Gagal mengambil data dari server.');
            }
            return res.json();
        })
        .then(data => {
            setTimeout(() => {
                const user = data.users[0];

                if (user && user.password === password) {
                    displayMessage('success', `Selamat datang kembali, ${user.firstName}! Mengalihkan...`);
                    localStorage.setItem('firstName', user.firstName);
                    localStorage.setItem('currentUser', user.username);

                    const images = document.querySelectorAll('.food-image');
                    images.forEach((img, index) => {
                        img.classList.add(index % 2 === 0 ? 'animate-out-left' : 'animate-out-right');
                    });

                    setTimeout(() => {
                        window.location.href = 'recipes.html';
                    }, 400);
                } else {
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