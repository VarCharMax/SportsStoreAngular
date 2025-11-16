using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerApp.Models;
using ServerApp.Models.BindingTargets;

namespace ServerApp.Controllers
{
  [Route("api/products")]
  [ApiController]
  [Authorize(Roles = "Administrator")]
  [AutoValidateAntiforgeryToken]
  public class ProductValuesController(DataContext ctx) : ControllerBase
  {
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<Product>> GetProduct(long id)
    {
      var result = await ctx.Products
        .Include(p => p.Supplier)
        .ThenInclude(s => s!.Products!) // Suppress possible null warning
        .Include(p => p.Ratings)
        .FirstOrDefaultAsync(p => p.ProductId == id);

      if (result != null)
      {
        if (result.Supplier != null && result.Supplier.Products != null)
        {
          result.Supplier.Products =
            [.. result.Supplier.Products.Select(p =>
              new Product { ProductId = p.ProductId, Name = p.Name, Category = p.Category, Description = p.Description, Price = p.Price })];
        }

        return new JsonResult(result);
      }
      else
      {
        return NotFound();
      }
    }

    [HttpGet]
    [AllowAnonymous]
    public ActionResult<IEnumerable<Product>> GetProducts(string category = "", string search = "", bool related = false, bool metadata = false)
    {
      IQueryable<Product> query = ctx.Products;

      if (!string.IsNullOrWhiteSpace(category))
      {
        string catLower = category.ToLower();
        query = query.Where(p => p.Category.ToLower().Contains(catLower));
      }

      if (!string.IsNullOrWhiteSpace(search))
      {
        string searchLower = search.ToLower();
        query = query.Where(p => p.Name.ToLower().Contains(searchLower) ||
          p.Description.ToLower().Contains(searchLower));
      }

      if (related)
      {
        query = query.Include(p => p.Supplier).Include(p => p.Ratings);
        List<Product> data = [.. query];

        data.ForEach(p => {
          if (p.Supplier != null)
          {
            p.Supplier.Products = null;
          }
        });

        return metadata ? CreateMetadata(data) : Ok(data);

      }
      else
      {
        return metadata ? CreateMetadata(query) : Ok(query);
      }
    }

    [HttpPost]
    public ActionResult<long> CreateProduct([FromBody] ProductData pdata)
    { 
      Product p = pdata.Product;
      if (pdata.SupplierId.HasValue && pdata.SupplierId.Value != 0)
      {
        Supplier s = new() { SupplierId = pdata.SupplierId.Value };
        p.Supplier = s;

        ctx.Attach(p.Supplier);
      } 
        
      ctx.Add(p);
      ctx.SaveChanges();

      return Ok(p.ProductId);
    }

    [HttpPut("{id}")]
    public ActionResult<bool> ReplaceProduct(long id, [FromBody] ProductData pdata)
    {
        Product p = pdata.Product;
        p.ProductId = id;
        if (p.Supplier != null && p.Supplier.SupplierId != 0)
        {
          ctx.Attach(p.Supplier);
        } 
        
        ctx.Update(p);
        ctx.SaveChanges();
        
        return Ok(true);
    }

    [HttpPatch("{id}")]
    public ActionResult<bool> UpdateProduct(long id, [FromBody] JsonPatchDocument<ProductData> patch)
    {
      Product product = ctx.Products.Include(p => p.Supplier).First(p => p.ProductId == id);
      ProductData pdata = new() { Product = product };

      patch.ApplyTo(pdata, ModelState);
      
      if (ModelState.IsValid && TryValidateModel(pdata))
      {
        if (product.Supplier != null && product.Supplier.SupplierId != 0)
        {
          ctx.Attach(product.Supplier);
        }
        
        ctx.SaveChanges();
        
        return Ok(true);
      }
      else
      { 
        return BadRequest(ModelState);
      }
    }

    [HttpDelete("{id}")]
    public ActionResult<bool> DeleteProduct(long id){
      bool result = true;
      try
      {
        ctx.Products.Remove(new Product { ProductId = id });
        ctx.SaveChanges();
      }
      catch (Exception)
      {
        result = false;
      }

      return Ok(result);
    }

    private OkObjectResult CreateMetadata(IEnumerable<Product> products)
    {
      //Return all products along with a list of associated categories.
      return Ok(new
      {
        data = products,
        categories = ctx.Products.Select(p => p.Category).Distinct().OrderBy(c => c)
      }
      );
    }
  }
}

