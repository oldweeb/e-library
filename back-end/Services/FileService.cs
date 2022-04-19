using back_end.Interfaces;

namespace back_end.Services
{
    public class FileService : IFileService
    {
        private readonly IPathContainer _container;

        private static readonly string[] s_allowedImageExtensions = new[]
        {
            "png",
            "jpeg",
            "jpg",
            "bmp"
        };

        public FileService(IPathContainer container)
        {
            _container = container;
        }

        public async Task<string> PostAvatarAsync(IFormFile file)
        {
            return await PostImageAsync(file, _container.AvatarDirectory);
        }

        public async Task<string> PostBookContentAsync(IFormFile file)
        {
            ArgumentNullException.ThrowIfNull(file, nameof(file));

            var fileExtension = file.FileName.Split('.').Last().ToLower();

            if (fileExtension is not "pdf")
            {
                throw new ArgumentException("This method accepts only pdf files.");
            }

            return await PostFileAsync(file, "pdf", _container.BooksContentsDirectory);
        }

        public async Task<string> PostBookImageAsync(IFormFile file)
        {
            return await PostImageAsync(file, _container.BooksImagesDirectory);
        }

        private async Task<string> PostImageAsync(IFormFile file, string directory)
        {
            ArgumentNullException.ThrowIfNull(file, nameof(file));

            var fileExtension = file.FileName.Split('.').Last().ToLower();

            if (s_allowedImageExtensions.Contains(fileExtension) == false)
            {
                throw new ArgumentOutOfRangeException(nameof(file), "This file extensions is not supported yet.");
            }

            return await PostFileAsync(file, fileExtension, directory);
        }

        private async Task<string> PostFileAsync(IFormFile file, string fileExtension, string directory)
        {
            var fileName = $"{Guid.NewGuid()}.{fileExtension}";
            var path = Path.Combine(directory, $"{fileName}");

            await using var stream = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(stream, CancellationToken.None);

            return fileName;
        }
    }
}
