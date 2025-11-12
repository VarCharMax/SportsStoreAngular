using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using ServerApp.Helpers;
using ServerApp.Models;
using System.Reflection;

namespace ServerApp
{
  public class Startup(IWebHostEnvironment env)
  {
    private readonly IConfigurationRoot Configuration = new ConfigurationBuilder()
            .SetBasePath(env.ContentRootPath)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
            .AddUserSecrets(Assembly.GetExecutingAssembly(), true)
            .AddEnvironmentVariables()
            .AddCommandLine([.. Environment.GetCommandLineArgs().Skip(1)])
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
      services.AddIdentity<IdentityUser, IdentityRole>().AddEntityFrameworkStores<IdentityDataContext>();

      services.AddDbContext<IdentityDataContext>(options => 
        options.UseSqlServer(Configuration["ConnectionStrings:Identity"])
      );

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

      services.AddDistributedSqlServerCache(options =>
        {
          options.ConnectionString = connectionString;
          options.SchemaName = "dbo";
          options.TableName = "SessionData";
        }
      );

      services.AddSession(options =>
        {
          options.Cookie.Name = "SportsStore.Session";
          options.IdleTimeout = TimeSpan.FromHours(48);
          options.Cookie.HttpOnly = false;
          options.Cookie.IsEssential = true;
        }
      );

      services.AddAntiforgery(options =>
        {
          options.HeaderName = "X-XSRF-TOKEN";
        }
      );

      if (env.IsDevelopment())
      {
        services.AddOpenApi();
      }
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider services, IAntiforgery antiforgery,
            IHostApplicationLifetime lifetime)
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
      
      app.UseStaticFiles(new StaticFileOptions
      {
        RequestPath = "",
        FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(),
                        "./wwwroot/app"))
      });

      app.UseSession();
      app.UseRouting();
      app.UseAntiforgery();
      app.UseAuthentication();
      app.UseAuthorization();

      app.Use(nextDelegate => context => {
        string? path = context.Request.Path.Value;

        if (path != null)
        {
          string[] directUrls = ["/admin", "/store", "/cart", "checkout"];
          if (path.StartsWith("/api") || string.Equals("/", path) || directUrls.Any(url => path.StartsWith(url)))
          {
            var tokens = antiforgery.GetAndStoreTokens(context);

            if (tokens.RequestToken != null)
            {
              context.Response.Cookies.Append("XSRF-TOKEN",
                tokens.RequestToken, new CookieOptions()
                {
                  HttpOnly = false,
                  Secure = false,
                  IsEssential = true
                });
            }
          }
        }
        
        return nextDelegate(context);
      });

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
        
        // SeedData.SeedDatabase(services.GetRequiredService<DataContext>());
        // IdentitySeedData.SeedDatabase(services).Wait();

        if ((Configuration["INITDB"] ?? "false") == "true")
        {
          Console.WriteLine("Preparing Database...");
          SeedData.SeedDatabase(services.GetRequiredService<DataContext>());
          IdentitySeedData.SeedDatabase(services).Wait();
          Console.WriteLine("Database Preparation Complete");
          lifetime.StopApplication();
        }
      }
    }
  }
}
