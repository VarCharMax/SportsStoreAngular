using Microsoft.EntityFrameworkCore;

namespace ServerApp.Models
{
  public class DataContext(DbContextOptions<DataContext> opts) : DbContext(opts)
  {
    public DbSet<Product> Products { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<Rating> Ratings { get; set; }
  }
}
