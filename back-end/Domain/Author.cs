namespace back_end.Domain
{
    public class Author : IEntityBase<ulong>
    {
        public ulong Id { get; set; }
        public string FullName { get; set; }
        public string IconPath { get; set; }
        public ICollection<Book> Books { get; set; }
    }
}
