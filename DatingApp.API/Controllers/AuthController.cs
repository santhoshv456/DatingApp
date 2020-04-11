using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        public IMapper _Mapper { get; }

        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            _config = config;
            _Mapper = mapper;
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {

            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

            if (await _repo.UserExists(userForRegisterDto.Username))
                return BadRequest("Username already exists");

            var UserToCreate = _Mapper.Map<User>(userForRegisterDto);

            var createduser = await _repo.Register(UserToCreate, userForRegisterDto.Password);

            var userToReturn = _Mapper.Map<UserForDetailedDto>(createduser);

            return CreatedAtRoute("GetUser", new {Controller ="Users", id = createduser.Id}, userToReturn);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            
            var userfromrepo = await _repo.Login(userForLoginDto.UserName.ToLower(), userForLoginDto.Password);

            if (userfromrepo == null)
                return Unauthorized();

            var claims = new[]
            {
                  new Claim(ClaimTypes.NameIdentifier,userfromrepo.Id.ToString()),
                  new Claim(ClaimTypes.Name,userfromrepo.Username)
               };

            var key  = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds=new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor=new SecurityTokenDescriptor
            {
                 Subject=new ClaimsIdentity(claims),
                 Expires=DateTime.Now.AddDays(1),
                 SigningCredentials=creds
            };

            var tokenHandler= new JwtSecurityTokenHandler();
             
            var token=tokenHandler.CreateToken(tokenDescriptor);

            var user = _Mapper.Map<UserForListDto>(userfromrepo);

            return Ok(new {
                token=tokenHandler.WriteToken(token),
                user
            });
        }
    }
}