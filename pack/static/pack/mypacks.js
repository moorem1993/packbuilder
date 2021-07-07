const csrftoken = getCookie('csrftoken');

document.addEventListener('DOMContentLoaded', function() {

    load_packs();

    document.getElementById("add-pack").addEventListener("click", add_pack);

});

function load_packs() {
    fetch(`api/pack/`)
    .then(response => response.json())
    .then(packs => {
        packs.forEach(render_pack)
    });
  
  return false;
  
}

function render_pack(pack) {

    const row = document.createElement('tr');
    row.setAttribute('id','pack-'+pack.id);

    // Name
    const name = document.createElement('th');
    name.setAttribute('scope','row');
    name.innerHTML = pack.name;
    row.appendChild(name);

    // Days
    const days = document.createElement('td');
    days.innerHTML = pack.days;
    row.appendChild(days);

    // Nights
    const nights = document.createElement('td');
    nights.innerHTML = pack.nights;
    row.appendChild(nights);

    // Distance
    const distance = document.createElement('td');
    distance.innerHTML = pack.miles;
    row.appendChild(distance);

    // Edit
    const edit = document.createElement('td');

    // Edit details
    const editDetails = document.createElement('button');
    editDetails.setAttribute('type','button');
    editDetails.setAttribute('data-bs-toggle','modal');
    editDetails.setAttribute('data-bs-target','#editPackModal');

    editDetails.classList.add('btn', 'btn-sm', 'btn-secondary', 'me-1');
    editDetails.innerHTML = 'Edit Details';
    editDetails.addEventListener('click', () => render_edit_pack(pack));

    edit.appendChild(editDetails);

    // Edit gear
    const editGear = document.createElement('a');
    editGear.setAttribute('type','button');
    editGear.setAttribute('href', `mypacks/pack/${pack.id}`)
    editGear.classList.add('btn', 'btn-sm', 'btn-warning', 'me-1');
    editGear.innerHTML = 'Look Inside';
    edit.appendChild(editGear);

    // Delete
    const deletePack = document.createElement('button');
    deletePack.setAttribute('type','button');
    deletePack.classList.add('btn', 'btn-sm', 'btn-danger');
    deletePack.innerHTML = 'Delete';
    deletePack.addEventListener('click', () => delete_pack(pack));
    edit.appendChild(deletePack);

    row.appendChild(edit);

    document.querySelector('#pack-container').append(row);
}

function clear_packs() {
    document.querySelector('#pack-container').innerHTML = '';
}

async function add_pack() {

    await fetch(`/api/pack/`, {
        headers: {
            'X-CSRFToken': csrftoken, 
            'Content-Type': 'application/json'
        },
        method: 'POST',
        mode: 'same-origin',
        body: JSON.stringify({
            name: document.querySelector('#pack-name').value,
            days: document.querySelector('#pack-days').value,
            nights: document.querySelector('#pack-nights').value,
            miles: document.querySelector('#pack-miles').value,
        })
    })
    .then(response => response.json())
    .then(pack => {
        // Render new pack
        render_pack(pack);

    });

    // Clear modal form
    document.querySelector('#pack-name').value = '';
    document.querySelector('#pack-days').value = '';
    document.querySelector('#pack-nights').value = '';
    document.querySelector('#pack-miles').value = '';

}

async function delete_pack(pack) {

    await fetch(`/api/pack/${pack.id}`, {
        headers: {
            'X-CSRFToken': csrftoken, 
            'Content-Type': 'application/json'
        },
        method: 'DELETE',
        mode: 'same-origin',
    }).then(function(response) {
        console.log(response);
    });

    document.querySelector(`#pack-${pack.id}`).remove();
}

function render_edit_pack(pack) {
    // Populate pack fields
    document.querySelector('#edit-pack-name').value = pack.name;
    document.querySelector('#edit-pack-days').value = pack.days;
    document.querySelector('#edit-pack-nights').value = pack.nights;
    document.querySelector('#edit-pack-miles').value = pack.miles;

    // Remove all event listeners from modal submit button
    var old_button = document.querySelector("#edit-pack");
    var new_button = old_button.cloneNode(true);
    old_button.parentNode.replaceChild(new_button, old_button);

    // Add new event listener to modal submit button
    document.querySelector("#edit-pack").addEventListener('click', () => edit_pack(pack));
}

async function edit_pack(pack) {

    await fetch(`/api/pack/${pack.id}/`, {
        headers: {
            'X-CSRFToken': csrftoken, 
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        mode: 'same-origin',
        body: JSON.stringify({
            name: document.querySelector('#edit-pack-name').value,
            days: document.querySelector('#edit-pack-days').value,
            nights: document.querySelector('#edit-pack-nights').value,
            miles: document.querySelector('#edit-pack-miles').value,
        })
    })
    .then(response => response.json())
    .then(pack => {

        // Clear old gear row
        document.querySelector(`#pack-${pack.id}`).remove();

        // Render new gear row
        render_pack(pack);

    });

    // Clear edit modal form
    document.querySelector('#edit-pack-name').value = '';
    document.querySelector('#edit-pack-days').value = '';
    document.querySelector('#edit-pack-nights').value = '';
    document.querySelector('#edit-pack-miles').value = '';
    
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}