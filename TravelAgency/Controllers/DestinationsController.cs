using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelAgency.Models;

namespace TravelAgency.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DestinationsController : ControllerBase
    {
        
        private readonly TRAVEL_AGENCYContext _context;
        public DestinationsController(TRAVEL_AGENCYContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(List<Destination> destinations)
        {
            foreach (var destination in destinations)
            {
                if (_context.Destinations.Any(e => e.Country==destination.Country && e.TravelPackage == destination.TravelPackage))
                {
                    continue;//If the same record exists in the database it doesn't insert the same record, it skips it.
                }

                var sql = "INSERT INTO Destinations VALUES ({0}, {1})";

                await _context.Database.ExecuteSqlRawAsync(sql, destination.Country, destination.TravelPackage);


            }

            return Ok();
        }
    }
}
