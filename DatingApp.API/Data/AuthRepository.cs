using System;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            _context = context;

        }

        public async Task<User> Login(string Username, string passsword)
        {
            var user= await _context.Users.FirstOrDefaultAsync(x=>x.Username==Username);

            if(user == null)
            return null;

            if(!VerifyPasswordHash(passsword,user.PasswordHash,user.PasswordSalt))
            return null;
            
            return user;
        }

        private bool VerifyPasswordHash(string passsword, byte[] passwordHash, byte[] passwordSalt)
        {
            using(var hmac=new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                 var computedHash=hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passsword));
                 for(int i=0;i<computedHash.Length;i++)
                 {
                     if(computedHash[i]!=passwordHash[i]) return false;
                 }

                 return true;
            }
        }

        public async Task<User> Register(User user, string passsword)
        {
            byte[] passwordHash, passwordSalt;

            CreatePasswordHash(passsword,out passwordHash,out passwordSalt);
              
            user.PasswordHash=passwordHash;
            user.PasswordSalt=passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            
            return user;
        }

        private void CreatePasswordHash(string passsword, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac=new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt=hmac.Key;
                passwordHash=hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passsword));
            }
        }

        public async Task<bool> UserExists(string Username)
        {
            if(await _context.Users.AnyAsync(x=>x.Username==Username))
            return true;

            return false;
        }
    }
}