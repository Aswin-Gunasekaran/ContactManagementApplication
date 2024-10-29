
# Project README

## Overview
This project is developed using Angular and ASP.NET Core, to build a user-friendly interface for managing contacts. Custom middleware is implemented for ensuring secure authorization and error handling

## Technologies Used
- **Angular**: For building web applications.
- **ASP.NET Core**: Used for creating a RESTful API to manage contacts.
- **JSON**: To store contact data.
- **Dependency Injection**: Applied for managing logging and services.
- **Detailed Logging**: Logs requests, errors, and unauthorized access attempts to aid debugging and monitoring.

## Features

### Angular Application
- **Contact Management**:
  - Modals for creating,editing and deleting contacts.

### ASP.NET Core API for Contact Management
- **Endpoints**:
  - `GET /Contact/GetContacts`: Retrieves all contacts.
  - `GET /Contact/GetContactById`: Retrieves a specific contact by ID.
  - `POST /Contact/AddContact`: Adds a new contact.
  - `PUT /Contact/UpdateContact`: Updates an existing contact.
  - `DELETE /Contact/DeleteContact`: Deletes a contact by ID.

- **Custom Middleware**:
  - **Authorization Middleware**: Manages authorization and detailed error responses.
  - **Global Expection Middleware**:  It handles unhandled exception and masks them with custom and user friendly error message.

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

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

**4. Add API base url to angular project config**

- Get the base url of the API project and configure it in the  'environment.prod.ts' and 'environment.ts' file in the location 'CMA.Web\ClientApp\src\environments'

- The base url config name is 'apiBaseUrl'

**5. Run API Unit test project:**

- Navigate to test project directory from root:

- cd ContactManagementApplication.Test

- Run the test project:

- dotnet test

**6. Run Angular test specs:**

- Navigate to client app from root directory:

- cd CMA.Web\ClientApp.

- Run angular test specs:

- ng test