using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelAgency.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TravelAgency.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly TRAVEL_AGENCYContext _context;

        public BookingController(TRAVEL_AGENCYContext context)
        {
            _context = context;
        }
        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<ActionResult<Booking>> Create(Booking booking)
        {

            if (_context.Bookings.Any(e => e.User == booking.User && e.TravelPackage == booking.TravelPackage))
            {
                return Conflict();
            }
            var sql = "INSERT INTO Booking VALUES ({0}, {1})";

            await _context.Database.ExecuteSqlRawAsync(sql, booking.TravelPackage, booking.User);




            return Ok("New booking created successfully!");
        }



        [Authorize(Roles = "Admin")]
        [HttpGet("Users/{title}")]
        public async Task<ActionResult<IEnumerable<String>>> GetUsers(string title)
        {
            List<Booking> bookings = _context.Bookings.Where(p => p.TravelPackage == title).ToList();

            if (bookings.Count == 0)
            {
                return NotFound("No one has booked this Travel Package");
            }
            List<String> users = new List<String>();
            foreach (var booking in bookings)
            {
                users.Add(booking.User);
            }
            return Ok(users);
        }
        [Authorize]
        [HttpGet("TravelPackages/{username}")]
        public async Task<ActionResult<IEnumerable<String>>> GetTravelPackages(string username)
        {
            List<Booking> bookings = _context.Bookings.Where(p => p.User == username).ToList();

            if (bookings.Count == 0)
            {
                return NotFound("No Travel Package was booked by this user");
            }
            List<String> travelPackages = new List<String>();
            foreach (var booking in bookings)
            {
                travelPackages.Add(booking.TravelPackage);
            }
            return Ok(travelPackages);
        }

    }
}
