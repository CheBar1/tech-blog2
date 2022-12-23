// handle signup
const signupFormHandler = async (event) => {
    event.preventDefault();
// collect values from the signup form
    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (username && password) {
// send the name and password to the server
        const response = await fetch('/api/user', {
            method:'POST',
            body: JSON.stringify({username, password,}),
            headers: {'Content-Type': 'application/json'},
        });
        if (response.ok) {
// if successful, redirect the browser to the dashboard
            document.location.replace('/dashboard');
        } else {
            console.log('error');
        }
    }
};

document
    .querySelector('#signup-form')
    .addEventListener('submit', signupFormHandler);