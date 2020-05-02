using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security;
using System.Security.Claims;
using DatingApp.API.Data;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace DatingApp.API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var reslutContext= await next();
            var userId = int.Parse(reslutContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var _repo = reslutContext.HttpContext.RequestServices.GetService<IDatingRepository>();
            var user =await _repo.GetUser(userId, true);
            user.LastActive = DateTime.Now;
            await _repo.SaveAll();
        }
    }
}