using System.Security.Authentication;
using System.Security.Claims;
using System.Threading.Tasks;
using HomeInventory.Models;
using HomeInventory.Persistance;
using Microsoft.AspNetCore.Http;

namespace HomeInventory.Infrastructure
{
    public interface IUserAccessor
    {
        int GetUserId();
        Task<User> GetUser();
    }

    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _dataContext;

        public UserAccessor(IHttpContextAccessor httpContextAccessor, DataContext dataContext)
        {
            _httpContextAccessor = httpContextAccessor;
            _dataContext = dataContext;
        }

        public int GetUserId()
        {
            var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                throw new AuthenticationException("Kasutaja puudub");
            }

            return int.Parse(userId);
        }

        public async Task<User> GetUser() => await _dataContext.Users.FindAsync(GetUserId());
    }
}
