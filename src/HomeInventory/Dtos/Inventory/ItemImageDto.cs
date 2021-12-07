namespace HomeInventory.Dtos.Inventory
{
    public record ItemImageDto(
        string Base64Image,
        string MimeType,
        string FileName);
}
