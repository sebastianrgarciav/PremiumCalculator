const API_BASE_URL = 'http://localhost:7014';

const getPlans = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/GetPlans`);
        if (!response.ok) {
            throw new Error(CONSTANTS.ERROR.FETCH_PLANS_CONFIG);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(CONSTANTS.ERROR.FETCH_PLANS_CONFIG, error);
        throw error;
    }
};

const getPremium = async (requestData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/GetPremium`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        if (!response.ok) {
            throw new Error(CONSTANTS.ERROR.FETCH_PREMIUM);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(CONSTANTS.ERROR.FETCH_PREMIUM, error);
        throw error;
    }
};

const updatePlans = async (plansData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/UpdatePlans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(plansData)
        });
        if (!response.ok) {
            throw new Error(CONSTANTS.ERROR.SAVE_CHANGES);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(CONSTANTS.ERROR.SAVE_CHANGES, error);
        throw error;
    }
};
