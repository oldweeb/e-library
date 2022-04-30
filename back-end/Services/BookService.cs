using System.Text.RegularExpressions;
using back_end.DAL;
using back_end.Domain;
using back_end.Domain.DTOs;
using back_end.Interfaces;
using Microsoft.EntityFrameworkCore;
using IO = System.IO;

namespace back_end.Services
{
    public class BookService : IBookService
    {
        private readonly ELibraryDbContext _dbContext;
        private readonly DbSet<Book> _books;
        private readonly IPathContainer _container;
        private readonly IFileService _fileService;
        public BookService(ELibraryDbContext dbContext, IPathContainer container, IFileService fileService)
        {
            _dbContext = dbContext;
            _books = dbContext.Set<Book>();
            _container = container;
            _fileService = fileService;
        }
        public async Task<Book?> FindAsync(ulong id)
        {
            return await _books.FirstOrDefaultAsync(book => book.Id == id);
        }

        public async Task<IEnumerable<Book>> GetAsync(string? search, int pageNumber)
        {
            if (pageNumber <= 0)
            {
                throw new ArgumentException("Page number must be positive", nameof(pageNumber));
            }

            const int booksPerPage = 10;
            int firstBookIndex = (pageNumber - 1) * booksPerPage;

            if (search is null)
            {
                return firstBookIndex >= await _books.CountAsync()
                    ? throw new ArgumentOutOfRangeException(nameof(pageNumber), "Such page does not exist.")
                    : _books.Skip(firstBookIndex).Take(booksPerPage);
            }

            return (await GetAsync(search)).Skip(firstBookIndex).Take(booksPerPage);
        }

        public async Task<byte[]> GetBookMainImageAsync(ulong id)
        {
            Book? book = await FindAsync(id);

            if (book is null)
            {
                throw new ArgumentException("Failed to find book by id.");
            }

            var path = _container.GetBookImagePath(book.MainImagePath);

            if (IO.File.Exists(path) == false)
            {
                throw new FileNotFoundException("Failed to fetch book main image.", path);
            }

            return await IO.File.ReadAllBytesAsync(path);
        }

        public async Task<byte[]> GetBookContentAsync(ulong id)
        {
            Book? book = await FindAsync(id);

            if (book is null)
            {
                throw new ArgumentException("Failed to find book by id.");
            }

            var path = _container.GetBookСontentPath(book.ContentPath);

            if (IO.File.Exists(path) == false)
            {
                throw new FileNotFoundException("Failed to fetch book content.", path);
            }

            return await IO.File.ReadAllBytesAsync(path);
        }

        public async Task AddAsync(BookDTO book)
        {
            var bookContentPath = await _fileService.PostBookContentAsync(book.Content);
            var bookImagePath = await _fileService.PostBookImageAsync(book.MainImage);

            var bookEntity = new Book
            {
                ContentPath = bookContentPath,
                MainImagePath = bookImagePath,
                Title = book.Title,
                Description = book.Description
            };

            await _books.AddAsync(bookEntity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<int> GetPageCountAsync(string? search)
        {
            int bookCount;
            if (search is null or "")
            {
                bookCount = await _books.CountAsync();
            }
            else
            {
                var books = await GetAsync(search);
                bookCount = books.Count();
            }

            var pageCount = bookCount / 10;
            pageCount += bookCount % 10 == 0 ? 0 : 1;

            return pageCount;
        }

        public async Task<bool> DeleteAsync(ulong id)
        {
            var book = await FindAsync(id);
            if (book is null)
            {
                return false;
            }

            _dbContext.Entry(book).State = EntityState.Deleted;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        private async Task<IEnumerable<Book>> GetAsync(string search)
        {
            search = search.ToLower();
            var wordRegex = new Regex(@"\w(?<!\d)[\w'-]*");

            var words = wordRegex
                .Matches(search)
                .Select(match => match.Value)
                .ToArray();

            var allBooks = _books.AsEnumerable();

            var books = allBooks
                .Where(book => book.Title.ToLower() == search)
                .Concat(_books.Where(book => book.Title.ToLower().Contains(search)));

            books = books.Concat(
                allBooks
                    .Where(book => words.Any(book.Title.ToLower().Contains))
                    .OrderByDescending(book => words.Count(book.Title.ToLower().Contains))
            );

            return books.DistinctBy(book => book.Id);
        }
    }
}
