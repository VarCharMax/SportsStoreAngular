using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using ServerApp.Helpers;
using ServerApp.Models;
using System.Reflection;

namespace SportsStore.Server
{
  public class Startup(IWebHostEnvironment env)
  {
    private readonly IConfigurationRoot Configuration = new ConfigurationBuilder()
            .SetBasePath(env.ContentRootPath)
            .AddJsonFile("appSettings.json", optional: false, true)
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, true)
            .AddUserSecrets(Assembly.GetExecutingAssembly(), true)
            .AddEnvironmentVariables()
            .Build();

    public void ConfigureServices(IServiceCollection services)
    {
      string? connectionstring = Configuration["ConnectionStrings:DefaultConnection"];
      if (string.IsNullOrEmpty(connectionstring))
      {
        throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");
      }

      services.AddDbContext<DataContext>(options =>
        options.UseSqlServer(connectionstring));

      services.AddControllersWithViews(options =>
        {
          options.InputFormatters.Insert(0, MyJPIF.GetJsonPatchInputFormatter()); //Support for PATCH method.
          options.ModelMetadataDetailsProviders.Add(new NewtonsoftJsonValidationMetadataProvider()); //Use JSON property names in validation errors
        }
       )
       .AddNewtonsoftJson(options =>
         {
           // 1. Prevent serialisation of circular references.
           // 2. Remove null stubs arisng from 1.
           options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
           options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
         }
       )
       .AddNewtonsoftJson(); // Needed for PATCH method support.

      //This adds support for WebApi and Controllers with Views.
      services.AddRazorPages();

      if (env.IsDevelopment())
      {
        services.AddOpenApi();
      }
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider services)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseExceptionHandler("/Home/Error");
        app.UseHsts();
      }

      app.UseHttpsRedirection();
      app.UseStaticFiles();
      app.UseRouting();
      // app.UseDefaultFiles();

      //Must be declared between UseRouting and UseEndpoints.
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        // endpoints.MapStaticAssets();
        // endpoints.MapFallbackToFile("/index.html");

        endpoints.MapControllerRoute(
                 name: "default",
                 pattern: "{controller=Home}/{action=Index}/{id?}");
        endpoints.MapRazorPages();

        if (env.IsDevelopment())
        {
          endpoints.MapOpenApi( );
        }
      });
      
      if (env.IsDevelopment())
      {
        app.UseSwaggerUI(options =>
        {
          options.SwaggerEndpoint("/openapi/v1.json", "v1");
        });

        app.UseSpa(spa =>
        {
          string strategy = Configuration.GetValue<string>("DevTools:ConnectionStrategy") ?? "managed";

          if (strategy == "proxy")
          {
            spa.UseProxyToSpaDevelopmentServer("http://localhost:4200/");
          }
          else if (strategy == "managed")
          {
            spa.Options.SourcePath = "../ClientApp";
            spa.UseAngularCliServer(npmScript: "start");
          }
        });

        SeedData.SeedDatabase(services.GetRequiredService<DataContext>());

      }
    }
  }
}
