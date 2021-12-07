namespace HomeInventory.Models
{
    public class ItemCondition : Entity
    {
        public string Condition { get; set; }
        public User User { get; set; }
    }
}
