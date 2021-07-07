const csrftoken = getCookie('csrftoken');

const url = window.location.href;
const split = url.split('/');
const pack = split[split.length - 2];

document.addEventListener('DOMContentLoaded', function() {

    load_chart();
    load_gear();
    render_add_gear_buttons();

    document.getElementById("add-gear").addEventListener("click", add_gear);

});

function load_gear() {
    fetch(`/api/pack/${pack}/gear`)
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

    // Remove gear
    const removeGear = document.createElement('button');
    removeGear.setAttribute('type','button');

    removeGear.classList.add('btn', 'btn-sm', 'btn-warning', 'me-1');
    removeGear.innerHTML = 'Remove Gear';
    removeGear.addEventListener('click', () => remove_gear(gear));

    edit.appendChild(removeGear);

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
        categories.forEach(render_add_existing_gear_button);
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

function render_add_existing_gear_button(category) {

    const addExistingGear = document.createElement('button');
    addExistingGear.setAttribute('type','button');
    addExistingGear.setAttribute('data-bs-toggle','modal');
    addExistingGear.setAttribute('data-bs-target','#addExistingGearModal');

    addExistingGear.classList.add('btn', 'btn-sm', 'btn-secondary');
    addExistingGear.innerHTML = 'Add existing gear';
    addExistingGear.addEventListener('click', () => render_add_existing_gear_modal(category));

    document.querySelector(`#${category[0]}-add-gear-button`).append(addExistingGear);
}

function render_add_gear_modal(category) {
    document.querySelector('#gear-category').value = category[0];
    document.querySelector('#gear-category-verbose').value = category[1];
}

async function render_add_existing_gear_modal(category) {

    // Clear out modal container rows
    document.querySelector('#add-existing-gear-modal-container').innerHTML='';

    fetch(`/api/pack/${pack}/category/${category[0]}`)
    .then(response => response.json())
    .then(gear => {
        gear.forEach(render_existing_gear)
    });
}

function render_existing_gear(gear) {

    // Check if gear is already in pack. If it is, skip it
    if (document.querySelector(`#gear-${gear.id}`) == null) {

        const row = document.createElement('tr');
        row.setAttribute('id','existing-gear-'+gear.id);
    
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
    
        // Add
        const addData = document.createElement('td');
    
        // Edit gear
        const add = document.createElement('button');
        add.setAttribute('type','button');
        add.classList.add('btn', 'btn-sm', 'btn-primary');
        add.innerHTML = 'Add';
        add.addEventListener('click', () => add_gear_to_pack(gear));
        add.addEventListener('click', () => render_gear(gear));
        add.addEventListener('click', () => {
            document.querySelector(`#existing-gear-${gear.id}`).remove();
        });
    
        addData.appendChild(add);
    
        row.appendChild(addData);
    
        document.querySelector(`#add-existing-gear-modal-container`).append(row);
    }
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

        // Add the new piece of gear to the current pack
        add_gear_to_pack(gear);

        // Render new piece of gear
        render_gear(gear);

    });

    // Clear modal form
    document.querySelector('#gear-category').value = '';
    document.querySelector('#gear-category-verbose').value = '';
    document.querySelector('#gear-brand').value = '';
    document.querySelector('#gear-description').value = '';
    document.querySelector('#gear-weight').value = '';

    // Render chart
    load_chart();
}

async function add_gear_to_pack(gear) {

    await fetch(`/api/pack/${pack}/gear`, {
        headers: {
            'X-CSRFToken': csrftoken, 
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        mode: 'same-origin',
        body: JSON.stringify({
            gear: gear,
            action: 'add'
        })
    })

    load_chart();
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

async function remove_gear(gear) {

    await fetch(`/api/pack/${pack}/gear`, {
        headers: {
            'X-CSRFToken': csrftoken, 
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        mode: 'same-origin',
        body: JSON.stringify({
            gear: gear,
            action: 'remove'
        })
    });

    load_chart();

    document.querySelector(`#gear-${gear.id}`).remove();

    

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

    // Re-render chart
    load_chart()

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

    // Re-render chart
    load_chart();

    // Clear edit modal form
    document.querySelector('#edit-gear-category').value = '';
    document.querySelector('#edit-gear-brand').value = '';
    document.querySelector('#edit-gear-description').value = '';
    document.querySelector('#edit-gear-weight').value = '';
    document.querySelector('#edit-gear-worn').checked = false;
    document.querySelector('#edit-gear-worn').checked = false;

}

async function load_chart() {

    await fetch(`/api/pack/${pack}/gear`, {
        cache: 'no-cache'
    })
    .then(response => response.json())
    .then(gear => {

        // Create dictionary that sums all gear weights per category
        var dict = {};

        // Initialize weight counter values
        var base_weight = 0;
        var worn_weight = 0;
        var consumable_weight = 0;
        var total_weight = 0;

        // Iterate through each piece of gear
        gear.forEach(gear => {

            category = gear.category;
            weight = gear.weight;

            // Update dictionary that tracks weight by category for plotting
            if (category in dict) {
                dict[category] = dict[category] + weight
            } else {
                dict[category] = weight
            }

            // Update weight tracking variables
            if (gear.worn) {
                worn_weight += gear.weight/16;
            } else if (gear.consumable) {
                consumable_weight += gear.weight/16;
            } else {
                base_weight += gear.weight/16;
            }

        });

        // Initialize label and weight arrays for plots
        var labels = [];
        var weight = [];

        for (let key in dict) {
            if (key === 'BG') {
                var key_verbose = 'Backpacking Gear'
            } else if (key === 'BK') {
                var key_verbose = 'Backcountry Kitchen'
            } else if (key === 'FW') {
                var key_verbose = 'Food and Water'
            } else if (key === 'CFW') {
                var key_verbose = 'Clothing and Footwear'
            } else if (key === 'NAV') {
                var key_verbose = 'Navigation'
            } else if (key === 'EFA') {
                var key_verbose = 'Emergency and First Aid'
            } else if (key === 'HH') {
                var key_verbose = 'Health and Hygiene'
            } else if (key === 'TR') {
                var key_verbose = 'Tools and Repair Items'
            } else if (key === 'XTRA') {
                var key_verbose = 'Backpacking Extras'
            } else if (key === 'PI') {
                var key_verbose = 'Personal Items'
            } else {
                var key_verbose = 'No category'
            }

            labels.push(key_verbose);
            weight.push(dict[key]/16);

        };

        total_weight = worn_weight + consumable_weight + base_weight;

        // Add weight summaries to page
        document.querySelector('#base-weight').innerHTML = `Base Weight = ${base_weight.toFixed(2)} lb`;
        document.querySelector('#worn-weight').innerHTML = `Worn Weight = ${worn_weight.toFixed(2)} lb`;
        document.querySelector('#consumable-weight').innerHTML = `Consumable Weight = ${consumable_weight.toFixed(2)} lb`;
        document.querySelector('#total-weight').innerHTML = `Total Weight = ${total_weight.toFixed(2)} lb`;

        const data = {

            labels: labels,

            datasets: [{
              label: 'Pack Breakdown',
              data: weight,
              backgroundColor: [
                'rgb(255, 102, 102)',
                'rgb(255, 178, 102)',
                'rgb(255, 255, 102)',
                'rgb(178, 255, 102)',
                'rgb(102, 255, 102)',
                'rgb(102, 255, 178)',
                'rgb(102, 255, 255)',
                'rgb(102, 178, 255)',
                'rgb(102, 102, 255)',
                'rgb(178, 102, 255)',
                'rgb(255, 102, 255)',
                'rgb(255, 102, 178)',
                'rgb(192, 192, 192)',
              ],
              hoverOffset: 4
            }]
        };
    
        const config = {
            type: 'doughnut',
            data,
            options: {
                legend:{position: 'left'},
                maintainAspectRatio: false,
            }
          };

        // If the chartr doesn't exist, create it
        if (typeof Chart.getChart("chart") == 'undefined') {
            var myChart = new Chart(
                document.getElementById('chart'),
                config
            );

        // If it does exist, update it with latest data
        } else {
            const myChart = Chart.getChart("chart")
            myChart.data = data;
            myChart.update();
        }

    });

}