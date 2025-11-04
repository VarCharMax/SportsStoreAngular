using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerApp.Models;
using ServerApp.Models.BindingTargets;

namespace ServerApp.Controllers
{
  [Route("api/products")]
  [ApiController]
  public class ProductValuesController : ControllerBase
  {
    private DataContext context;

    public ProductValuesController(DataContext ctx)
    {
      context = ctx;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(long id)
    {
      var result = await context.Products
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
    public ActionResult<IEnumerable<Product>> GetProducts(string category = "", string search = "", bool related = false)
    {
      IQueryable<Product> query = context.Products;

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

        var dataList = data.ToList();

        return new JsonResult(dataList);
      }
      else
      {
        var queryList = query.ToList();
        return new JsonResult(queryList);
      }
    }

    [HttpPost]
    public IActionResult CreateProduct([FromBody] ProductData pdata)
    { 
      if (ModelState.IsValid)
      {
        Product p = pdata.Product;
        if (pdata.SupplierId.HasValue && pdata.SupplierId.Value != 0)
        {
          Supplier s = new() { SupplierId = pdata.SupplierId.Value };
          p.Supplier = s;

          context.Attach(p.Supplier);
        } 
        
        context.Add(p);
        context.SaveChanges();

        return Ok(p.ProductId);
      } 
      else
      {
        return BadRequest(ModelState);
      }
    }

    [HttpPut("{id}")]
    public IActionResult ReplaceProduct(long id, [FromBody] ProductData pdata)
    {
      if (ModelState.IsValid)
      {
        Product p = pdata.Product;
        p.ProductId = id;
        if (p.Supplier != null && p.Supplier.SupplierId != 0)
        {
          context.Attach(p.Supplier);
        } 
        
        context.Update(p);
        context.SaveChanges();
        
        return Ok();
      }
      else
      { 
        return BadRequest(ModelState);
      }
    }

    [HttpPatch("{id}")]
    public IActionResult UpdateProduct(long id, [FromBody] JsonPatchDocument<ProductData> patch)
    {
      Product product = context.Products.Include(p => p.Supplier).First(p => p.ProductId == id);
      ProductData pdata = new() { Product = product };

      patch.ApplyTo(pdata, ModelState);
      
      if (ModelState.IsValid && TryValidateModel(pdata))
      {
        if (product.Supplier != null && product.Supplier.SupplierId != 0)
        {
          context.Attach(product.Supplier);
        }
        
        context.SaveChanges();
        
        return Ok();
      }
      else
      { 
        return BadRequest(ModelState);
      }
    }

    [HttpDelete("{id}")]
    public void DeleteProduct(long id){
      context.Products.Remove(new Product { ProductId = id });
      context.SaveChanges();
    }
  }
}

