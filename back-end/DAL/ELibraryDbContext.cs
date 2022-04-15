using back_end.Domain;
using Microsoft.EntityFrameworkCore;

namespace back_end.DAL
{
    public class ELibraryDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Administrator> Admins { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<Book> Books { get; set; }

        public ELibraryDbContext(DbContextOptions<ELibraryDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(eb =>
            {
                eb.HasKey(u => new { u.Email, u.Id });

                eb.Property(u => u.AvatarPath)
                    .HasColumnType("nvarchar(100)")
                    .IsRequired();

                eb.Property(u => u.Email)
                    .HasColumnType("nvarchar(30)")
                    .IsRequired();

                eb.Property(u => u.Password)
                    .HasColumnType("text")
                    .IsRequired();
            });

            modelBuilder.Entity<Administrator>(eb =>
            {
                eb.HasKey(a => new { a.Email, a.Id });

                eb.Property(u => u.AvatarPath)
                    .HasColumnType("nvarchar(100)")
                    .IsRequired();

                eb.Property(u => u.Email)
                    .HasColumnType("nvarchar(30)")
                    .IsRequired();

                eb.Property(u => u.Password)
                    .HasColumnType("text")
                    .IsRequired();
            });

            modelBuilder.Entity<Book>(eb =>
            {
                eb.HasKey(b => b.Id);

                // eb.HasOne(b => b.Author)
                //     .WithMany(a => a.Books)
                //     .HasForeignKey(b => b.Author);

                eb.Property(b => b.Title)
                    .HasColumnType("nvarchar(35)")
                    .IsRequired();

                eb.Property(b => b.Description)
                    .HasColumnType("text")
                    .IsRequired();

                eb.Property(b => b.MainImagePath)
                    .HasColumnType("nvarchar(100)")
                    .IsRequired();

                eb.Property(b => b.ContentPath)
                    .HasColumnType("nvarchar(100)")
                    .IsRequired();
            });

            modelBuilder.Entity<Author>(eb =>
            {
                eb.HasKey(a => a.Id);

                eb.Property(a => a.FullName)
                    .HasColumnType("nvarchar(35)")
                    .IsRequired();

                eb.Property(a => a.IconPath)
                    .HasColumnType("nvarchar(100)")
                    .IsRequired();
            });
        }
    }
}
