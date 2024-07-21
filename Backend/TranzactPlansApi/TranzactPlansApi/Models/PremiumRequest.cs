namespace TranzactPlansApi.Models
{
    public class PremiumRequest
    {
        public DateTime DateOfBirth { get; set; }
        public string State { get; set; }
        public int Age { get; set; }
        public string Plan { get; set; }
    }

    public class PremiumResponse
    {
        public string Carrier { get; set; }
        public decimal Premium { get; set; }
    }
    public class Plans
    {
        public string Carrier { get; set; }
        public string Plan { get; set; }
        public string State { get; set; }
        public string MonthOfBirth { get; set; }
        public int[] AgeRange { get; set; }
        public decimal Premium { get; set; }
    }

}
