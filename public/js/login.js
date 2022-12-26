// handle login
const loginFormHandler = async (event) => {
    // stop the browser from submitting the form so we can do so with JavaScript
        event.preventDefault();
    // gather the data from the form elements on the page
        const username = document.querySelector('#username-login').value.trim();
        const password = document.querySelector('#password-login').value.trim();
    
        if (username && password) {
    // send the e-mail and password to the server
            const response = await fetch('/api/user', {
                method: 'POST',
                body: JSON.stringify({username, password}),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
    // if successful, redirect the browser to the dashboard
                document.location.replace('/dashboard');
            } else {
                console.log('error');
            }
        }
    }
    
    document
      .querySelector('.login-form')
      .addEventListener('submit', loginFormHandler);