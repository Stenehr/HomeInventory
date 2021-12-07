using FluentValidation;
using HomeInventory.Dtos.User;

namespace HomeInventory.Validators
{
    public class UserLoginDtoValidator : AbstractValidator<UserLoginDto>
    {
        public UserLoginDtoValidator()
        {
            RuleFor(x => x.UserName).MinimumLength(4);
            RuleFor(x => x.Password).MinimumLength(4);
        }
    }
}
