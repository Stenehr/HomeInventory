using System.Threading.Tasks;
using HomeInventory.Dtos;
using HomeInventory.Dtos.User;
using HomeInventory.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeInventory.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserService _userService;

        public AccountController(UserService userService)
        {
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(UserLoginDto loginDto) =>
            HandleResult(await _userService.Login(loginDto));

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto) =>
            HandleResult(await _userService.Register(registerDto));

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetUser() =>
            await _userService.GetUser();

        private ActionResult<UserDto> HandleResult(Result<UserDto> result)
        {
            return result.IsSuccess ? Ok(result.Value) : Unauthorized(result.Error);
        }
    }
}
