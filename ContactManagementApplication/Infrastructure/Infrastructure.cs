using ContactManagementApplication.API.Repository;

namespace ContactManagementApplication.API.Infrastructure
{
    public static class Infrastructure
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddScoped<IContactRepository, ContactRepository>();
        }
    }
}
