using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelAgency.Models;

namespace TravelAgency.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountriesController : ControllerBase
    {
        private readonly TRAVEL_AGENCYContext _context;

        public CountriesController(TRAVEL_AGENCYContext context)
        {
            _context = context;
        }

        // GET: api/Countries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<String>>> GetCountries()
        {

            List<Country> countriesObjects = await _context.Countries.ToListAsync();
            List<String> countries = new List<String>();
            foreach (Country i in countriesObjects)
            {

                countries.Add(i.Name);

            }


            return countries;
        }


    }
}
