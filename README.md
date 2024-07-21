
# Premium Calculator Documentation

## Overview

The Premium Calculator project is a web-based application designed to calculate insurance premiums based on user input. It allows users to enter details such as date of birth, state, age, and plan to determine the premium amount. This project is useful for quickly obtaining premium calculations and making informed decisions.

## Setup

To set up the project on your local machine for development and testing purposes, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/sebstianrodrigo/PremiumCalculatorTranzact.git
   cd https://github.com/sebstianrodrigo/PremiumCalculatorTranzact.git
   ```

2. **Run the Backend Service:**
   The backend is built using C# and .NET Minimal API. Open the backend project in your preferred C# IDE (e.g., Visual Studio), and run the project to start the local server.

3. **Start the Frontend:**
   Use VSCode or an HTTP server to simulate the frontend. Open the `index.html` file in your web browser to launch the frontend interface. Ensure you are serving the frontend files through a local server (e.g., Live Server extension in VSCode) to avoid CORS issues.

## Usage

To use the Premium Calculator, follow these steps:

1. **Enter Details:**
   - Date of Birth: Select your date of birth.
   - State: Choose your state from the dropdown. The dropdown includes all 50 states of the USA.
   - Age: The age will be auto-populated based on the date of birth.
   - Plan: Select the desired plan from the dropdown.

2. **Calculate Premium:**
   - Click the "Get Premium" button to calculate the premium.
   - The results will be displayed, showing the carrier, premium, annual, and monthly amounts. There is also a period field to select the payment frequency.

     Example:
     If the URL/webservice returns 300.0 and the selected frequency is quarterly, that means that 300.0 will be paid every 3 months.
     Expected results:
     - Monthly = 100.0 (300.0 / 3)
     - Annually = 1200.0 (300.0 * 4)

3. **Edit Plans:**
   - Click the "Edit Plans" button to view and edit existing plans.
   - You can add new plans, edit existing ones, and save changes. To save all the rows, you need to click the 'Save' button for each row individually, and then click the 'Save Changes' button to save all the changes to the backend.

## API Documentation

The application interacts with the backend service through various API endpoints. Below are the details of each endpoint and how to call them:

### Get Plans

- **Endpoint:** `http://localhost:7014/GetPlans`
- **Method:** `GET`
- **Description:** Fetches all available plans.
- **Response:** JSON array of plan objects.

Example:
```javascript
fetch('http://localhost:7014/GetPlans')
    .then(response => response.json())
    .then(data => console.log(data));
```

### Get Premium

- **Endpoint:** `http://localhost:7014/GetPremium`
- **Method:** `POST`
- **Description:** Calculates the premium based on the provided input data.
- **Request Body:** JSON object with `dateOfBirth`, `state`, `age`, and `plan`.
- **Response:** JSON object with premium details.

Example:
```javascript
fetch('http://localhost:7014/GetPremium', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        dateOfBirth: '1990-01-01',
        state: 'NY',
        age: 30,
        plan: 'A'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Update Plans

- **Endpoint:** `http://localhost:7014/UpdatePlans`
- **Method:** `POST`
- **Description:** Updates the plans with new data.
- **Request Body:** JSON array of plan objects.
- **Response:** JSON object with update status.

Example:
```javascript
fetch('http://localhost:7014/UpdatePlans', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(plansData)
})
.then(response => response.json())
.then(data => console.log(data));
```

## Files Description

### index.html
The main HTML file for the Premium Calculator interface.

### plansView.html
HTML file for viewing and editing plans.

### styles.css
Contains the CSS styles for the application.

### planService.js
JavaScript file that interacts with the backend API for fetching and updating plans.

### mainController.js
JavaScript file that controls the main functionality of the Premium Calculator.

### plansViewController.js
JavaScript file that controls the functionality for viewing and editing plans.

### config.json
Configuration file containing plan options, states, and other settings.

### constants.json
Contains constant values used throughout the application.

### Program.cs
C# file for the backend service.

## Instructions for Testing

### Unit Testing
Ensure you have unit tests written for the backend API methods. You can use a testing framework like NUnit or MSTest for C#.

### Frontend Testing
Use JavaScript testing frameworks like Jest or Mocha for testing frontend functionalities.

### Manual Testing
- Verify that the premium calculation works correctly based on the input values.
- Ensure that all form fields are validated correctly.
- Test the functionality of adding, editing, and saving plans.
