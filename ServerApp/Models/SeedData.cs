using Microsoft.EntityFrameworkCore;

namespace ServerApp.Models
{
  public class SeedData
  {
     public static void SeedDatabase(DataContext context)
    {
      context.Database.Migrate();

      if (!context.Products.Any())
      {
        var s1 = new Supplier
        {
          Name = "Splash Dudes",
          City = "San Jose",
          State = "CA"
        };

        var s2 = new Supplier
        {
          Name = "Soccer Town",
          City = "Chicago",
          State = "IL"
        };

        var s3 = new Supplier
        {
          Name = "Chess Co",
          City = "New York",
          State = "NY"
        };

        var p1 = new Product
        {
          Name = "Kayak",
          Description = "A boat for one person",
          Category = "Watersports",
          Price = 275,
          Supplier = s1,
          Ratings = []
        };

        p1.Ratings.AddRange(
        [
          new()  { Stars = 4, Product = p1 },
          new() { Stars = 3, Product = p1 }
        ]);

        var p2 = new Product
        {
          Name = "Lifejacket",
          Description = "Protective and fashionable",
          Category = "Watersports",
          Price = 48.95m,
          Supplier = s1,
          Ratings = []
        };

        p2.Ratings.AddRange(
        [
          new() { Stars = 2, Product = p2 },
          new() { Stars = 5, Product = p2 }
        ]);

        var p3 = new Product
        {
          Name = "Soccer Ball",
          Description = "FIFA-approved size and weight",
          Category = "Soccer",
          Price = 19.50m,
          Supplier = s2,
          Ratings = []
        };

        p3.Ratings.AddRange(
        [
          new() { Stars = 1, Product = p3 },
          new() { Stars = 3, Product = p3 }
        ]);

        var p4 = new Product
        {
          Name = "Corner Flags",
          Description = "Give your pitch a professional touch",
          Category = "Soccer",
          Price = 34.95m,
          Supplier = s2,
          Ratings = []
        };

        p4.Ratings.Add(new() { Stars = 3, Product = p4 });

        var p5 = new Product
        {
          Name = "Stadium",
          Description = "Flat-packed 35,000-seat stadium",
          Category = "Soccer",
          Price = 79500,
          Supplier = s2,
          Ratings = []
        };

        p5.Ratings.AddRange(
        [
          new() { Stars = 1, Product = p5 },
          new() { Stars = 4, Product = p5 },
          new() { Stars = 3, Product = p5 }
        ]);

        var p6 = new Product
        {
          Name = "Thinking Cap",
          Description = "Improve brain efficiency by 75%",
          Category = "Chess",
          Price = 16,
          Supplier = s3,
          Ratings = []
        };

        p6.Ratings.AddRange(
        [
          new() { Stars = 5, Product = p6 },
          new() { Stars = 4, Product = p6 }
        ]);

        var p7 = new Product
        {
          Name = "Unsteady Chair",
          Description = "Secretly give your opponent a disadvantage",
          Category = "Chess",
          Price = 29.95m,
          Supplier = s3,
          Ratings = []
        };

        p7.Ratings.Add(new Rating { Stars = 3, Product = p7 });

        var p8 = new Product
        {
          Name = "Human Chess Board",
          Description = "A fun game for the family",
          Category = "Chess",
          Price = 75,
          Supplier = s3,
          Ratings = []
        };

        var p9 = new Product
        {
          Name = "Bling-Bling King",
          Description = "Gold-plated, diamond-studded King",
          Category = "Chess",
          Price = 1200,
          Supplier = s3,
          Ratings = []
        };

        context.Products.AddRange(p1, p2, p3, p4, p5, p6, p7, p8, p9);

        context.SaveChanges();
      }
    }
  }
}
