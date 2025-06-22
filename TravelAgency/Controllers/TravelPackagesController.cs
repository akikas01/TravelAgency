using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelAgency.Models;

namespace TravelAgency.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TravelPackageController : ControllerBase
    {
        private readonly TRAVEL_AGENCYContext _context;

        public TravelPackageController(TRAVEL_AGENCYContext context)
        {
            _context = context;
        }

        [HttpGet("titles")]
        public async Task<ActionResult<IEnumerable<String>>> GetTravelPackagesTitles()
        {
            List<TravelPackage> TravelPackages = await _context.TravelPackages.ToListAsync();

            List<String> Titles = new List<String>();

            foreach (TravelPackage i in TravelPackages)
            {

                Titles.Add(i.Title);

            }

            return Titles;
        }


        // GET: api/TravelPackage
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TravelPackage>>> GetTravelPackages()
        {
            return await _context.TravelPackages.ToListAsync();
        }


        [HttpGet("{title}")]
        public async Task<ActionResult<TravelPackage>> GetTravelPackage(string title)
        {
            var travelPackage = await _context.TravelPackages.FindAsync(title);

            if (travelPackage == null)
            {
                return NotFound();
            }

            return travelPackage;
        }

        // PUT: api/TravelPackage/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "Admin")]
        [HttpPut("{title}")]
        public async Task<IActionResult> PutTravelPackage(string title, TravelPackage travelPackage)
        {
            if (title != travelPackage.Title)
            {
                return BadRequest();
            }

            _context.Entry(travelPackage).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TravelPackageExists(title))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Travel Package Updated Successfully");
        }

        // POST: api/TravelPackages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<TravelPackage>> CreateTravelPackage(TravelPackage travelPackage)
        {
            _context.TravelPackages.Add(travelPackage);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TravelPackageExists(travelPackage.Title))
                {
                    return Conflict("Travel Package already exists");
                }
                else
                {
                    throw;
                }
            }

            return Ok("New Travel Package created successfully!");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{title}")]
        public async Task<IActionResult> DeleteTravelPackage(string title)
        {
            var travelPackage = await _context.TravelPackages.FindAsync(title);
            List<Destination> destination = _context.Destinations.Where(p => p.TravelPackage == title).ToList();
            List<Booking> bookings = _context.Bookings.Where(p => p.TravelPackage == title).ToList();
            if (travelPackage == null)
            {
                return NotFound("Travel Package Not Found");
            }


            _context.TravelPackages.Remove(travelPackage);


            if (destination.Count != 0)
            {
                await _context.Database.ExecuteSqlRawAsync(
                "DELETE FROM Destinations WHERE TRAVEL_PACKAGE = {0}", title);

            }

            if (bookings.Count != 0)
            {
                await _context.Database.ExecuteSqlRawAsync(
               "DELETE FROM BOOKING WHERE TRAVEL_PACKAGE = {0}", title);

            }
            await _context.SaveChangesAsync();

            return Ok("Travel Package removed successfully!");
        }

        private bool TravelPackageExists(string id)
        {
            return _context.TravelPackages.Any(e => e.Title == id);
        }
    }
}
