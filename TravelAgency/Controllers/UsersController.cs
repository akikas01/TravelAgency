using Azure.Core;
using Azure.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
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


        [HttpPost("Login")]
        public async Task<ActionResult<User>> Login(UserPass user)
        {


            User currentUser = await _context.Users.FindAsync(user.username);
            if (currentUser == null) { return NotFound("Username does not exist!"); }
            if (!PasswordHasher.VerifyPassword(user.password, currentUser.Password)) { return NotFound("Wrong Password!"); }
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("MyUltraSecureJWTSigningKey_1234567890"); // Use secure storage in real apps

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, currentUser.Username),
                new Claim(ClaimTypes.Role, currentUser.Role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = "yourdomain.com",
                Audience = "yourdomain.com",
                SigningCredentials = new SigningCredentials(
                   new SymmetricSecurityKey(key),
                   SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            return Ok(new
            {
                user = currentUser.Username,
                role = currentUser.Role,
                token = tokenString
            });
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateAnAccount(UserPass user)
        {
            try
            {
                User currentUser = await _context.Users.FindAsync(user.username);
                if (currentUser != null) { return Conflict("Username already exist!"); }
                string hash = PasswordHasher.HashPassword(user.password);
                User newUser = new User { Username = user.username, Password = hash, Role = "User" };
                _context.Users.Add(newUser);
                _context.SaveChanges();
                return Ok(new { username = newUser.Username, role = "User" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}
