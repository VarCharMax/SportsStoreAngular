using System.ComponentModel.DataAnnotations;

namespace ServerApp.Models.BindingTargets
{
  public class SupplierData
  {
    [Required]
    public string Name
    {
      get => Supplier.Name;
      set => Supplier.Name = value;
    }

    [Required]
    public string City
    {
      get => Supplier.City;
      set => Supplier.City = value;
    }

    [Required]
    [StringLength(2, MinimumLength = 2)]
    public string State
    {
      get => Supplier.State;
      set => Supplier.State = value;
    }

    public Supplier Supplier { get; set; } = new();
  }
}
