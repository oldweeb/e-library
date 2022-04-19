using back_end.Interfaces;

namespace back_end.Helpers
{
    public class PathContainer : IPathContainer
    {
        public string AvatarDirectory { get; }
        public string DefaultAvatarName { get; }
        public string BookDirectory { get; }
        public string BooksImagesDirectory { get; }
        public string BooksContentsDirectory { get; }

        public PathContainer(IConfiguration configuration)
        {
            var contentRootPath = configuration.GetValue<string>(WebHostDefaults.ContentRootKey);
            AvatarDirectory = Path.Combine(contentRootPath, "Resources", "Avatars");
            DefaultAvatarName = "default.png";
            BookDirectory = Path.Combine(contentRootPath, "Resources", "Books");
            BooksImagesDirectory = Path.Combine(BookDirectory, "Images");
            BooksContentsDirectory = Path.Combine(BookDirectory, "Contents");
        }
        public string GetAvatarPath(string avatarName)
        {
            return Path.Combine(AvatarDirectory, avatarName);
        }

        public string GetBookСontentPath(string bookName)
        {
            return Path.Combine(BooksContentsDirectory, bookName);
        }

        public string GetBookImagePath(string bookName)
        {
            return Path.Combine(BooksImagesDirectory, bookName);
        }
    }
}
