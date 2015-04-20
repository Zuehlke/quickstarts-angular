using System.Web.Http;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(Product.WebApiConfig), "Register")]

namespace Product
{
    public static class WebApiConfig
    {
        public static void Register()
        {
            GlobalConfiguration.Configuration.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
