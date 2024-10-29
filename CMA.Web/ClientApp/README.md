# Project README

## Overview

This project includes components that are built in Angular, ASP.NET Core. The main focus include a interface for managing contacts supported with authorization for secure access along with exception handling and logging

## Technologies Used

- **Angular**: For building dynamic web applications.
- **ASP.NET Core**: For creating a RESTful API.
- **JSON**: For storing contacts in a file.
- **Dependency Injection**: Utilized for logging and service management.
- **Detailed Logging**: Logs request details, errors, and unauthorized access attempts for better debugging and monitoring.

## Features

### Angular Application

- **Contact Management**:
  - Provision for creating, editing and Deleting contacts.

### ASP.NET Core API for Contact Management

- **Contact Management Endpoints**:
  - **GET /Contact/GetContacts**: Retrieves a list of all contacts.
  - **GET /Contact/GetContactById**: Retrieves a specific contact by ID.
  - **POST /Contact/AddContact**: Adds a new contact to the list.
  - **PUT /Contact/UpdateContact**: Updates an existing contact's details.
  - **DELETE /Contact/DeleteContact**: Deletes a contact by ID.

- **Custom Error Handling Middleware**:
  - **CookieAuthMiddleware**: Custom middleware that handles authorization token processing and provides detailed error responses.

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 16 or higher. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: This comes bundled with Node.js. Verify your installation by running:
  ```bash
  node -v
  npm -v

**Installation**

**1.Clone the Repository:**

git clone <repository-url>
cd <repository-folder>

**2.Set Up Angular Client:**

Open:
cd CMA.Web\ClientApp.

Run
npm install.

**3.Set Up ASP.NET Core API:**

- Navigate back to the root directory:

- cd ..

- Restore the dependencies:

- dotnet restore

- Navigate to API project:

- cd ContactManagementApplication

- Run the API application:

- dotnet run

**4. Run API Unit test project:**

- Navigate to test project directory from root:

- cd ContactManagementApplication.Test

- Run the test project:

- dotnet test

**5. Run Angular test specs:**

- Navigate to client app from root directory:

- cd CMA.Web\ClientApp.

- Run angular test specs:

- ng test
