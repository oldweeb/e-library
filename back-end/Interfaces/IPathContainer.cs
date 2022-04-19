namespace back_end.Interfaces;

public interface IPathContainer
{
    string AvatarDirectory { get; }
    string DefaultAvatarName { get; }
    string BookDirectory { get; }
    string BooksImagesDirectory { get; }
    string BooksContentsDirectory { get; }

    string GetAvatarPath(string avatarName);
    string GetBookСontentPath(string bookName);
    string GetBookImagePath(string bookName);
}