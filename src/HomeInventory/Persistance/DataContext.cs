using System.Data;
using HomeInventory.Infrastructure;
using HomeInventory.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeInventory.Persistance
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<ItemLocation> ItemLocations { get; set; }
        public DbSet<ItemCondition> ItemConditions { get; set; }
        public DbSet<Item> Items { get; set; }

        public DataContext(DbContextOptions options) : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasData(new User
                { Id = 1, UserName = "admin", Password = Crypto.HashPassword("admin"), UserRole = UserRole.Admin });

            modelBuilder.Entity<User>()
                .HasMany(x => x.ItemLocations)
                .WithOne(x => x.User)
                .IsRequired();

            modelBuilder.Entity<User>().Property(x => x.UserName).HasMaxLength(50).IsRequired();
            modelBuilder.Entity<User>().Property(x => x.Password).HasMaxLength(100).IsRequired();

            modelBuilder.Entity<Item>().Property(x => x.Name).HasMaxLength(100).IsRequired();
            modelBuilder.Entity<Item>().Property(x => x.SerialNumber).HasMaxLength(100);
            modelBuilder.Entity<Item>().HasOne(x => x.Image);
            modelBuilder.Entity<Item>().HasOne(x => x.ItemLocation).WithMany(x => x.Items).IsRequired();

            modelBuilder.Entity<ItemLocation>().Property(x => x.Name).HasMaxLength(100).IsRequired();
            modelBuilder.Entity<ItemLocation>().HasOne(x => x.ParentLocation).WithMany();


            modelBuilder.Entity<ItemImage>().Property(x => x.FileName).HasMaxLength(100).IsRequired();
            modelBuilder.Entity<ItemImage>().Property(x => x.RandomName).HasMaxLength(100).IsRequired();

            modelBuilder.Entity<ItemCondition>().Property(x => x.Condition).IsRequired().HasMaxLength(100);
            modelBuilder.Entity<ItemCondition>().HasOne(x => x.User).WithMany().IsRequired();
        }
    }
}
