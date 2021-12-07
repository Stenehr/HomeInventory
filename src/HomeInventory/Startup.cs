using System.Text;
using FluentValidation.AspNetCore;
using HomeInventory.Infrastructure;
using HomeInventory.Middleware;
using HomeInventory.Persistance;
using HomeInventory.Services;
using HomeInventory.Validators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace HomeInventory
{
    public class Startup
    {
        private readonly IConfiguration _config;

        public Startup(IConfiguration configuration)
        {
            _config = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(opt => opt.AddPolicy("DevCors",
                builder => builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials()
                    .WithOrigins("http://localhost:3000")));

            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            }).AddFluentValidation(config => config.RegisterValidatorsFromAssemblyContaining<UserLoginDtoValidator>());
            
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "HomeInventory", Version = "v1" });
            });

            services.AddDbContext<DataContext>(
                opt => opt.UseSqlServer(_config.GetConnectionString("DefaultConnection")));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config[Constants.TOKEN_KEY]));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsAdmin", builder =>
                {
                    builder.Requirements.Add(new IsAdminRequirement());
                });
            });

            services.AddTransient<IAuthorizationHandler, IsAdminRequirementHandler>();

            services.AddHttpContextAccessor();

            services.AddScoped<AdminService>();
            services.AddScoped<UserService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<InventoryService>();
            services.AddScoped<TokenService>();
            services.AddScoped<IUserAccessor, UserAccessor>();

            services.TryAddSingleton(_config.GetSection(nameof(FileSettings)).Get<FileSettings>());
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "HomeInventory v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            if (env.IsDevelopment())
            {
                app.UseCors("DevCors");
            }

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
