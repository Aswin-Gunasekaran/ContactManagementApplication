﻿using ContactManagementApplication.API.Repository;
using ContactManagementApplication.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace ContactManagementApplication.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly string _filePath = "contacts.json";
        readonly IConfiguration Configuration;
        private readonly AppConfig _appConfig;
        private readonly ILogger<ContactController> _logger;
        private readonly IContactRepository _contactRepository;

        public ContactController(ILogger<ContactController> logger, IConfiguration setting, AppConfig appConfig, IContactRepository contactRepository)
        {
            _logger = logger;
            Configuration = setting;
            _appConfig = appConfig;
            _contactRepository = contactRepository;
        }

        [HttpGet("GetContacts")]
        public IActionResult GetContacts(int page = 1, int pageSize = 10)
        {
            var result = _contactRepository.GetAllContacts(page, pageSize);

            return Ok(new
            {
                Message = "Contacts retrieved successfully",
                Contacts = result.contacts,
                TotalRecords = result.count
            });
        }

        [HttpGet("GetContactById")]
        public IActionResult GetContactById(int contactId)
        {
            var contacts = new List<ContactDetails>();

            var contact = _contactRepository.GetContactById(contactId);

            if (contact == null)
            {
                return NotFound(new { Message = $"Contact with ID {contactId} not found." });
            }

            return Ok(contact);
        }

        [HttpPost("AddContact")]
        public IActionResult AddContact([FromBody] ContactDetails newContact)
        {
            _contactRepository.AddContact(newContact);

            var contacts = new List<ContactDetails>();

            return CreatedAtAction(nameof(GetContactById), new { id = newContact.ContactId },
                new { Message = "Contact added successfully", Contact = newContact });
        }

        [HttpPut("UpdateContact")]
        public IActionResult UpdateContact([FromBody] ContactDetails updatedContact)
        {
            updatedContact.ContactId = updatedContact.ContactId; // Ensure the ID matches
            var contact = _contactRepository.UpdateContact(updatedContact);

            if (contact == null)
            {
                return NotFound(new { Message = "Contact not found" });
            }

            return Ok(new { Message = "Contact updated successfully", UpdatedContact = contact });
        }

        [HttpDelete("DeleteContact")]
        public IActionResult DeleteContact(int id)
        {
            var contact = _contactRepository.DeleteContact(id);
            if (contact == null)
            {
                return NotFound(new { Message = "Contact not found" });
            }

            return Ok(new { Message = "Contact deleted successfully", DeletedContactId = id });
        }

      
        [HttpPost("ValidateUserAndGetToken")]
        public async Task<IActionResult> ValidateUserAndGetToken(UserInfo userCredential)
        {
            if (string.IsNullOrEmpty(userCredential.Email) || string.IsNullOrEmpty(userCredential.Password))
            {
                return Ok(new
                {
                    Status = false,
                    Message = "NotExists"
                });
            }

            var token = _contactRepository.GenerateJwtToken(userCredential.Email);
            TokenDetails responseObj = new TokenDetails();
            responseObj.Token = token.Item1;
            responseObj.ExpiresIn = getDateTimeInSpecficFormat(token.Item2);

            return Ok(new
            {
                Status = true,
                Message = "Success",
                Result = userCredential,
                TokenResult = responseObj
            });
        }

       
        [NonAction]
        private string getDateTimeInSpecficFormat(DateTime dateTime)
        {
            return dateTime.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss");
        }
    }
}
