
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
Ensure the following are installed:

- **Node.js** (version 16 or higher): Download from [nodejs.org](https://nodejs.org).
- **npm**: Comes bundled with Node.js. Verify installation by running:
  ```bash
  node -v
  npm -v
  ```

### Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Set Up Angular Client**:
   ```bash
   cd clientApp
   npm install
   ```

3. **Set Up ASP.NET Core API**:
   - Navigate back to the root directory:
     ```bash
     cd ..
     ```
   - Restore dependencies:
     ```bash
     dotnet restore
     ```
   - Run the API application:
     ```bash
     dotnet run
     ```
