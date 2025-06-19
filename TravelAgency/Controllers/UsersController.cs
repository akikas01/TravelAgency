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
    public class UsersController : ControllerBase
    {
        private readonly TRAVEL_AGENCYContext _context;

        public UsersController(TRAVEL_AGENCYContext context)
        {
            _context = context;
        } 

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserExists(user.Username))
                {
                    return Conflict("Username Already Exists!");
                }
                else
                {
                    return BadRequest();
                }
            }

            return CreatedAtAction("GetUser", new { id = user.Username }, user);
        }

        

        private bool UserExists(string id)
        {
            return _context.Users.Any(e => e.Username == id);
        }
    }
}
