using System.Collections.Generic;
using System.IO;
using System.Linq;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        public static void SeedData(UserManager<User> context, RoleManager<Role> roleManager)
        {
            if(!context.Users.Any())
            {
                 var userData=File.ReadAllText("Data/UserSeedData.json");
                 var users= JsonConvert.DeserializeObject<List<User>>(userData);
                 
                 var roles = new List<Role> {
                      new Role { Name = "Member"},
                      new Role { Name = "Admin"},
                      new Role { Name = "Moderator"},
                      new Role { Name = "VIP"}
                 };
                 
                 foreach (var role in roles)
                 {
                      roleManager.CreateAsync(role).Wait();
                 }

                 foreach (var user in users)
                 { 
                   context.CreateAsync(user, "password").Wait();
                   context.AddToRoleAsync(user,"Member").Wait();
                 }

                 var adminUser = new User {
                       UserName = "Admin"
                 };

                 var result = context.CreateAsync(adminUser,"password").Result;

                 if(result.Succeeded)
                 {
                     var admin = context.FindByNameAsync("Admin").Result;
                     context.AddToRolesAsync(admin, new[] {"Admin", "Moderator"}).Wait();
                 }
            }
        }

        private static void CreatePasswordHash(string passsword, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac=new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt=hmac.Key;
                passwordHash=hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passsword));
            }
        }
    }
}