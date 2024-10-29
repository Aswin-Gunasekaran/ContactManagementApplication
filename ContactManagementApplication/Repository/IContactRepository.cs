using ContactManagementApplication.API.Models;
using System.Security.Claims;

namespace ContactManagementApplication.API.Repository
{
    public interface IContactRepository
    {
        (IEnumerable<ContactDetails> contacts, int count) GetAllContacts(int page, int pageSize);
        ContactDetails GetContactById(int id);
        void AddContact(ContactDetails contact);
        ContactDetails UpdateContact(ContactDetails updatedContact);
        ContactDetails DeleteContact(int id);
        (string, DateTime, List<Claim>) GenerateJwtToken(string emailId);
    }
}
