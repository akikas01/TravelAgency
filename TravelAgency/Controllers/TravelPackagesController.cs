using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        // GET: api/TravelPackages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TravelPackage>>> GetTravelPackages()
        {
            return await _context.TravelPackages.ToListAsync();
        }

        // GET: api/TravelPackages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TravelPackage>> GetTravelPackage(string id)
        {
            var travelPackage = await _context.TravelPackages.FindAsync(id);

            if (travelPackage == null)
            {
                return NotFound();
            }

            return travelPackage;
        }

        // PUT: api/TravelPackages/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTravelPackage(string id, TravelPackage travelPackage)
        {
            if (id != travelPackage.Title)
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
                if (!TravelPackageExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
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
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Ok("New Travel Package created successfully!");
        }

        // DELETE: api/TravelPackages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTravelPackage(string id)
        {
            var travelPackage = await _context.TravelPackages.FindAsync(id);
            if (travelPackage == null)
            {
                return NotFound();
            }

            _context.TravelPackages.Remove(travelPackage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TravelPackageExists(string id)
        {
            return _context.TravelPackages.Any(e => e.Title == id);
        }
    }
}
