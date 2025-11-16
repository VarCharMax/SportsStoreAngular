using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServerApp.Models;
using ServerApp.Models.BindingTargets;

namespace ServerApp.Controllers
{
  [Route("api/suppliers")]
  [Authorize(Roles = "Administrator")]
  [AutoValidateAntiforgeryToken]
  [ApiController]
  public class SupplierValuesController(DataContext ctx) : Controller
  {
    [HttpGet]
    [AllowAnonymous]
    public IEnumerable<Supplier> GetSuppliers()
    {
      return ctx.Suppliers;
    }

    [HttpPost]
    public IActionResult CreateSupplier([FromBody]SupplierData sdata)
    {
      Supplier s = sdata.Supplier;
      ctx.Add(s);
      ctx.SaveChanges();
      return Ok(s.SupplierId);
    } 

    [HttpPut("{id}")]
    public IActionResult ReplaceSupplier(long id, [FromBody] SupplierData sdata)
    {
      Supplier s = sdata.Supplier;
      s.SupplierId = id;
      ctx.Update(s);
      ctx.SaveChanges();
      return Ok();
    }

    [HttpDelete("{id}")]
    public void DeleteSupplier(long id)
    {
      ctx.Remove(new Supplier { SupplierId = id });
      ctx.SaveChanges();
    }
  }
}
