using FluentValidation;
using HomeInventory.Dtos.Inventory;

namespace HomeInventory.Validators
{
    public class AddItemDtoValidator : AbstractValidator<AddItemDto>
    {
        public AddItemDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.SerialNumber).MaximumLength(100);
            RuleFor(x => x.ItemLocationId).NotEmpty();
        }
    }
}
