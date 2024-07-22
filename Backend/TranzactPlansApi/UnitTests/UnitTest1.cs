using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Globalization;
using System.Text.Json;
using TranzactPlansApi.Models;
using Xunit;
using System;
using Microsoft.AspNetCore.Builder;

namespace TranzactPlansApi.Tests
{
    public class PlansControllerTests
    {
        private readonly List<Plans> _plans;

        public PlansControllerTests()
        {
            // Simulate the loading of plans from a JSON file
            var plansJson = @"[{
                ""State"": ""CA"",
                ""Plan"": ""A"",
                ""AgeRange"": [30, 40],
                ""MonthOfBirth"": ""January"",
                ""Carrier"": ""Carrier1"",
                ""Premium"": 100
            }]";
            _plans = JsonSerializer.Deserialize<List<Plans>>(plansJson);
        }

        [Fact]
        public void GetPlans_ShouldReturnAllPlans()
        {
            // Arrange
            var builder = WebApplication.CreateBuilder();
            var app = builder.Build();
            var controller = new PlansController(_plans);

            // Act
            var response = controller.GetPlans();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(response);
            var plans = Assert.IsAssignableFrom<List<Plans>>(okResult.Value);
            Assert.NotNull(plans);
            Assert.Single(plans);
        }

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
    }

    public class PlansController
    {
        private readonly List<Plans> _plans;

        public PlansController(List<Plans> plans)
        {
            _plans = plans;
        }

        public IActionResult GetPlans()
        {
            try
            {
                return new OkObjectResult(_plans);
            }
            catch (Exception ex)
            {
                return new ObjectResult($"Error retrieving plans: {ex.Message}")
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }

        public IActionResult GetPremium(PremiumRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.State) || string.IsNullOrEmpty(request.Plan))
                {
                    return new BadRequestObjectResult("Invalid request");
                }

                var month = request.DateOfBirth.ToString("MMMM", CultureInfo.InvariantCulture);
                var matchingPlans = _plans
                    .Where(p =>
                        (p.State.Contains(request.State) || p.State == "*") &&
                        p.Plan.Contains(request.Plan) &&
                        p.AgeRange[0] <= request.Age &&
                        p.AgeRange[1] >= request.Age &&
                        (p.MonthOfBirth.ToLower() == month.ToLower() || p.MonthOfBirth == "*"))
                    .Select(p => new PremiumResponse { Carrier = p.Carrier, Premium = p.Premium })
                    .ToList();

                if (!matchingPlans.Any())
                {
                    return new OkObjectResult("No matching plans found");
                }

                return new OkObjectResult(matchingPlans);
            }
            catch (Exception ex)
            {
                return new ObjectResult($"Error processing premium request: {ex.Message}")
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
    }
}
