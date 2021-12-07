using FluentValidation;
using HomeInventory.Dtos.User;

namespace HomeInventory.Validators
{
    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.UserName).MinimumLength(4).MaximumLength(100);
            RuleFor(x => x.Password).MinimumLength(4);
        }
    }
}
