using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Text.Json;
using TranzactPlansApi.Models;
using TranzactPlansApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseCors();

string plansFilePath = Path.Combine(AppContext.BaseDirectory, "Resources", "plans.json");
List<Plans> plans = new List<Plans>();

try
{
    string plansJson = File.ReadAllText(plansFilePath);
    plans = JsonSerializer.Deserialize<List<Plans>>(plansJson);
}
catch (Exception ex)
{
    Console.Error.WriteLine($"{Constants.ErrorLoadingPlans}: {ex.Message}");
}

app.MapGet("/", () =>
{
    try
    {
        return Results.Content(Constants.ApiIntroduction, "text/html");
    }
    catch (Exception ex)
    {
        return Results.Problem($"{Constants.ErrorRetrievingPlans}: {ex.Message}");
    }
});


app.MapGet("/GetPlans", () =>
{
    try
    {
        return Results.Ok(plans);
    }
    catch (Exception ex)
    {
        return Results.Problem($"{Constants.ErrorRetrievingPlans}: {ex.Message}");
    }
});

app.MapPost("/GetPremium", (PremiumRequest request) =>
{
    try
    {
        string validationError = PremiumRequestValidator.Validate(request);
        if (validationError != null)
        {
            return Results.BadRequest(validationError);
        }

        string month = request.DateOfBirth.ToString("MMMM", CultureInfo.InvariantCulture);
        List<PremiumResponse>? matchingPlans = plans?
            .Where(p =>
                (p.State.Contains(request.State) || p.State == "*") &&
                p.Plan.Contains(request.Plan) &&
                p.AgeRange[0] <= request.Age &&
                p.AgeRange[1] >= request.Age &&
                (p.MonthOfBirth.ToLower() == month.ToLower() || p.MonthOfBirth == "*"))
            .Select(x => new PremiumResponse { Carrier = x.Carrier, Premium = x.Premium })
            .ToList();

        if (matchingPlans != null && !matchingPlans.Any())
        {
            return Results.Ok(Constants.NoMatchingPlansFound);
        }

        return Results.Ok(matchingPlans);
    }
    catch (Exception ex)
    {
        return Results.Problem($"{Constants.ErrorProcessingPremiumRequest}: {ex.Message}");
    }
});

app.MapPost("/UpdatePlans", async ([FromBody] List<Plans> updatedPlans) =>
{
    try
    {
        var updatedPlansJson = JsonSerializer.Serialize(updatedPlans, new JsonSerializerOptions { WriteIndented = true });
        await File.WriteAllTextAsync(plansFilePath, updatedPlansJson);
        plans = updatedPlans;
        return Results.Ok(Constants.PlansUpdatedSuccessfully);
    }
    catch (Exception ex)
    {
        return Results.Problem($"{Constants.ErrorUpdatingPlans}: {ex.Message}");
    }
});

app.Run("https://localhost:7014");
