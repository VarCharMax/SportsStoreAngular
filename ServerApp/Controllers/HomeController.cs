using Microsoft.AspNetCore.Mvc;
using ServerApp.Models;
using System.Diagnostics;

namespace ServerApp.Controllers;

public class HomeController : Controller
{
  public HomeController()
  {
  }

  public IActionResult Index()
  {
    return View();
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
