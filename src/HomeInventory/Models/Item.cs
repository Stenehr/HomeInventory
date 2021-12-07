namespace HomeInventory.Models
{
    public class Item : Entity
    {
        public string Name { get; set; }
        public string SerialNumber { get; set; }
        public ItemImage Image { get; set; }
        public string Description { get; set; }
        public ItemLocation ItemLocation { get; set; }
        public ItemCondition Condition { get; set; }
        public double? Weight { get; set; }
    }
}
