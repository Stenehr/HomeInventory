using FluentValidation;
using HomeInventory.Dtos.Inventory;

namespace HomeInventory.Validators
{
    public class AddItemConditionDtoValidator : AbstractValidator<AddItemConditionDto>
    {
        public AddItemConditionDtoValidator()
        {
            RuleFor(x => x.Condition).NotEmpty();
        }
    }
}
