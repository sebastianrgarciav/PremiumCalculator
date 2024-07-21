let CONSTANTS = {};
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('../configuration/constants.json');
        CONSTANTS = await response.json();

        try {
            await fetchPlansAndConfig();
        } catch (error) {
            console.error(CONSTANTS.ERROR.FETCH_PLANS_CONFIG, error);
            populateNoPlansFound();
            document.getElementById('saveChangesButton').disabled = true;
            document.getElementById('addRowButton').disabled = true;
            Swal.fire({
                title: 'Warning',
                text: CONSTANTS.ERROR.FETCH_PLANS_CONFIG,
                icon: 'info',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error loading constants:', error);
        populateNoPlansFound();
        document.getElementById('saveChangesButton').disabled = true;
        document.getElementById('addRowButton').disabled = true;
        Swal.fire({
            title: 'Warning',
            text: CONSTANTS.ERROR.FETCH_CONFIG,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    }
});

const fetchPlansAndConfig = async () => {
    try {
        populateNoPlansFound();
        const data = await getPlans();
        const configResponse = await fetch('../configuration/config.json');
        const configData = await configResponse.json();
        configData.states['*'] = '*';
        if (!configData.months.includes('*')) {
            configData.months.push('*');
        }

        populatePlansTable(data, configData);
        document.getElementById('addRowButton').addEventListener('click', () => addRow(configData));
        document.getElementById('saveChangesButton').addEventListener('click', saveChanges);
    } catch (error) {
        console.error(CONSTANTS.ERROR.FETCH_PLANS_CONFIG, error);
        populateNoPlansFound();
        document.getElementById('saveChangesButton').disabled = true;
        document.getElementById('addRowButton').disabled = true;
        Swal.fire({
            title: 'Warning',
            text: CONSTANTS.ERROR.FETCH_PLANS_CONFIG,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    }
};

const populateNoPlansFound = () => {
    const plansTableBody = document.getElementById('plansTableBody');
    plansTableBody.innerHTML = '';
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 8;
    cell.textContent = 'No matching plans found';
    row.appendChild(cell);
    plansTableBody.appendChild(row);
    updatePlansTitle(0);
};

const updatePlansTitle = (numberOfPlans) => {
    const titleElement = document.getElementById('plansTitle');
    titleElement.textContent = `List of plans [${numberOfPlans}]`;
};

let currentData = [];

const populatePlansTable = (data, config) => {
    try {
        const plansTableBody = document.getElementById('plansTableBody');
        plansTableBody.innerHTML = '';
        currentData = data;

        if (data.length === 0) {
            populateNoPlansFound();
            return;
        }

        data.forEach((plan, index) => {
            const row = document.createElement('tr');

            row.appendChild(createEditableCell('carrier', plan.carrier, index, createInput('text', plan.carrier)));
            row.appendChild(createEditableCell('plan', plan.plan, index, createPlanInput(config.plans, plan.plan)));
            row.appendChild(createEditableCell('state', plan.state, index, createStateSelect(config.states, plan.state, true)));
            row.appendChild(createEditableCell('monthOfBirth', plan.monthOfBirth, index, createMonthSelect(config.months, plan.monthOfBirth, true)));
            row.appendChild(createEditableCell('minAge', plan.ageRange[0], index, createInput('number', plan.ageRange[0])));
            row.appendChild(createEditableCell('maxAge', plan.ageRange[1], index, createInput('number', plan.ageRange[1])));
            row.appendChild(createEditableCell('premium', plan.premium.toFixed(2), index, createInput('number', plan.premium.toFixed(2), '0.01')));

            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
            editButton.addEventListener('click', () => makeRowEditable(row, index, config));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => deleteRow(index, config));
            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);

            plansTableBody.appendChild(row);
        });
        updatePlansTitle(data.length);
        highlightEmptyFields();
        validateSaveButton();
    } catch (error) {
        console.error(CONSTANTS.ERROR.POPULATE_PLANS_TABLE, error);
    }
};

const createEditableCell = (field, value, index, inputElement = null) => {
    const cell = document.createElement('td');
    if (inputElement) {
        cell.appendChild(inputElement);
        inputElement.value = value;
        inputElement.readOnly = true;
    } else {
        cell.textContent = value;
    }
    cell.dataset.field = field;
    cell.dataset.index = index;
    cell.contentEditable = false;
    return cell;
};

const createInput = (type, value, step = null) => {
    const input = document.createElement('input');
    input.type = type;
    if (type === 'number') {
        input.min = 0;
        if (step) {
            input.step = step;
        }
    }
    input.value = value;
    input.addEventListener('input', removeErrorStyles);
    return input;
};

const createPlanInput = (plans, selectedPlans) => {
    selectedPlans = Array.isArray(selectedPlans) ? selectedPlans.map(plan => plan.trim()) : selectedPlans.split(',').map(plan => plan.trim()).filter(Boolean);

    const container = document.createElement('div');
    container.className = 'multi-select-container';

    const input = document.createElement('input');
    input.type = 'text';
    input.readOnly = true;
    input.value = selectedPlans.join(', ');
    input.addEventListener('keydown', (e) => {
        e.preventDefault();
    });

    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';
    dropdown.style.display = 'none';

    Object.keys(plans).forEach(value => {
        const option = document.createElement('div');
        option.className = 'dropdown-item';
        option.textContent = plans[value];
        option.dataset.value = value;

        if (selectedPlans.includes(value.trim())) {
            option.classList.add('selected');
        }

        option.addEventListener('click', () => {
            if (!selectedPlans.includes(value.trim())) {
                selectedPlans.push(value.trim());
                option.classList.add('selected');
            } else {
                selectedPlans = selectedPlans.filter(plan => plan !== value.trim());
                option.classList.remove('selected');
            }
            input.value = selectedPlans.join(', ');
            if (input.value.trim() !== '') {
                input.style.border = '';
            }
        });

        dropdown.appendChild(option);
    });

    container.appendChild(input);
    container.appendChild(dropdown);

    input.addEventListener('focus', () => {
        if (!input.readOnly) {
            dropdown.style.display = 'block';
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 100);
    });

    input.addEventListener('input', removeErrorStyles);

    return container;
};

const createStateSelect = (states, selectedState, disabled = false) => {
    const select = document.createElement('select');
    Object.entries(states).forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        if (value === selectedState) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    select.disabled = disabled;
    select.addEventListener('change', removeErrorStyles);
    return select;
};

const createMonthSelect = (months, selectedMonth, disabled = false) => {
    const select = document.createElement('select');
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        if (month === selectedMonth) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    select.disabled = disabled;
    select.addEventListener('change', removeErrorStyles);
    return select;
};

const makeRowEditable = (row, index, config) => {
    row.querySelectorAll('td').forEach(cell => {
        if (['carrier', 'plan', 'minAge', 'maxAge', 'premium', 'state', 'monthOfBirth'].includes(cell.dataset.field)) {
            const input = cell.querySelector('input');
            if (input) {
                input.readOnly = false;
                input.addEventListener('input', validateNumberInput);
            }
        }
        const select = cell.querySelector('select');
        if (select) {
            select.disabled = false;
        }
        cell.style.backgroundColor = 'white';
    });

    const editButton = row.querySelector('button');
    editButton.innerHTML = '<i class="fas fa-save"></i>';
    editButton.removeEventListener('click', () => makeRowEditable(row, index, config));
    editButton.addEventListener('click', () => saveRow(row, index, config));
    document.getElementById('saveChangesButton').style.display = 'block';
};

const saveRow = (row, index, config) => {
    let isValid = true;
    let validationMessage = CONSTANTS.GENERAL.FIX_ERRORS;

    row.querySelectorAll('td').forEach(cell => {
        const field = cell.dataset.field;
        const input = cell.querySelector('input');
        const select = cell.querySelector('select');
        if (field && (input || select)) {
            if (field === 'carrier' && (input.value.trim() === '' || !input)) {
                input.style.border = '2px solid red';
                isValid = false;
                validationMessage += `\n- ${CONSTANTS.VALIDATION.CARRIER_EMPTY}`;
            } else if (field === 'plan' && (input.value.trim() === '' || !input)) {
                input.style.border = '2px solid red';
                isValid = false;
                validationMessage += `\n- ${CONSTANTS.VALIDATION.PLAN_EMPTY}`;
            } else if (field === 'state' && (select.value.trim() === '' || !select)) {
                select.style.border = '2px solid red';
                isValid = false;
                validationMessage += `\n- ${CONSTANTS.VALIDATION.STATE_EMPTY}`;
            } else if (field === 'monthOfBirth' && (select.value.trim() === '' || !select)) {
                select.style.border = '2px solid red';
                isValid = false;
                validationMessage += `\n- ${CONSTANTS.VALIDATION.MONTH_EMPTY}`;
            } else if (field === 'minAge' || field === 'maxAge') {
                const minAge = field === 'minAge' ? parseInt(input.value) : parseInt(row.querySelector('td[data-field="minAge"] input').value);
                const maxAge = field === 'maxAge' ? parseInt(input.value) : parseInt(row.querySelector('td[data-field="maxAge"] input').value);
                if (isNaN(minAge) || isNaN(maxAge) || minAge >= maxAge) {
                    input.style.border = '2px solid red';
                    row.querySelector('td[data-field="minAge"] input').style.border = '2px solid red';
                    row.querySelector('td[data-field="maxAge"] input').style.border = '2px solid red';
                    isValid = false;
                    validationMessage += `\n- ${CONSTANTS.VALIDATION.MIN_AGE_INVALID}`;
                }
            } else if (field === 'premium') {
                let value = parseFloat(input.value);
                if (value <= 0 || isNaN(value) || !/^(\d+(\.\d{1,2})?)$/.test(input.value)) {
                    input.style.border = '2px solid red';
                    isValid = false;
                    validationMessage += `\n- ${CONSTANTS.VALIDATION.PREMIUM_INVALID}`;
                }
            } else {
                if (input) {
                    input.style.border = '';
                }
                if (select) {
                    select.style.border = '';
                }
            }
        }
    });

    if (!isValid) {
        Swal.fire({
            title: 'Warning',
            html: validationMessage.replace(/\n/g, '<br>'),
            icon: 'info',
            confirmButtonText: 'OK'
        });
        return;
    }

    row.querySelectorAll('td').forEach(cell => {
        const field = cell.dataset.field;
        if (field) {
            if (field === 'minAge') {
                currentData[index]['ageRange'][0] = parseInt(cell.querySelector('input').value);
            } else if (field === 'maxAge') {
                currentData[index]['ageRange'][1] = parseInt(cell.querySelector('input').value);
            } else if (field === 'plan') {
                const input = cell.querySelector('input');
                currentData[index][field] = input.value;
            } else if (field === 'state') {
                const select = cell.querySelector('select');
                currentData[index][field] = select.value;
            } else if (field === 'monthOfBirth') {
                const select = cell.querySelector('select');
                currentData[index][field] = select.value;
            } else if (field === 'premium') {
                currentData[index][field] = parseFloat(cell.querySelector('input').value);
            } else if (field === 'carrier') {
                currentData[index][field] = cell.querySelector('input').value;
            } else {
                currentData[index][field] = cell.textContent;
            }
        }
        cell.contentEditable = false;
        const input = cell.querySelector('input');
        if (input) {
            input.readOnly = true;
        }
        const select = cell.querySelector('select');
        if (select) {
            select.disabled = true;
        }
        cell.style.backgroundColor = '';
    });

    const editButton = row.querySelector('button');
    editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    editButton.removeEventListener('click', () => saveRow(row, index, config));
    editButton.addEventListener('click', () => makeRowEditable(row, index, config));
    validateSaveButton();
};

const validateSaveButton = () => {
    const saveChangesButton = document.getElementById('saveChangesButton');
    const allRowsSaved = Array.from(document.querySelectorAll('#plansTableBody tr')).every(row => {
        const inputEditable = row.querySelector('input:not([readonly])');
        const selectEnabled = row.querySelector('select:not([disabled])');
        return !inputEditable && !selectEnabled;
    });
    saveChangesButton.disabled = !allRowsSaved;
};

const saveChanges = async () => {
    const unsavedRows = Array.from(document.querySelectorAll('#plansTableBody tr')).filter(row => {
        const inputEditable = row.querySelector('input:not([readonly])');
        const selectEnabled = row.querySelector('select:not([disabled])');
        return inputEditable || selectEnabled;
    });

    const hasRedBorders = Array.from(document.querySelectorAll('#plansTableBody input, #plansTableBody select')).some(element => {
        return element.style.border === '2px solid red';
    });

    if (unsavedRows.length > 0 || hasRedBorders) {
        Swal.fire({
            title: 'Warning',
            text: 'Please fix all fields with errors before saving changes.',
            icon: 'info',
            confirmButtonText: 'OK'
        });
        return;
    }

    try {
        const data = await updatePlans(currentData);
        Swal.fire({
            title: 'Success',
            text: CONSTANTS.SUCCESS.PLANS_UPDATED,
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            getPlans();
            window.location.href = '../index.html';
        });
    } catch (error) {
        console.error(CONSTANTS.ERROR.SAVE_CHANGES, error);
        Swal.fire({
            title: 'Warning',
            text: CONSTANTS.ERROR.SAVE_CHANGES,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    }
};

const addRow = (config) => {
    const newRow = {
        carrier: '',
        plan: '',
        state: '',
        monthOfBirth: '',
        ageRange: [0, 0],
        premium: 0.00
    };
    currentData.unshift(newRow);
    populatePlansTable(currentData, config);
    makeRowEditable(document.querySelector('#plansTableBody tr:first-child'), 0, config);
    highlightEmptyFields();
};

const deleteRow = (index, config) => {
    currentData.splice(index, 1);
    populatePlansTable(currentData, config);
    validateSaveButton();
};

const validateNumberInput = (event) => {
    if (event.target.type === 'number' && event.target.value < 0) {
        event.target.value = 0;
    }
};

const removeErrorStyles = (event) => {
    if (event.target.value.trim() !== '') {
        event.target.style.border = '';
    }
};

const highlightEmptyFields = () => {
    const rows = document.querySelectorAll('#plansTableBody tr');
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.value.trim() === '' || input.value === '0' || input.value === '0.00') {
                input.style.border = '2px solid red';
            }
        });
    });
};
