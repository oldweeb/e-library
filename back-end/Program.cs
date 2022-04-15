using back_end.DAL;
using back_end.Helpers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var services = builder.Services;
services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
services.AddEndpointsApiExplorer()
    .AddSwaggerGen()
    .AddDbContext<ELibraryDbContext>(
    optionsBuilder => optionsBuilder.UseSqlServer(
        "Server=.\\SQLEXPRESS;Database=ELibrary;Trusted_Connection=true"
    ))
    .AddSingleton<PathContainer>()
    .AddCors(c =>
    {
        c.AddPolicy("AllowOrigin", policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
    })
    .AddAuthentication();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(policyBuilder => policyBuilder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
