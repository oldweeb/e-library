namespace back_end.Interfaces
{
    public interface IFileService
    {
        Task<string> PostAvatarAsync(IFormFile file);
        Task<string> PostBookContentAsync(IFormFile file);
        Task<string> PostBookImageAsync(IFormFile file);
    }
}
