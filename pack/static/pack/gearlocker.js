const csrftoken = getCookie('csrftoken');

document.addEventListener('DOMContentLoaded', function() {

    load_gear();
    render_add_gear_buttons();

    document.getElementById("add-gear").addEventListener("click", add_gear);

});

function load_gear() {
    fetch(`/api/gear`)
    .then(response => response.json())
    .then(gear => {
        gear.forEach(render_gear)
    });
  
  return false;
  
}

function render_gear(gear) {

    const row = document.createElement('tr');
    row.setAttribute('id','gear-'+gear.id);

    // Brand
    const brand = document.createElement('td');
    brand.innerHTML = gear.brand;
    row.appendChild(brand);

    // Description
    const description = document.createElement('td');
    description.innerHTML = gear.description;
    row.appendChild(description);

    // Weight
    const weight = document.createElement('td');
    weight.innerHTML = gear.weight;
    row.appendChild(weight);

    // Worn
    const worn = document.createElement('td');

    if (gear.worn === true) {
        worn.innerHTML = 'yes'
    } else {
        worn.innerHTML = 'no'
    }

    row.appendChild(worn);

    // Consumable
    const consumable = document.createElement('td');

    if (gear.consumable === true) {
        consumable.innerHTML = 'yes'
    } else {
        consumable.innerHTML = 'no'
    }

    row.appendChild(consumable);

    // Edit
    const edit = document.createElement('td');

    // Edit gear
    const editGear = document.createElement('button');
    editGear.setAttribute('type','button');
    editGear.setAttribute('data-bs-toggle','modal');
    editGear.setAttribute('data-bs-target','#editGearModal');

    editGear.classList.add('btn', 'btn-sm', 'btn-secondary', 'me-1');
    editGear.innerHTML = 'Edit Gear';
    editGear.addEventListener('click', () => render_edit_gear(gear));

    edit.appendChild(editGear);

    // Delete gear
    const deleteGear = document.createElement('button');
    deleteGear.setAttribute('type','button');

    deleteGear.classList.add('btn', 'btn-sm', 'btn-danger', 'me-1');
    deleteGear.innerHTML = 'Delete Gear';
    deleteGear.addEventListener('click', () => delete_gear(gear));

    edit.appendChild(deleteGear);

    row.appendChild(edit);

    document.querySelector(`#${gear.category}-container`).append(row);
}

function render_add_gear_buttons() {
    fetch(`/api/gear/categories`)
    .then(response => response.json())
    .then(categories => {
        categories.forEach(render_add_gear_button);
    }); 
  
}

function render_add_gear_button(category) {

    const addGear = document.createElement('button');
    addGear.setAttribute('type','button');
    addGear.setAttribute('data-bs-toggle','modal');
    addGear.setAttribute('data-bs-target','#addNewGearModal');

    addGear.classList.add('btn', 'btn-sm', 'btn-success', 'me-1');
    addGear.innerHTML = 'Add new gear';
    addGear.addEventListener('click', () => render_add_gear_modal(category));

    document.querySelector(`#${category[0]}-add-gear-button`).append(addGear);
}

function render_add_gear_modal(category) {
    document.querySelector('#gear-category').value = category[0];
    document.querySelector('#gear-category-verbose').value = category[1];
}

async function add_gear() {

    // Create the new piece of gear
    await fetch(`/api/gear/`, {
        headers: {
            'X-CSRFToken': csrftoken, 
            'Content-Type': 'application/json'
        },
        method: 'POST',
        mode: 'same-origin',
        body: JSON.stringify({
            category: document.querySelector('#gear-category').value,
            brand: document.querySelector('#gear-brand').value,
            description: document.querySelector('#gear-description').value,
            weight: document.querySelector('#gear-weight').value,
            worn: document.querySelector('#gear-worn').checked,
            consumable: document.querySelector('#gear-consumable').checked,
        })
    })
    .then(response => response.json())
    .then(gear => {

        // Render new piece of gear
        render_gear(gear);

    });

    // Clear modal form
    document.querySelector('#gear-category').value = '';
    document.querySelector('#gear-category-verbose').value = '';
    document.querySelector('#gear-brand').value = '';
    document.querySelector('#gear-description').value = '';
    document.querySelector('#gear-weight').value = '';

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

async function delete_gear(gear) {

    await fetch(`/api/gear/${gear.id}`, {
        headers: {
            'X-CSRFToken': csrftoken, 
            'Content-Type': 'application/json'
        },
        method: 'DELETE',
        mode: 'same-origin',
    })
    .then(        
        
    );

    document.querySelector(`#gear-${gear.id}`).remove();

}

function render_edit_gear(gear) {
    // Populate edit fields
    document.querySelector('#edit-gear-category').value = gear.category;
    document.querySelector('#edit-gear-category-verbose').value = gear.category;
    document.querySelector('#edit-gear-brand').value = gear.brand;
    document.querySelector('#edit-gear-description').value = gear.description;
    document.querySelector('#edit-gear-weight').value = gear.weight;
    document.querySelector('#edit-gear-worn').checked = gear.worn;
    document.querySelector('#edit-gear-consumable').checked = gear.consumable;

    // Remove all event listeners from modal submit button
    var old_button = document.querySelector("#edit-gear");
    var new_button = old_button.cloneNode(true);
    old_button.parentNode.replaceChild(new_button, old_button);

    // Add new event listener to modal submit button
    document.querySelector("#edit-gear").addEventListener('click', () => edit_gear(gear));
}

async function edit_gear(gear) {

    await fetch(`/api/gear/${gear.id}`, {
        headers: {
            'X-CSRFToken': csrftoken, 
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        mode: 'same-origin',
        body: JSON.stringify({
            category: document.querySelector('#edit-gear-category').value,
            brand: document.querySelector('#edit-gear-brand').value,
            description: document.querySelector('#edit-gear-description').value,
            weight: document.querySelector('#edit-gear-weight').value,
            worn: document.querySelector('#edit-gear-worn').checked,
            consumable: document.querySelector('#edit-gear-consumable').checked,
        })
    })
    .then(response => response.json())
    .then(gear => {

        // Clear old gear row
        document.querySelector(`#gear-${gear.id}`).remove();

        // Render new gear row
        render_gear(gear);

    });

    // Clear edit modal form
    document.querySelector('#edit-gear-category').value = '';
    document.querySelector('#edit-gear-brand').value = '';
    document.querySelector('#edit-gear-description').value = '';
    document.querySelector('#edit-gear-weight').value = '';
    document.querySelector('#edit-gear-worn').checked = false;
    document.querySelector('#edit-gear-worn').checked = false;

}
