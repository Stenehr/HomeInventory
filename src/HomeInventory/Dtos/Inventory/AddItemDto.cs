using Microsoft.AspNetCore.Http;

namespace HomeInventory.Dtos.Inventory
{
    public class AddItemDto
    {
        public string Name { get; init; }
        public string SerialNumber { get; init; }
        public IFormFile Image { get; set; }
        public bool RemoveImage { get; set; }
        public string Description { get; init; }
        public int ItemLocationId { get; init; }
        public int? ItemConditionId { get; init; }
        public double? Weight { get; set; }
    }
}
