// Grab Elements that will be changed dynamically
const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const barksElement = document.querySelector('.barks')

// POST req url where data will be sent to server
const API_URL = 'http://localhost:5000/barks'

// Hide loading gif when not loading
loadingElement.style.display = '';

listAllBarks();


// Event Listener for when user clicks submit, sending post info to back-end server
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');
    
    const bark = {
        name,
        content
    };

    form.style.display = 'none';
    loadingElement.style.display = ''

    // Send post data to server which will then insert it into database
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(bark),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
      .then (createdBark => {
          form.reset();
          setTimeout(() => {
              form.style.display = '';
              loadingElement.style.display = 'none'
          }, 10000)
          loadingElement.style.display = 'none'
          form.style.display = '';
          listAllBarks();
      })
});

function listAllBarks(){
    barksElement.innerHTML = '';
    fetch(API_URL)
      .then(response => response.json())
      .then(barks => {
          barks.reverse();
          barks.forEach(bark => {
            const div = document.createElement('div');
            
            const header = document.createElement('h3');
            header.textContent = bark.name;

            const contents = document.createElement('p');
            contents.textContent = bark.content;
            
            const date = document.createElement('small');
            date.textContent =new Date(bark.created);

            div.appendChild(header);
            div.appendChild(contents);
            div.appendChild(date);

            barksElement.appendChild(div);
          })
          loadingElement.style.display = 'none';
      })
}