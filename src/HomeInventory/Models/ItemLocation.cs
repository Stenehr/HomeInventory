using System.Collections.Generic;

namespace HomeInventory.Models
{
    public class ItemLocation : Entity
    {
        public string Name { get; set; }
        public User User { get; set; }
        public ItemLocation ParentLocation { get; set; }
        public ICollection<Item> Items { get; set; }
    }
}
