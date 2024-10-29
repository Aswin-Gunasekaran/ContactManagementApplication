using Newtonsoft.Json;

namespace ContactManagementApplication.API.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            string errorMessage = string.Empty;
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 500;
                errorMessage = $"Message : {ex.Message} , InnerException : {ex.InnerException}"; 
                string sessionMessage = "Exception Message: Session  expired ";
                string generalMessage = $"Middleware. exception encountered, {sessionMessage} Exception message: {ex.Message}, Inner exception: {ex.InnerException?.Message ?? ""} , Stacktrace: {ex.StackTrace ?? ""}";
                var message = Environment.NewLine + "Uri : " + context?.Request.Path.ToString() +
                          Environment.NewLine + "Method : " + context?.Request.Method +
                          Environment.NewLine + "Controller : " + context?.Request.RouteValues["controller"]?.ToString() +
                          Environment.NewLine + "Action : " + context?.Request.RouteValues["action"]?.ToString() +
                          Environment.NewLine + generalMessage + Environment.NewLine + Environment.NewLine;
                _logger.LogError(message);
            }
            finally
            {

                switch (context.Response.StatusCode)
                {
                    case 401:
                        var userEmail = context.Request.Headers.FirstOrDefault(item => item.Key == "email").Value;
                        _logger.LogError("Middleware 401 unauthorized URL: {url}, User email: {userEmail}", context.Request.Path, userEmail);
                        break;

                    case 500:
                        if (!context.Response.HasStarted)
                        {
                            context.Response.ContentType = "application/json";
                            var response = new { StatusText = "Internal server error.", Error = errorMessage };
                            _logger.LogError(errorMessage);
                            var json = JsonConvert.SerializeObject(response);
                            await context.Response.WriteAsync(json);
                        }
                        break;

                    case 404:
                        var requestedPath = context.Request.Path.Value;
                        _logger.LogError("Middleware 404 Not Found URL: {url}", requestedPath);

                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(new
                        {
                            StatusCode = 404,
                            Message = "The resource you are looking for was not found.",
                            RequestedUrl = requestedPath
                        }));
                        break;

                    default:
                        // Handle other status codes if needed
                        break;
                }
            }
        }
    }
}
