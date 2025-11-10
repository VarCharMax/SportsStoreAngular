using Microsoft.AspNetCore.Mvc;
using ServerApp.Models;
using System.Diagnostics;

namespace ServerApp.Controllers;

public class HomeController : Controller
{
  private readonly DataContext _dataContext;

  public HomeController(DataContext dataContext)
  {
    _dataContext = dataContext;
  }

  public IActionResult Index()
  {
    return View(_dataContext.Products.First());
  }

  public IActionResult Blazor() {
    return View();
  }
    
  public IActionResult Privacy()
  {
    return View(_dataContext.Products.First());
  }

  [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
  public IActionResult Error()
  {
    return View(new ErrorViewModel { 
        RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier 
      }
    );
  }
}
