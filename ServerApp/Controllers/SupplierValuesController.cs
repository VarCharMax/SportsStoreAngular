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
  public class SupplierValuesController : Controller
  {
    private DataContext context;

    public SupplierValuesController(DataContext ctx)
    {
      context = ctx;
    }

    [HttpGet]
    [AllowAnonymous]
    public IEnumerable<Supplier> GetSuppliers()
    {
      return context.Suppliers;
    }

    [HttpPost]
    public IActionResult CreateSupplier([FromBody]SupplierData sdata)
    {
      if (ModelState.IsValid)
      {
        Supplier s = sdata.Supplier;
        context.Add(s);
        context.SaveChanges();
        return Ok(s.SupplierId);
      }
      else
      {
        return BadRequest(ModelState);
      }
    }


    [HttpPut("{id}")]
    public IActionResult ReplaceSupplier(long id, [FromBody] SupplierData sdata)
    {
      if (ModelState.IsValid) {
        Supplier s = sdata.Supplier;
        s.SupplierId = id;
        context.Update(s);
        context.SaveChanges();
        return Ok();
      }
      else
      {
        return BadRequest(ModelState);
      }
    }


    [HttpDelete("{id}")]
    public void DeleteSupplier(long id)
    {
      context.Remove(new Supplier { SupplierId = id });
      context.SaveChanges();
    }
  }
}
