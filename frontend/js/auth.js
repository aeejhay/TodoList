document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('../backend/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = 'dashboard.html';
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('An error occurred. Please try again.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('../backend/auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.success) {
            showSuccess('Registration successful! Please check your email for verification.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('An error occurred. Please try again.');
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;

    const form = document.querySelector('form');
    form.insertBefore(errorDiv, form.firstChild);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;

    const form = document.querySelector('form');
    form.insertBefore(successDiv, form.firstChild);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
} 