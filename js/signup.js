document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');

    errorMsg.classList.add('d-none');
    successMsg.classList.add('d-none');

    try {
        const checkResponse = await fetch(`http://localhost:3000/users?username=${encodeURIComponent(username)}`);
        const checkResult = await checkResponse.json();
        const existing = Array.isArray(checkResult) ? checkResult : (checkResult.data || []);

        if (existing.length > 0) {
            errorMsg.textContent = 'Username already taken.';
            errorMsg.classList.remove('d-none');
            return;
        }

        await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        successMsg.classList.remove('d-none');
        document.getElementById('signupForm').reset();
    } catch (err) {
        errorMsg.textContent = 'Could not connect to server.';
        errorMsg.classList.remove('d-none');
    }
});
