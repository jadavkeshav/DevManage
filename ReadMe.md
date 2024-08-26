# DevManage

**DevManage** is a comprehensive project management and developer portfolio application designed to help developers and administrators efficiently manage projects and track earnings. It provides features for user profile management, project details, and earnings overview, all wrapped in a modern and responsive user interface.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Profiles**:

  - View and edit personal details, including name, phone number, and username.
  - Update profile picture with a customizable gradient background and initials.
- **My Projects**:

  - View a list of projects associated with the user.
  - Each project card displays project name, description, price, and a link to the project.
  - Responsive design for both desktop and mobile views.
- **Money Earned**:

  - Track total earnings from all projects.
  - Display earnings in a formatted currency style.
- **Project Management**:

  - Add, update, and delete projects with ease.
  - Admin users have the ability to manage all users and their projects.
- **Search and Filter**:

  - Search for projects by name or description.
  - Filter projects based on criteria such as status or price.
- **Notifications and Toasts**:

  - Get real-time notifications for actions like profile updates and project changes.
  - Display success and error messages using `react-hot-toast`.
- **Responsive Design**:

  - Optimized for a smooth experience on both desktop and mobile devices.
  - Use of Material-UI for consistent styling and layout.
- **Security**:

  - JWT (JSON Web Tokens) for secure user authentication and authorization.
  - Passwords are hashed and securely stored using bcrypt.
- **User Roles**:

  - Differentiate access levels between `admin` and `developer`.
  - Admins can manage users and their associated projects.

## Technologies

- **Frontend**: React, Material-UI, Axios
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS-in-JS with Material-UI
- **Utilities**: `react-hot-toast` for notifications

## Installation

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/devmanage.git
   ```
2. Navigate to the backend directory:

   ```bash
   cd devmanage/backend
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Set up environment variables. Create a `.env` file in the root directory and add:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
5. Start the server:

   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the `frontend` directory and add:

   ```env
   VITE_BASE_URL=http://localhost:5000
   ```
4. Start the development server:

   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173` to view the application.
2. You can log in with your credentials or register a new account if you're a new user.
3. Explore features such as viewing and managing projects, checking total earnings, and editing your profile.

## API Endpoints

### User Endpoints

- **GET /users/profile**

  - Description: Retrieve user profile information.
  - Headers: `Authorization: Bearer <token>`
- **PUT /users/profile**

  - Description: Update user profile details.
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name, phone, userName }`
- **GET /users/get-projects**

  - Description: Retrieve projects associated with the user.
  - Headers: `Authorization: Bearer <token>`
- **GET /users/get-total-earnings**

  - Description: Retrieve the total earnings of the user.
  - Headers: `Authorization: Bearer <token>`

## Contributing

We welcome contributions to the DevManage project. If you'd like to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
