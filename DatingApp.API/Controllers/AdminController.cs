using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IOptions<CloudinarySettings> _cloudnaryConfig;
        private Cloudinary _cloudinary;
        public AdminController(DataContext context, UserManager<User> userManager, IOptions<CloudinarySettings> cloudnaryConfig)
        {
            _cloudnaryConfig = cloudnaryConfig;
            _userManager = userManager;
            _context = context;

            Account account = new Account(
                _cloudnaryConfig.Value.CloudName,
                _cloudnaryConfig.Value.ApiKey,
                _cloudnaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);

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

            seletedRoles = seletedRoles ?? new string[] { };

            var result = await _userManager.AddToRolesAsync(user, seletedRoles.Except(userRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(seletedRoles));


            if (!result.Succeeded)
                return BadRequest("Failed to remove the roles");


            return Ok(await _userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photosForModeration")]
        public async Task<IActionResult> GetPhotosForModeration()
        {
            var photos = await _context.Photos
                         .Include(u => u.User)
                         .IgnoreQueryFilters()
                         .Where(p => p.isApproved == false)
                         .Select(u => new {
                             Id = u.Id,
                             UserName= u.User.UserName,
                             Url = u.url,
                             IsApproved = u.isApproved
                         }).ToListAsync();

            return Ok(photos);
        }

        
        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("approvePhoto/{photoId}")]
        public async Task<IActionResult> ApprovePhoto(int photoId)
        {
            var photo = await _context.Photos
                                 .IgnoreQueryFilters()
                                 .FirstOrDefaultAsync(p => p.Id == photoId);
            
            photo.isApproved = true;

            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("rejectPhoto/{photoId}")]
        public async Task<IActionResult> RejectPhoto(int photoId)
        {
            var photo = await _context.Photos
                                 .IgnoreQueryFilters()
                                 .FirstOrDefaultAsync(p => p.Id == photoId);
            
            if(photo.isMain)
            return BadRequest("You can't reject the main photo");

            if (photo.PublicId != null)
            {
                var deletionParms = new DeletionParams(photo.PublicId);

                var result = _cloudinary.Destroy(deletionParms);

                if (result.Result == "ok")
                {
                    _context.Photos.Remove(photo);
                }
            }

            if (photo.PublicId == null)
            {
                _context.Photos.Remove(photo);
            }

            await _context.SaveChangesAsync();
 
            return Ok();

        }

    }
}