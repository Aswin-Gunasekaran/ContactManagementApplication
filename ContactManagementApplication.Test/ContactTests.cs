using NUnit.Framework;
using Moq;
using Microsoft.AspNetCore.Mvc;
using ContactManagementApplication.API.Controllers;
using ContactManagementApplication.API.Models;
using ContactManagementApplication.API.Repository;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ContactManagementApplication.API.Tests.Controllers
{
    [TestFixture]
    public class ContactControllerTests
    {
        private Mock<IContactRepository> _mockContactRepository;
        private Mock<ILogger<ContactController>> _mockLogger;
        private ContactController _controller;

        [SetUp]
        public void Setup()
        {
            _mockContactRepository = new Mock<IContactRepository>();
            _mockLogger = new Mock<ILogger<ContactController>>();
            _controller = new ContactController(_mockLogger.Object, null, null, _mockContactRepository.Object);
        }

        [Test]
        public void GetContacts_ReturnsOkResult_WithContacts()
        {
            // Arrange
            var contacts = new List<ContactDetails>
            {
                new ContactDetails { ContactId = 1, FirstName = "John", LastName = "Doe", Email = "john.doe@example.com" },
                new ContactDetails { ContactId = 2, FirstName = "Jane", LastName = "Doe", Email = "jane.doe@example.com" }
            };

            var response = (contacts, 2);

            _mockContactRepository.Setup(repo => repo.GetAllContacts(It.IsAny<int>(), It.IsAny<int>())).Returns(response);

            // Act
            IActionResult responseResult = _controller.GetContacts();

            // Assert
            var okResult = (OkObjectResult)responseResult;
            var value = (dynamic)okResult.Value; // Cast to dynamic for easier access to properties
            Assert.AreEqual(2, value.TotalRecords);
            Assert.AreEqual(2, ((List<ContactDetails>)value.Contacts).Count);
        }

        [Test]
        public void GetContactById_ExistingId_ReturnsOkResult_WithContact()
        {
            // Arrange
            var contact = new ContactDetails { ContactId = 1, FirstName = "John", LastName = "Doe", Email = "john.doe@example.com" };
            _mockContactRepository.Setup(repo => repo.GetContactById(1)).Returns(contact);

            // Act
            IActionResult result = _controller.GetContactById(1);

            // Assert
            var okResult = (OkObjectResult)result;
            var returnedContact = (ContactDetails)okResult.Value;
            Assert.AreEqual(contact.ContactId, returnedContact.ContactId);
            Assert.AreEqual(contact.FirstName, returnedContact.FirstName);
            Assert.AreEqual(contact.LastName, returnedContact.LastName);
            Assert.AreEqual(contact.Email, returnedContact.Email);
        }

        [Test]
        public void GetContactById_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            _mockContactRepository.Setup(repo => repo.GetContactById(99)).Returns((ContactDetails)null);

            // Act
            IActionResult result = _controller.GetContactById(99);

            // Assert
            var notFoundResult = (NotFoundObjectResult)result;
            var value = (dynamic)notFoundResult.Value;
            Assert.AreEqual("Contact with ID 99 not found.", value.Message);
        }

        [Test]
        public void AddContact_ValidContact_ReturnsCreatedAtAction()
        {
            // Arrange
            var newContact = new ContactDetails { ContactId = 1, FirstName = "John", LastName = "Doe", Email = "john.doe@example.com" };
            _mockContactRepository.Setup(repo => repo.AddContact(newContact)).Verifiable();

            // Act
            IActionResult result = _controller.AddContact(newContact);

            // Assert
            var createdAtActionResult = (CreatedAtActionResult)result;
            var value = (dynamic)createdAtActionResult.Value;
            Assert.AreEqual(newContact.ContactId, value.Contact.ContactId);
        }

        [Test]
        public void UpdateContact_ExistingContact_ReturnsOkResult()
        {
            // Arrange
            var updatedContact = new ContactDetails { ContactId = 1, FirstName = "John", LastName = "Doe", Email = "john.doe@example.com" };
            _mockContactRepository.Setup(repo => repo.UpdateContact(updatedContact)).Returns(updatedContact);

            // Act
            IActionResult result = _controller.UpdateContact(updatedContact);

            // Assert
            var okResult = (OkObjectResult)result;
            var value = (dynamic)okResult.Value;
            Assert.AreEqual(updatedContact.ContactId, value.UpdatedContact.ContactId);
        }

        [Test]
        public void UpdateContact_NonExistingContact_ReturnsNotFound()
        {
            // Arrange
            var updatedContact = new ContactDetails { ContactId = 99, FirstName = "John", LastName = "Doe", Email = "john.doe@example.com" };
            _mockContactRepository.Setup(repo => repo.UpdateContact(updatedContact)).Returns((ContactDetails)null);

            // Act
            IActionResult result = _controller.UpdateContact(updatedContact);

            // Assert
            var notFoundResult = (NotFoundObjectResult)result;
            Assert.AreEqual("Contact not found", (string)((dynamic)notFoundResult.Value).Message);
        }

        [Test]
        public void DeleteContact_ExistingId_ReturnsOkResult()
        {
            // Arrange
            _mockContactRepository.Setup(repo => repo.DeleteContact(1)).Returns(new ContactDetails());

            // Act
            IActionResult result = _controller.DeleteContact(1);

            // Assert
            var okResult = (OkObjectResult)result;
            Assert.AreNotEqual(okResult, null);
        }

        [Test]
        public void DeleteContact_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            _mockContactRepository.Setup(repo => repo.DeleteContact(99)).Returns((ContactDetails)null);

            // Act
            IActionResult result = _controller.DeleteContact(99);

            // Assert
            var notFoundResult = (NotFoundObjectResult)result;
            Assert.AreEqual("Contact not found", (string)((dynamic)notFoundResult.Value).Message);
        }


    }
}
