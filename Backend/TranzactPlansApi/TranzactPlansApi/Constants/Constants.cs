using TranzactPlansApi.Models;

namespace TranzactPlansApi
{
    public static class Constants
    {
        public const string ApiIntroduction = @"
            <html>
            <body>
                <h1>Welcome to the Premium Calculator API!</h1>
                <p>Here are the available endpoints and how to use them:</p>
                <ul>
                    <li><b>GET /</b><br>Returns this introduction to the API.</li>
                    <li><b>GET /GetPlans</b><br>Returns a list of all available plans.<br><i>Example:</i> Fetch all plans by sending a GET request to /GetPlans.</li>
                    <li><b>POST /GetPremium</b><br>Calculates the premium based on the provided request details.<br><i>Request body (JSON):</i><br><pre>{
    ""State"": ""NY"",
    ""Plan"": ""A"",
    ""DateOfBirth"": ""1985-05-10"",
    ""Age"": 39
}</pre><i>Example:</i> Send a POST request with the above body to /GetPremium.</li>
                    <li><b>POST /UpdatePlans</b><br>Updates the list of plans with the provided list.<br><i>Request body (JSON):</i> A list of plan objects.<br><i>Example:</i> Send a POST request with the updated plans to /UpdatePlans.</li>
                </ul>
                <p>For any errors or issues, appropriate error messages will be returned.</p>
            </body>
            </html>
        ";

        public const string ErrorLoadingPlans = "Error loading plans";
        public const string ErrorRetrievingPlans = "Error retrieving plans";
        public const string InvalidRequest = "Invalid request";
        public const string InvalidState = "State cannot be null or empty.";
        public const string InvalidPlan = "Plan cannot be null or empty.";
        public const string InvalidDateOfBirth = "Date of Birth cannot be null or default.";
        public const string InvalidAge = "Age must be a positive number.";
        public const string NoMatchingPlansFound = "No matching plans found";
        public const string PlansUpdatedSuccessfully = "Plans updated successfully";
        public const string ErrorUpdatingPlans = "Error updating plans";
        public const string ErrorProcessingPremiumRequest = "Error processing premium request";
    }
    public static class PremiumRequestValidator
    {
        public static string Validate(PremiumRequest request)
        {
            if (request == null)
            {
                return Constants.InvalidRequest;
            }

            if (string.IsNullOrEmpty(request.State))
            {
                return Constants.InvalidState;
            }

            if (string.IsNullOrEmpty(request.Plan))
            {
                return Constants.InvalidPlan;
            }

            if (request.DateOfBirth == default(DateTime))
            {
                return Constants.InvalidDateOfBirth;
            }

            if (request.Age <= 0)
            {
                return Constants.InvalidAge;
            }

            return null;
        }
    }
}
