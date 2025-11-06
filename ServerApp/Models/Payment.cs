using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerApp.Models
{
  public class Payment
  {
    [BindNever]
    public long PaymentId { get; set; }

    [Required]
    public string CardNumber { get; set; } = string.Empty;
    
    [Required]
    public string CardExpiry { get; set; } = string.Empty;

    [Required]
    public string CardSecurityCode { get; set; } = string.Empty;

    [BindNever]
    [Column(TypeName = "decimal(8, 2)")]
    public decimal Total { get; set; }
    
    [BindNever]
    public string AuthCode { get; set; } = string.Empty;
  }
}
