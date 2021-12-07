using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HomeInventory.Models;
using HomeInventory.Persistance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace HomeInventory.Infrastructure
{
    public class IsAdminRequirement : IAuthorizationRequirement
    { }

    public class IsAdminRequirementHandler : AuthorizationHandler<IsAdminRequirement>
    {
        private readonly DataContext _dataContext;

        public IsAdminRequirementHandler(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsAdminRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Task.CompletedTask;
            }

            var user = _dataContext.Users.Find(int.Parse(userId));
            if (user == null)
            {
                return Task.CompletedTask;
            }

            if (user.UserRole == UserRole.Admin)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
