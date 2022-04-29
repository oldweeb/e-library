using System.Security.Claims;
using back_end.Domain;
using back_end.Domain.DTOs;
using back_end.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly IAdminService _adminService;

        public BooksController(IBookService bookService, IAdminService adminService)
        {
            _adminService = adminService;
            _bookService = bookService;
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult> GetBooks([FromQuery] string? search, [FromQuery] int pageNumber)
        {
            try
            {
                IEnumerable<Book> books = await _bookService.GetAsync(search, pageNumber);
                return Ok(new
                {
                    Books = books.Select(book => new { book.Id, book.Title })
                });
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return NotFound(new { ErrorText = ex.Message });
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
        }

        [Authorize]
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> GetBook(ulong id)
        {
            Book? book = await _bookService.FindAsync(id);

            if (book is null)
            {
                return NotFound();
            }

            return Ok(new { Book = new { book.Id, book.Title, book.Description } });
        }

        [Authorize]
        [HttpGet]
        [Route("{id}/mainImage")]
        public async Task<ActionResult> GetBookMainImage(ulong id)
        {
            try
            {
                byte[] imageBytes = await _bookService.GetBookMainImageAsync(id);
                var title = (await _bookService.FindAsync(id))?.Title;
                return File(imageBytes, "application/octet-stream", title);
            }
            catch
            {
                return NotFound();
            }
        }

        [Authorize]
        [HttpGet]
        [Route("{id}/content")]
        public async Task<ActionResult> GetBookContent(ulong id)
        {
            try
            {
                byte[] contentBytes = await _bookService.GetBookContentAsync(id);
                var title = (await _bookService.FindAsync(id))?.Title;
                return File(contentBytes, "application/octet-stream", title);
            }
            catch
            {
                return NotFound();
            }
        }

        [Authorize]
        [HttpGet]
        [Route("pageCount")]
        public async Task<ActionResult> GetPageCount()
        {
            return Ok(new {PageCount = await _bookService.GetPageCountAsync()});
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> PostBook([FromForm] BookDTO book)
        {
            Claim? emailClaim = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "email-address");
            if (emailClaim is null)
            {
                return BadRequest(new { ErrorText = "Email claim is null." });
            }

            var email = emailClaim.Value.ToLower();

            Administrator? admin = await _adminService.FindAsync(email);

            if (admin is null)
            {
                return Forbid();
            }

            try
            {
                await _bookService.AddAsync(book);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { ErrorText = $"Failed to upload book. \nException message: {ex.Message}" });
            }
        }
    }
}
