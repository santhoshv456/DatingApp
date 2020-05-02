using System;
using System.Collections;
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
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;

        }

        [HttpGet("{id}", Name="GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
              return Unauthorized();
            
            var messageFromRepo = await _repo.GetMessage(id);

            if(messageFromRepo == null)
            return NotFound();

            return Ok(messageFromRepo);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessageForUser(int userId,[FromQuery] MessageParams messageParams)
        {
           if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
              return Unauthorized();

             messageParams.UserId = userId;

             var messageFromRepo = await _repo.GetMessagesForUser(messageParams);

             var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageFromRepo);

             Response.AddPagination(messageFromRepo.CurrentPage,messageFromRepo.PageSize,messageFromRepo.TotalCount,messageFromRepo.TotalPages);

            return Ok(messages);
        }

        [HttpGet("thread/{id}")]
        public async Task<IActionResult> GetGetMessageThread(int userId, int id)
        {
             if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                 return Unauthorized();   
              
             var messageFromRepo = await _repo.GetMessageThread(userId,id);

             var messageThread = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageFromRepo);

             return  Ok(messageThread);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {
            var sender = _repo.GetUser(userId);

            if(sender.Result.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
              return Unauthorized();
           
           messageForCreationDto.SenderId = userId;

           var recipient = _repo.GetUser(messageForCreationDto.RecipientId);
           
           if(recipient==null)
            return BadRequest("Could not find user");

           var message = _mapper.Map<Message>(messageForCreationDto);

           _repo.Add(message); 

           if(await _repo.SaveAll())
           {
              var messageToReturn = _mapper.Map<MessageToReturnDto>(message);
              return CreatedAtRoute("GetMessage", new {userId ,id=message.Id}, messageToReturn);
           }

           throw new Exception("Creating the method failed on save");

        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId)
        {
             if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                 return Unauthorized(); 

            var messageFromRepo = await _repo.GetMessage(id);

            if(messageFromRepo.SenderId == userId)
                messageFromRepo.SenderDeleted = true;

            if(messageFromRepo.RecipientId == userId)
                 messageFromRepo.RecipientDeleted = true;

            
            if(messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted)
              _repo.Delete(messageFromRepo);


             if(await _repo.SaveAll())
                return NoContent();
            
            throw new Exception("Error deleting the Message");
            
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int userId, int id)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                 return Unauthorized(); 

            var messageFromRepo = await _repo.GetMessage(id);

            if(messageFromRepo.RecipientId != userId)
               return Unauthorized();

            messageFromRepo.IsRead = true;
            messageFromRepo.DateRead = DateTime.Now;

            await _repo.SaveAll();

            return NoContent();
        }

    }
}