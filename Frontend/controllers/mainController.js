let CONSTANTS = {};
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('configuration/constants.json');
        CONSTANTS = await response.json();

        fetch('configuration/config.json')
            .then(response => response.json())
            .then(data => {
                try {
                    document.getElementById('dateOfBirth').value = '';
                    populateSelect('state', data.states);
                    populateSelect('plan', data.plans);
                    populateSelect('period', data.periodOptions);
                } catch (error) {
                    console.error(CONSTANTS.ERROR.POPULATE_SELECT, error);
                }
            })
            .catch(error => {
                console.error(CONSTANTS.ERROR.FETCH_CONFIG, error);
            });

        document.getElementById('premiumForm').addEventListener('submit', (event) => {
            event.preventDefault();
            try {
                getPremiumData();
            } catch (error) {
                console.error(CONSTANTS.ERROR.FORM_SUBMISSION, error);
            }
        });

        try {
            document.getElementById('dateOfBirth').addEventListener('change', updateAgeAndValidate);
            document.getElementById('state').addEventListener('change', validateForm);
            document.getElementById('plan').addEventListener('change', validateForm);
            document.querySelector('.view-plans-button').addEventListener('click', () => {
                window.location.assign('views/plansView.html');
            });
        } catch (error) {
            console.error(CONSTANTS.ERROR.EVENT_LISTENER, error);
        }
    } catch (error) {
        console.error('Error loading constants:', error);
    }
});

const populateSelect = (elementId, options) => {
    try {
        const selectElement = document.getElementById(elementId);
        if (selectElement) {
            selectElement.innerHTML = '';
            for (const [value, text] of Object.entries(options)) {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = text;
                selectElement.appendChild(option);
            }
        } else {
            console.error(`Element with id ${elementId} not found.`);
        }
    } catch (error) {
        console.error(CONSTANTS.ERROR.POPULATE_SELECT, error);
    }
}

const updateAgeAndValidate = () => {
    try {
        const dob = new Date(document.getElementById('dateOfBirth').value);
        const today = new Date();
        const dobError = document.getElementById('dobError');

        if (dob > today) {
            dobError.style.display = 'block';
            document.getElementById('age').value = '';
            validateForm();
            return;
        } else {
            dobError.style.display = 'none';
        }

        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        document.getElementById('age').value = age;
        validateForm();
    } catch (error) {
        console.error(CONSTANTS.ERROR.UPDATE_TABLE, error);
    }
}

const validateForm = () => {
    try {
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const state = document.getElementById('state').value;
        const age = document.getElementById('age').value;
        const plan = document.getElementById('plan').value;
        const isValid = dateOfBirth && state && age && plan;
        document.querySelector('button[type="submit"]').disabled = !isValid;
    } catch (error) {
        console.error(CONSTANTS.ERROR.POPULATE_SELECT, error);
    }
}

const getPremiumData = async () => {
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const state = document.getElementById('state').value;
    const age = document.getElementById('age').value;
    const plan = document.getElementById('plan').value;

    const requestData = {
        dateOfBirth,
        state,
        age,
        plan
    };

    try {
        const data = await getPremium(requestData);
        populateResultsTable(data);
    } catch (error) {
        Swal.fire({
            title: 'Warning',
            text: CONSTANTS.ERROR.FETCH_PREMIUM,
            icon: 'info',
            confirmButtonText: 'OK'
        });
        console.error(CONSTANTS.ERROR.FETCH_PREMIUM, error);
    } finally {
        submitButton.disabled = false;
    }
};

const populateResultsTable = (data) => {
    try {
        const resultsContainer = document.getElementById('resultsContainer');
        const periodSelect = document.getElementById('period');

        periodSelect.addEventListener('change', () => {
            updateTable(data, periodSelect.value);
        });

        updateTable(data, periodSelect.value);
        resultsContainer.style.display = 'block';
    } catch (error) {
        console.error(CONSTANTS.ERROR.POPULATE_TABLE, error);
    }
}

const updateTable = (data, period) => {
    try {
        const resultsTableBody = document.getElementById('resultsTableBody');
        resultsTableBody.innerHTML = '';

        if (data === "No matching plans found") {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 4;
            cell.textContent = 'No matching plans found';
            row.appendChild(cell);
            resultsTableBody.appendChild(row);
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');

            const carrierCell = document.createElement('td');
            carrierCell.textContent = item.carrier;
            row.appendChild(carrierCell);

            const premiumCell = document.createElement('td');
            premiumCell.textContent = item.premium;
            row.appendChild(premiumCell);

            let frequenciesValue;
            switch (period) {
                case 'monthly':
                    frequenciesValue = 1;
                    break;
                case 'quarterly':
                    frequenciesValue = 3;
                    break;
                case 'semiannually':
                    frequenciesValue = 6;
                    break;
                case 'annually':
                    frequenciesValue = 12;
                    break;
                default:
                    frequenciesValue = 1;
            }

            const annualCell = document.createElement('td');
            annualCell.textContent = (item.premium * (12 / frequenciesValue)).toFixed(2);
            row.appendChild(annualCell);

            const monthlyCell = document.createElement('td');
            monthlyCell.textContent = (parseFloat(item.premium) / frequenciesValue).toFixed(2);;
            row.appendChild(monthlyCell);

            resultsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error(CONSTANTS.ERROR.UPDATE_TABLE, error);
    }
}
