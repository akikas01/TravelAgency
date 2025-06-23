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
                if (_context.Destinations.Any(e => e.Country == destination.Country && e.TravelPackage == destination.TravelPackage))
                {
                    continue;//If the same record exists in the database it doesn't insert the same record, it skips it.
                }

                var sql = "INSERT INTO Destinations VALUES ({0}, {1})";

                await _context.Database.ExecuteSqlRawAsync(sql, destination.Country, destination.TravelPackage);


            }

            return Ok();
        }



        [HttpGet("country/{Country}")]
        public async Task<ActionResult<IEnumerable<String>>> GetTravelPackages(string Country)
        {
            List<Destination> destinations = _context.Destinations.Where(p => p.Country == Country).ToList();


            if (destinations.Count == 0)
            {

                return NotFound("No Travel Packages includes this country!");

            }
            List<String> travelPackages = new List<String>();
            foreach (Destination destination in destinations)
            {

                travelPackages.Add(destination.TravelPackage);
            }

            return Ok(travelPackages);
        }

        [HttpGet("TravelPackage/{title}")]
        public async Task<ActionResult<IEnumerable<String>>> GetCountries(string title)
        {
            List<Destination> destinations = _context.Destinations.Where(p => p.TravelPackage == title).ToList();


            if (destinations.Count == 0)
            {

                return NotFound("No Travel Package found in Destinations");

            }
            List<String> countries = new List<String>();
            foreach (Destination destination in destinations)
            {

                countries.Add(destination.Country);
            }

            return Ok(countries);
        }



    }
}
