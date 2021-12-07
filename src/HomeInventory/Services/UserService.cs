using System.Threading.Tasks;
using HomeInventory.Dtos;
using HomeInventory.Dtos.User;
using HomeInventory.Infrastructure;
using HomeInventory.Models;
using HomeInventory.Persistance;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeInventory.Services
{
    public class UserService
    {
        private readonly DataContext _context;
        private readonly TokenService _tokernService;
        private readonly IUserAccessor _userAccessor;

        public UserService(DataContext context, TokenService tokernService, IUserAccessor userAccessor)
        {
            _context = context;
            _tokernService = tokernService;
            _userAccessor = userAccessor;
        }

        public async Task<Result<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.UserName == registerDto.UserName))
            {
                return Result<UserDto>.Failure("Kasutajanimi on kasutuses");
            }

            var user = new User
            {
                Password = Crypto.HashPassword(registerDto.Password),
                UserName = registerDto.UserName,
                UserRole = UserRole.Regular
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Result<UserDto>.Success(new UserDto(user.UserName, false, _tokernService.CreateToken(user)));
        }

        public async Task<Result<UserDto>> Login(UserLoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == loginDto.UserName);

            if (user == null || !Crypto.VerifyHashedPassword(user.Password, loginDto.Password))
            {
                return Result<UserDto>.Failure("Vale kasutajanimi või parool");
            }

            return Result<UserDto>.Success(new UserDto(user.UserName, user.UserRole == UserRole.Admin, _tokernService.CreateToken(user)));
        }

        public async Task<ActionResult<UserDto>> GetUser()
        {
            var user = await _userAccessor.GetUser();

            // Token on juba frontis olemas
            return new UserDto(user.UserName, user.UserRole == UserRole.Admin, null);
        }
    }
}