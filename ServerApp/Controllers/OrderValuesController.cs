using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerApp.Models;

namespace ServerApp.Controllers
{
  [Route("/api/orders")]
  [ApiController]
  [Authorize(Roles = "Administrator")]
  [AutoValidateAntiforgeryToken]
  public class OrderValuesController(DataContext ctx) : Controller
  {
    [HttpGet]
    public IEnumerable<Order> GetOrders() {
      return ctx.Orders
        .Include(o => o.Products)
        .Include(o => o.Payment);
    }

    [HttpPost("{id}")]
    public ActionResult<bool> MarkShipped(long id)
    {
      bool shipped = false;

      try
      {
        Order? order = ctx.Orders.Find(id);

        if (order != null)
        {
          order.Shipped = true;
          ctx.SaveChanges();
          shipped = true;
        }
        else
        {
          shipped = false; 
        }
      }
      catch (Exception)
      {
        shipped = false;
      }

      return Ok(shipped);
    }

    [HttpPost]
    [AllowAnonymous]
    public ActionResult CreateOrder([FromBody] Order order)
    {
      order.OrderId = 0; order.Shipped = false;
      order.Payment.Total = GetPrice(order.Products);

      try
      {
        ProcessPayment(order.Payment);

        if (order.Payment.AuthCode != null)
        {
          ctx.Add(order);
          ctx.SaveChanges();

          return Ok(new 
          {
            orderId = order.OrderId,
            authCode = order.Payment.AuthCode,
            amount = order.Payment.Total
          }
          );
        }
        else
        {
          return BadRequest("Payment rejected");
        }
      }
      catch (Exception)
      {
        return BadRequest("Payment rejected");
      }
    }

    private decimal GetPrice(IEnumerable<CartLine> lines)
    {
      IEnumerable<long> ids = lines.Select(l => l.ProductId);
      IEnumerable<Product> prods = ctx.Products.Where(p => ids.Contains(p.ProductId));
      
      return prods.Select(p => lines.First(l => l.ProductId == p.ProductId).Quantity * p.Price).Sum();
    }

    private void ProcessPayment(Payment payment)
    {
      // integrate your payment system here
      payment.AuthCode = "12345";
    }
  }
}

