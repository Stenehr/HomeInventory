namespace HomeInventory.Dtos.Inventory
{
    public record ItemViewDto(
        int Id,
        string Name,
        string SerialNumber,
        string Description,
        double? Weight,
        ItemImageDto ImageDto,
        ItemConditionDto ItemCondition,
        ItemLocationDto ItemLocation
    );
}
