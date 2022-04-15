namespace back_end.Domain
{
    public abstract class UserBase
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string AvatarPath { get; set; }
    }
}
