# FindReunite Project

## Introduction

FindReunite is a web application designed to assist in reuniting missing persons with their families. The platform allows users to register, search for missing and found persons, and receive notifications when a match is found.

## Live Preview

[FindReunite Live Preview](https://find-reunite.vercel.app/)

## GitHub Repository

[FindReunite GitHub Code](https://github.com/muhammad-ahmad66/findReunite)

## Objectives / Goals

- Develop a user-friendly interface for searching and reporting missing persons.
- Implement a robust backend to handle user data and image processing.
- Ensure secure authentication and authorization using JWT.
- Notify users via email when a potential match is found.

## Requirements

- Node.js
- Express.js
- MongoDB
- HTML, CSS, JavaScript
- Vercel for deployment

## Project Design

### Conceptual / Logical Design

#### ERD, USE CASES

- **Entities**: Users, MissingPersons, FoundPersons, Locations
- **Use Cases**: Register, Login, logout, update profile settings, change password, Report Missing Person, Report Found Persons, Search Person by Name, Search Person by Image, Apply Filters (age, gender, region etc), Sort Results(by name, by age), View User Dashboard, View Admin Dashboard, Update/Delete reported Missing & Found Person, Generate Statistics & Reports, Convert Reports to PDF and Download it, Manage Users, Make user an Admin, Upload, Resize and compare images, Protect and Restrict Routes vie JWT tokens, Retrieve Locations from user device, Receive Email when sigh up and potential match found and handling different types of Errors.

### Physical Design

#### Backend Design (Database)

- MongoDB for storing user, missing person, and found person data.
- Embedded collections for location data.

### Front End Design

- HTML for structure
- CSS for styling
- JavaScript for interactivity

## Tools

- VS Code
- Postman for API testing
- Git for version control
- Vercel for deployment

## Implementation Decisions

### Architecture Choice (MVC)

MVC (Model-View-Controller) architecture was selected to structure both the backend API and the frontend application. This decision facilitates separation of concerns: Models manage data representation and business logic (e.g., MongoDB schemas), Views handle user interface presentation (HTML/CSS/JS), and Controllers orchestrate interactions between Models and Views, as well as manage API endpoints.

### Backend Framework (Node.js with Express)

Node.js was chosen for its efficiency in handling asynchronous operations, making it suitable for building scalable and high-performance APIs. Express.js complements Node.js by providing a robust framework for routing, middleware integration, and handling HTTP requests and responses. And also use Pug as a template engine.

### Strong Authentication and Authorization

To ensure secure authentication and authorization, we implemented JWT (JSON Web Tokens). JWTs authenticate users and authorize access to protected endpoints. Below is an example of how to use API endpoints with JWT in JavaScript:

1. **Get JWT Token:**

    ```javascript
    let token = 'YOUR_TOKEN';
    fetch('{{domain}}api/v1/users/signup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'yourpassword'
        passwordConfirm: 'yourpassword'
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => console.error('Error:', error));
    ```

### Frontend Technologies

HTML, CSS, and JavaScript form the core technologies for developing the frontend application. HTML provides the structure of web pages, CSS styles the presentation, and JavaScript enhances interactivity and dynamic behavior, communicating with the backend API to fetch and manipulate data.

<!-- ## Screenshots of Your System

*(Include screenshots of different parts of your application here)* -->

## Contributions (Achieved Objectives / Goals)

- Successfully implemented user registration, login, and profile management.
- Developed functionalities for reporting missing and found persons.
- Integrated image upload and face comparison features.
- Set up email notifications for matched persons.
- Deployed the application on Vercel for live access.

## Developer Team

- **Name**: Muhammad Ahmad
  - **Email**: <muhammadugv66@gmail.com>
- **Name**: Hamid Ali
  - **Email**: <creative@gmail.com>
- **Name**: Hamid Ali Raza
  - **Email**: <himdaliraza@gmail.com>

Feel free to reach out to us for any questions or collaboration opportunities.

---

This README.md provides an overview of the FindReunite project, including its design, implementation, and usage details. For more information, please refer to the live preview or the GitHub repository.
