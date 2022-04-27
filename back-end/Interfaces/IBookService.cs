using back_end.Domain;
using back_end.Domain.DTOs;

namespace back_end.Interfaces
{
    public interface IBookService
    {
        Task<Book?> FindAsync(ulong id);
        Task<IEnumerable<Book>> GetAsync(int pageNumber);
        Task<byte[]> GetBookMainImageAsync(ulong id);
        Task<byte[]> GetBookContentAsync(ulong id);
        Task AddAsync(BookDTO book);
        Task<int> GetPageCountAsync();
    }
}
