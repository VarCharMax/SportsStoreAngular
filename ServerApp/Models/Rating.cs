using System.ComponentModel.DataAnnotations;

namespace ServerApp.Models
{
  public class Rating
  {
    [Key]
    public long RatingID { get; set; }

    public int Stars { get; set; }

    public Product? Product { get; set; } = null;
  }
}
