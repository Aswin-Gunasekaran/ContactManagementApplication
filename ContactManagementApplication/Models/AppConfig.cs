namespace ContactManagementApplication.API.Models
{
    public class AppConfig
    {
        public int Expiry { get; set; }
        public int MaxRefreshExpiry { get; set; }

        public string SecurityKey { get; set; }
        public string SchemaName { get; set; }
    }
}
