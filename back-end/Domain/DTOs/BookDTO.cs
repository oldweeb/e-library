namespace back_end.Domain.DTOs
{
    public class BookDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public byte[] MainImage { get; set; }
        public byte[] Content { get; set; }
        public AuthorDTO Author { get; set; }
    }
}
