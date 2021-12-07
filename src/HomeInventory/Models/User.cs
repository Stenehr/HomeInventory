using System.Collections.Generic;

namespace HomeInventory.Models
{
    public class User : Entity
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public UserRole UserRole { get; set; }
        public ICollection<ItemLocation> ItemLocations { get; set; }
    }

    public enum UserRole
    {
        Admin,
        Regular
    }
}
