const logout = async (event) => {
    // stop the browser from submitting the form so we can do so with JavaScript
        event.preventDefault();
        console.log("is it reading this");
    // make a POST request to destroy the session on the back end
        const response = await fetch('/api/user/logout', {
          method: 'POST',
          headers: {'content-Type': 'application/json' },
        });
      
        if (response.ok) {
    // if successfully logged out, redirect to the login page
          document.location.replace('/');
        } else {
          alert(response.statusText);
        }
      };
      
      document.querySelector('#logout').addEventListener('click', logout);