using System.Web.Http;

namespace Product.Backend.Controllers
{
    public class DefaultController : ApiController
    {
        [HttpGet]
        public string Greeting()
        {
            return "Welcome to the Zuehlke Angular project template for Visual Studio using Grunt";
        }
    }
}
