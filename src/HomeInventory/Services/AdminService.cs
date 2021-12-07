using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HomeInventory.Dtos.Admin;
using HomeInventory.Infrastructure;
using HomeInventory.Models;
using HomeInventory.Persistance;
using Microsoft.EntityFrameworkCore;

namespace HomeInventory.Services
{
    public class AdminService
    {
        private readonly DataContext _dataContext;

        public AdminService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IEnumerable<UserTotalItemsDto>> GetTotalItemsStatistics() =>
            await UserBaseQuery()
                .Select(u => new UserTotalItemsDto(u.UserName, u.ItemLocations.SelectMany(il => il.Items).Count()))
                .ToListAsync();

        public async Task<IEnumerable<UserTotalLocationsDto>> GetTotalLocationStatistics() =>
            await _dataContext.Users
                .AsNoTracking()
                .Where(u => u.UserRole == UserRole.Regular)
                .Include(u => u.ItemLocations)
                .Select(u => new UserTotalLocationsDto(u.UserName, u.ItemLocations.Count))
                .ToListAsync();

        public async Task<IEnumerable<UserTotalItemsWeight>> GetTotalItemsWeight() =>
            await UserBaseQuery()
                .Select(u =>
                    new UserTotalItemsWeight(
                        u.UserName,
                        u.ItemLocations.SelectMany(il => il.Items)
                            .Where(i => i.Weight != null)
                            .Sum(i => i.Weight.Value)))
                .ToListAsync();

        public async Task<IEnumerable<UserTotalItemsWithImages>> GetTotalItemsWithImagesCount() =>
            await UserBaseQuery()
                .Select(u =>
                    new UserTotalItemsWithImages(
                        u.UserName,
                        u.ItemLocations.SelectMany(il => il.Items).Count(i => i.Image != null)))
                .ToListAsync();

        private IQueryable<User> UserBaseQuery() =>
            _dataContext.Users
                .AsNoTracking()
                .Where(u => u.UserRole == UserRole.Regular)
                .Include(u => u.ItemLocations)
                .ThenInclude(il => il.Items);
    }
}