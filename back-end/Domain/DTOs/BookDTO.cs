namespace back_end.Domain.DTOs
{
    public class BookDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public IFormFile MainImage { get; set; }
        public IFormFile Content { get; set; }
    }
}
