using System.Data;
using FluentValidation;
using HomeInventory.Dtos.Inventory;

namespace HomeInventory.Validators
{
    public class AddItemLocationDtoValidator : AbstractValidator<AddItemLocationDto>
    {
        public AddItemLocationDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        }
    }
}
