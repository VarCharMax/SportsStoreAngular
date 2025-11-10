using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using ServerApp.Helpers;
using ServerApp.Models;
using System.Reflection;

namespace ServerApp
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
      string? connectionString = Configuration["ConnectionStrings:DefaultConnection"];
      if (string.IsNullOrEmpty(connectionString))
      {
        throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");
      }

      services.AddDbContext<DataContext>(options =>
        options.UseSqlServer(connectionString));

      services.AddDbContext<IdentityDataContext>(options => 
        options.UseSqlServer(Configuration["ConnectionStrings:Identity"])
      );

      services.AddIdentity<IdentityUser, IdentityRole>().AddEntityFrameworkStores<IdentityDataContext>();

            // services.AddRazorComponents()
            //  .AddInteractiveServerComponents()
            //  .AddInteractiveWebAssemblyComponents();

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

      services.AddDistributedSqlServerCache(options => {
          options.ConnectionString = connectionString;
          options.SchemaName = "dbo";
          options.TableName = "SessionData"; 
        }
      );
      
      services.AddSession(options => {
          options.Cookie.Name = "SportsStore.Session";
          options.IdleTimeout = TimeSpan.FromHours(48);
          options.Cookie.HttpOnly = false;
          options.Cookie.IsEssential = true;
        }
      );

      /*
      services.AddResponseCompression(opts => 
        {
          opts.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "application/octet-stream" });
        }
      );
      */
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider services)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseWebAssemblyDebugging();
      }
      else
      {
        app.UseExceptionHandler("/Home/Error");
        app.UseHsts();
      }

      app.UseHttpsRedirection();

      app.UseBlazorFrameworkFiles("/blazor");

      app.UseStaticFiles();

      /*
      app.UseStaticFiles(new StaticFileOptions
      {
        RequestPath = "/blazor",
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(),
        "../BlazorApp/wwwroot"))
      });
      */

      app.UseSession();

      /*
      app.Map("/blazor", child =>
      {
        child.UseRouting();
        // child.UseAuthorization();
        child.UseAntiforgery();
        child.UseEndpoints(endpoints =>
        {
          // endpoints.MapRazorComponents<App>();
          endpoints.MapFallbackToFile("blazor/index.html");
        });
      });
      */

      app.UseRouting();
      app.UseAntiforgery();
      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllerRoute(
                 name: "default",
                 pattern: "{controller=Home}/{action=Index}/{id?}");

        endpoints.MapControllerRoute(
            name: "angular_fallback",
            pattern: "{target:regex(admin|store|cart|checkout):nonfile}/{*catchall}",
            defaults: new { controller = "Home", action = "Index" }
          );

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
          }
        );
        
        SeedData.SeedDatabase(services.GetRequiredService<DataContext>());
        IdentitySeedData.SeedDatabase(services).Wait();
      }
    }
  }
}
