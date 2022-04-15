namespace back_end.Helpers
{
    public class PathContainer
    {
        public string AvatarDirectory { get; }
        public string DefaultAvatarPath { get; }
        public string BookDirectory { get; }
        public PathContainer(IConfiguration configuration)
        {
            var contentRootPath = configuration.GetValue<string>(WebHostDefaults.ContentRootKey);
            AvatarDirectory = Path.Combine(contentRootPath, "Resources", "Avatars");
            DefaultAvatarPath = Path.Combine(AvatarDirectory, "default.png");
            BookDirectory = Path.Combine(contentRootPath, "Resources", "Books");
        }
    }
}
