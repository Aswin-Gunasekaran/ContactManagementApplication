using ContactManagementApplication.API.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace ContactManagementApplication.API.Repository
{
    public class ContactRepository : IContactRepository
    {
        private readonly string _filePath = "contacts.json";
        readonly IConfiguration Configuration;
        private readonly AppConfig _appConfig;
        public ContactRepository(IConfiguration setting, AppConfig appConfig)
        {
            Configuration = setting;
            _appConfig = appConfig;

        }
        public (IEnumerable<ContactDetails> contacts, int count) GetAllContacts(int page, int pageSize)
        {
            var contacts = ReadContactsFromFile();

            // Paginate the results
            var result = contacts.Skip((page - 1) * pageSize).Take(pageSize);
            return (result, contacts.Count);

        }

        public ContactDetails GetContactById(int id)
        {
            var contacts = ReadContactsFromFile();
            // Find the contact with the specified ContactId
            return contacts.FirstOrDefault(c => c.ContactId == id);
        }

        public void AddContact(ContactDetails contact)
        {
            var contacts = ReadContactsFromFile();
            
            contact.ContactId = contacts.Count > 0 ? contacts.Max(c => c.ContactId) + 1 : 1;


            
            contacts.Add(contact);
            WriteContactsToFile(contacts);
        }

        public ContactDetails UpdateContact(ContactDetails updatedContact)
        {
            var contacts = ReadContactsFromFile();

            
            var contact = contacts.FirstOrDefault(c => c.ContactId == updatedContact.ContactId);
            if (contact != null)
            {
                
                contact.FirstName = updatedContact.FirstName;
                contact.LastName = updatedContact.LastName;
                contact.Email = updatedContact.Email;
                WriteContactsToFile(contacts);
            }
            return contact;
        }

        public ContactDetails DeleteContact(int id)
        {
            var contacts = ReadContactsFromFile();

            
            var contactToRemove = contacts.FirstOrDefault(c => c.ContactId == id);
            if (contactToRemove != null)
            {
                contacts.Remove(contactToRemove);
                WriteContactsToFile(contacts);
            }

            return contactToRemove;
        }

        private List<ContactDetails> ReadContactsFromFile()
        {
            if (File.Exists(_filePath))
            {
                var jsonData = File.ReadAllText(_filePath);
                return JsonSerializer.Deserialize<List<ContactDetails>>(jsonData) ?? new List<ContactDetails>();
            }
            return new List<ContactDetails>();
        }

        private void WriteContactsToFile(List<ContactDetails> contacts)
        {
            var jsonData = JsonSerializer.Serialize(contacts, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, jsonData);
        }


        public (string, DateTime, List<Claim>) GenerateJwtToken(string emailId)
        {
            var securityKey = Configuration["G9-JWT:SecretKey"];
            var mySecurityKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(Encoding.ASCII.GetBytes(securityKey));

            var credentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256);

            var tokenIssuer = Configuration["G9-JWT:Issuer"];
            var tokenAudience = Configuration["G9-JWT:Audience"];

            var claims = new List<Claim>
                    {

                        new Claim(ClaimTypes.Email, emailId)

                    };

            DateTime expiry = DateTime.UtcNow.AddMinutes(_appConfig.Expiry);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: expiry,
                issuer: tokenIssuer,
                audience: tokenAudience,
                signingCredentials: credentials);

            return (new JwtSecurityTokenHandler().WriteToken(token), expiry, claims);
        }
    }
}
