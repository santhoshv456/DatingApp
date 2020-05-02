using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        public AdminController(DataContext context, UserManager<User> userManager)
        {
            _userManager = userManager;
            _context = context;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("usersWithRoles")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var userList = await _context.Users
                                .OrderBy(u => u.UserName)
                                .Select(u => new
                                {
                                    Id = u.Id,
                                    UserName = u.UserName,
                                    Roles = (from userRole in u.UserRoles join role in _context.Roles on userRole.RoleId equals role.Id select role.Name)
                                }).ToListAsync();

            return Ok(userList);

        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("editRole/{userName}")]
        public async Task<IActionResult> editRole(string userName, RoleEditDto roleEditDto)
        {
            var user = await _userManager.FindByNameAsync(userName);

            var userRoles = await _userManager.GetRolesAsync(user);

            var seletedRoles = roleEditDto.RoleNames;

            seletedRoles = seletedRoles ?? new string[] {};

            var result = await _userManager.AddToRolesAsync(user, seletedRoles.Except(userRoles));

            if(!result.Succeeded)
            return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(seletedRoles));


            if(!result.Succeeded)
            return BadRequest("Failed to remove the roles");

        
            return Ok(await _userManager.GetRolesAsync(user));
        }



        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photosForModeration")]
        public IActionResult GetPhotosForModeration()
        {
            return Ok("Admins or Modertors can see this");
        }

    }
}