using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _DatingRepository;
        private readonly IMapper _mapper;

        public UsersController(IDatingRepository DatingRepository, IMapper mapper)
        {
            _mapper = mapper;
            _DatingRepository = DatingRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {  
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value); 

            var userFromRepo = await _DatingRepository.GetUser(currentUserId);

            userParams.UserId = currentUserId;

            if(string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            }

            var users = await _DatingRepository.GetUsers(userParams);

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users); 
           
            Response.AddPagination(users.CurrentPage, users.PageSize,users.TotalCount, users.TotalPages);

            return Ok(usersToReturn);
        }

        [HttpGet("{id}", Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _DatingRepository.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
              return Unauthorized();

            var userFromRepo = await _DatingRepository.GetUser(id);

            _mapper.Map(userForUpdateDto, userFromRepo);

            if(await _DatingRepository.SaveAll())
                return NoContent();

            throw new Exception($"Updating user {id} failed on save");
        }
        
        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
              return Unauthorized();

            var like = await _DatingRepository.GetLike(id,recipientId);

            if(like != null)
               return BadRequest("You already like this user");

            if(await _DatingRepository.GetUser(recipientId)== null)
              return NotFound();

            like = new Like
            {
                LikerId = id,
                LikeeId = recipientId
            };

            _DatingRepository.Add<Like>(like);

            if(await _DatingRepository.SaveAll())
                return Ok();

             return  BadRequest("Failed to like user");          
        }

    }
}