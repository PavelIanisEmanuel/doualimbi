document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('errorMsg');

    errorMsg.classList.add('d-none');

    try {
        const response = await fetch(`http://localhost:3000/users?username=${encodeURIComponent(username)}`);
        const result = await response.json();
        const users = Array.isArray(result) ? result : (result.data || []);
        const user = users.find(u => u.password === password);

        if (user) {
            window.location.href = 'index.html';
        } else {
            errorMsg.classList.remove('d-none');
        }
    } catch (err) {
        errorMsg.textContent = 'Could not connect to server.';
        errorMsg.classList.remove('d-none');
    }
});
