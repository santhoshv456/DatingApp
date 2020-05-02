using System;

namespace DatingApp.API.Dtos
{
    public class PhotosForDetailedDto
    {
        public int Id { get; set; }
        public string url { get; set; }
        public string description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool isMain { get; set; }
        public bool isApproved { get; set; }
        
    }
}