// handle add-post
const addPostHandler = async (event) => {
    event.preventDefault();
    const title = document.querySelector('input[name="title"]').value.trim();
    const content = document.querySelector('input[name="content"]').value.trim();

    const response = await fetch('/api/post', {
            method: 'POST',
            body: JSON.stringify({ title, content }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            console.log('error');
        }
    }
 
document
    .querySelector('#add-post-form')
    .addEventListener('submit', addPostHandler);