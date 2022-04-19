namespace back_end.Domain
{
    public class Book : IEntityBase<ulong>
    {
        public ulong Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string MainImagePath { get; set; }
        public string ContentPath { get; set; }
    }
}
