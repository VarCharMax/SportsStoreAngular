using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace ServerApp.Models
{
  public class Order
  {
    [BindNever]
    public long OrderId { get; set; }
    
    [Required]
    public string Name { get; set; } = String.Empty;

    public IEnumerable<CartLine> Products { get; set; } = [];

    [Required]
    public string Address { get; set; } = String.Empty;
    
    [Required]
    public required Payment Payment { get; set; }
    
    [BindNever]
    public bool Shipped { get; set; } = false;
    
  }
}
