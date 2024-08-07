# findReunite

## Introduction

findReunite is a web application designed to improve the search and reunification process for missing persons worldwide. It offers a user-friendly interface and advanced search functionalities, including image recognition, to address gaps in existing systems.

## Table of Contents

- [Introduction](#introduction)
- [Objectives](#objectives)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Objectives

- Provide a global platform for reporting and searching for missing persons.
- Enhance search capabilities with image recognition.
- Ensure a user-friendly interface accessible to users of all technical backgrounds.
- Facilitate direct contact between users and reporters of missing persons.
- Provide real-time notifications for updates and potential matches.

## Features

- **Global Reach:** Supports searches and reports from users worldwide.
- **User-Friendly UI:** Simple and intuitive interface.
- **Search by Image:** Upload photos to find potential matches based on visual similarities.
- **Direct Contact:** Users can directly contact the individual who reported a missing person.
- **Real-Time Notifications:** Immediate email notifications for updates and matches.

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB

### Frontend

- HTML
- CSS
- JavaScript

### Tools

- Visual Studio Code
- Postman
- Git

### Security

- JWT (JSON Web Tokens) for authentication and authorization

## MVC Architecture

The findReunite application follows the MVC (Model-View-Controller) architecture pattern:

- **Model:** Manages data representation and business logic, using MongoDB schemas for data storage.
- **View:** Handles the presentation layer, rendering HTML/CSS/JS for user interaction.
- **Controller:** Manages the flow of data between models and views, handling HTTP requests and responses, and defining API endpoints.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/findReunite.git
    cd findReunite
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the following:

    ```env
    PORT=8000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    EMAIL_SERVICE=your_email_service
    EMAIL_USER=your_email_user
    EMAIL_PASS=your_email_password
    ```

4. **Start the application:**

    ```bash
    npm start
    ```

## Usage

- **Homepage:** Browse the homepage to understand the platform's purpose.
- **Search for Missing Persons:** Use the search feature to find missing persons based on name, description, or image.
- **Report a Missing Person:** Submit a report with details and an image of the missing person.
- **Notifications:** Receive email notifications for updates and matches.

## API Endpoints

### User Endpoints

- **Register User:** `POST /api/users/register`
- **Login User:** `POST /api/users/login`
- **Get User Profile:** `GET /api/users/profile`

### Missing Persons Endpoints

- **Report Missing Person:** `POST /api/missing`
- **Search Missing Persons:** `GET /api/missing/search`

### Found Persons Endpoints

- **Report Found Person:** `POST /api/found`
- **Search Found Persons:** `GET /api/found/search`

### Admin Endpoints

- **Get All Users:** `GET /api/admin/users`
- **Make User Admin:** `PUT /api/admin/users/:id/admin`
- **Delete User:** `DELETE /api/admin/users/:id`

## Email Notifications

When a potential match is found between a missing person and a found person, the system sends an email notification to the user. This ensures timely updates and allows users to take immediate action.

## Testing

- **Black-Box Testing:** User interface testing, API endpoint testing using Postman.
- **White-Box Testing:** Unit testing for backend logic and functions.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for using findReunite! We hope our platform helps in reuniting missing persons with their loved ones.
