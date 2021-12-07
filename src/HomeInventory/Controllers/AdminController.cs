using System.Collections.Generic;
using System.Threading.Tasks;
using HomeInventory.Dtos.Admin;
using HomeInventory.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeInventory.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize(Policy = "IsAdmin")]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;

        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("statistics/user-total-items")]
        public async Task<ActionResult<IEnumerable<UserTotalItemsDto>>> GetTotalItemStatistics() =>
            Ok(await _adminService.GetTotalItemsStatistics());

        [HttpGet("statistics/user-total-added-locations")]
        public async Task<ActionResult<IEnumerable<UserTotalLocationsDto>>> GetTotalLocationStatistics() =>
            Ok(await _adminService.GetTotalLocationStatistics());

        [HttpGet("statistics/user-total-items-weight")]
        public async Task<ActionResult<IEnumerable<UserTotalItemsWeight>>> GetTotalItemsWeight() =>
            Ok(await _adminService.GetTotalItemsWeight());

        [HttpGet("statistics/user-total-items-with-images-count")]
        public async Task<ActionResult<IEnumerable<UserTotalItemsWithImages>>> GetTotalItemsWithImagesCount() =>
            Ok(await _adminService.GetTotalItemsWithImagesCount());
    }
}
