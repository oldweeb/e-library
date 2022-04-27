using System.Text;
using back_end.DAL;
using back_end.Helpers;
using back_end.Interfaces;
using back_end.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

IConfiguration configuration = builder.Configuration;
var services = builder.Services;

services.AddControllers();

services.AddEndpointsApiExplorer();

services.AddSwaggerGen();

services.AddDbContext<ELibraryDbContext>(optionsBuilder => optionsBuilder.UseSqlServer(
    "Server=.\\SQLEXPRESS;Database=ELibrary;Trusted_Connection=true"
));

services.AddScoped<IPathContainer, PathContainer>()
    .AddSingleton<JwtTokenService>()
    .AddScoped<IUserService, UserService>()
    .AddScoped<IAdminService, AdminService>()
    .AddScoped<IFileService, FileService>()
    .AddScoped<IBookService, BookService>();

services.AddCors(c =>
    {
        c.AddPolicy("AllowOrigin", policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
    });

services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

app.UseCors(policyBuilder => policyBuilder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseHsts();

app.Run();
