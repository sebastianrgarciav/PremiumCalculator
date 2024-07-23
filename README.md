
# Tranzact Premium Calculator Documentation

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
   The backend is built using C# and .NET 6 Minimal API. Open the backend project in your preferred C# IDE (e.g., Visual Studio), and run the project to start the local server.

3. **Start the Frontend:**
   Use VSCode or an HTTP server to simulate the frontend. Open the `index.html` file in your web browser to launch the frontend interface. Ensure you are serving the frontend files through a local server (e.g., Live Server extension in VSCode) to avoid CORS issues.

## Usage

To use the Premium Calculator, follow these steps:

1. **Enter Details:**
   - Date of Birth: Select your date of birth. (The year cannot be in the future, and the person cannot be older than 120 years.)
   - State: Choose your state from the dropdown. The dropdown includes all 50 states of the USA. You can type the first letter to search for a state.
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

The application interacts with the backend service through various API endpoints, which are served at `http://localhost:7014`. Below are the details of each endpoint and how to call them:

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
### Deploy 

The application is deployed using free hosting services for both the backend and the frontend.

#### Frontend Deployment

- **URL:** `https://tranzactapp-calculator-premium.netlify.app/`
- **Hosting Service:** Netlify
  - **Description:** Netlify is a popular platform for deploying static websites and frontend applications. It offers a free tier with features such as continuous deployment from a Git repository, custom domains, HTTPS, and a global CDN. Netlify is known for its ease of use, allowing developers to quickly deploy and manage their frontend applications with minimal configuration. It's an excellent choice for React, Vue, Angular, and static site deployments.

#### Backend Deployment

- **URL:** `https://www.tranzactplansapi.somee.com/`
- **Hosting Service:** Somee.com
  - **Description:** Somee.com offers free ASP.NET hosting, which is ideal for deploying .NET applications. The service provides support for SQL databases, a custom domain, and a user-friendly control panel to manage the deployment. It's a good choice for small to medium-sized projects looking for a cost-effective solution for hosting their backend services.

### Deployment Steps

1. **Backend Deployment on Somee.com:**
   - **Create an Account:** Sign up for a free account on Somee.com.
   - **Create a New Site:** Use the control panel to create a new site for your backend application.
   - **Deploy the Application:** Upload your .NET application files via FTP or use the web-based file manager provided by Somee.com.

2. **Frontend Deployment on Netlify:**
   - **Create an Account:** Sign up for a free account on Netlify.
   - **Connect Your Repository:** Link your Git repository (GitHub, GitLab, or Bitbucket) to Netlify for continuous deployment.
   - **Build and Deploy:** Configure the build settings (e.g., build command, publish directory) and deploy your frontend application. Netlify will automatically build and deploy your site whenever you push changes to the linked repository.
   - **Custom Domain:** Set up a custom domain if desired, and configure DNS settings as instructed by Netlify.

By using these free hosting services, you can effectively deploy and manage your full-stack application without incurring hosting costs. This setup is ideal for development, testing, and small-scale production environments.

### Unit Testing

Ensure you have unit tests written for the backend API methods. You can use a testing framework like xUnit for C#.

#### Example Unit Testing for the Backend

Below is an example of how to write unit tests for the backend API methods using xUnit.

#### Unit Tests for `PlansController`

1. **GetPlans_ShouldReturnAllPlans**
   - **Description:** Verifies that the `/GetPlans` endpoint returns all available plans.
   - **Test Example:**
     ```csharp
     [Fact]
     public void GetPlans_ShouldReturnAllPlans()
     {
         // Arrange
         var controller = new PlansController(_plans);

         // Act
         var response = controller.GetPlans();

         // Assert
         var okResult = Assert.IsType<OkObjectResult>(response);
         var plans = Assert.IsAssignableFrom<List<Plans>>(okResult.Value);
         Assert.NotNull(plans);
         Assert.Single(plans);
     }
     ```

2. **GetPremium_ShouldReturnBadRequest_WhenRequestIsInvalid**
   - **Description:** Verifies that the `/GetPremium` endpoint returns a `BadRequest` when the request is invalid.
   - **Test Example:**
     ```csharp
     [Fact]
     public void GetPremium_ShouldReturnBadRequest_WhenRequestIsInvalid()
     {
         // Arrange
         var controller = new PlansController(_plans);
         var request = new PremiumRequest
         {
             State = "",
             Plan = "",
             Age = 35,
             DateOfBirth = DateTime.Now
         };

         // Act
         var response = controller.GetPremium(request);

         // Assert
         var badRequestResult = Assert.IsType<BadRequestObjectResult>(response);
         Assert.Equal("Invalid request", badRequestResult.Value);
     }
     ```

3. **GetPremium_ShouldReturnMatchingPlans_WhenRequestIsValid**
   - **Description:** Verifies that the `/GetPremium` endpoint returns matching plans when the request is valid.
   - **Test Example:**
     ```csharp
     [Fact]
     public void GetPremium_ShouldReturnMatchingPlans_WhenRequestIsValid()
     {
         // Arrange
         var controller = new PlansController(_plans);
         var request = new PremiumRequest
         {
             State = "CA",
             Plan = "A",
             Age = 35,
             DateOfBirth = new DateTime(1985, 1, 1)
         };

         // Act
         var response = controller.GetPremium(request);

         // Assert
         var okResult = Assert.IsType<OkObjectResult>(response);
         var matchingPlans = Assert.IsAssignableFrom<List<PremiumResponse>>(okResult.Value);
         Assert.NotNull(matchingPlans);
         Assert.Single(matchingPlans);
     }
     ```

4. **GetPremium_ShouldReturnNoMatchingPlans_WhenNoPlansFound**
   - **Description:** Verifies that the `/GetPremium` endpoint returns "No matching plans found" when no plans match the request.
   - **Test Example:**
     ```csharp
     [Fact]
     public void GetPremium_ShouldReturnNoMatchingPlans_WhenNoPlansFound()
     {
         // Arrange
         var controller = new PlansController(_plans);
         var request = new PremiumRequest
         {
             State = "NY",
             Plan = "B",
             Age = 35,
             DateOfBirth = new DateTime(1985, 1, 1)
         };

         // Act
         var response = controller.GetPremium(request);

         // Assert
         var okResult = Assert.IsType<OkObjectResult>(response);
         var result = Assert.IsAssignableFrom<string>(okResult.Value);
         Assert.Equal("No matching plans found", result);
     }
     ```
     
### Manual Testing

- Verify that the premium calculation works correctly based on the input values.
- Ensure that all form fields are validated correctly.
- Test the functionality of adding, editing, and saving plans.

## Requirements Checklist

### Backend Development
- Use any backend language (desired: C#). [✅]
- Avoid using MVC template; a simple project with a well-defined API is sufficient. [✅]
- Must receive parameters: Date of Birth, State, Age, and Plan. [✅]
- Provide a premium based on a given table, supporting a substantial number of conditions. [✅]
- Data should not be hardcoded and should be easily changeable by the end user. [✅]
- Validate that Age and Date of Birth match. [✅]
- API result should be in JSON format. [✅]

### Frontend Development
- Use vanilla JavaScript and jQuery (no other external libraries/frameworks). [✅]
- Build a web page that consumes the created web service. [✅]
- Display the result in a textbox, alongside a dropdown for frequencies (Monthly, Quarterly, Semi-Annually, Annually). [✅]
- Calculate and display values for Annual and Monthly based on the dropdown selection. [✅]
- Age control should be auto-populated based on Date of Birth. [✅]

### Documentation
- Include a README file with: [✅]
  - Overview of the project. [✅]
  - Setup instructions. [✅]
  - Usage guide. [✅]
  - API documentation. [✅]

### Plus Points
1. **JavaScript:**
   - Use ES6 features. [✅]
   - Validate fields before calculation. [✅]
   - Disable controls if value has not been retrieved. [✅]
   - Validate only numeric entries on fields. [✅]
   - Handle all exceptions when calculating values. [✅]
     
2. **Deployment:**
   - Deployed the application using free hosting services for both backend and frontend. [✅]
     
3. **General:**
   - Include unit testing. [✅]


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

