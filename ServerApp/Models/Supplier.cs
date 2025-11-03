using System.ComponentModel.DataAnnotations;

namespace ServerApp.Models
{
  public class Supplier
  {
    [Key]
    public long SupplierId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public IList<Product>? Products { get; set; }
  }
}
