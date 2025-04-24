# Ecstasy Event Management System

A web-based event management application built with Node.js, Express, and MySQL that allows users to create, view, edit, and delete events.

## Features

- View all events in a tabular format
- View detailed information about specific events
- Add new events with ID, name, date, and time
- Edit existing event details
- Delete events with confirmation

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: EJS (Embedded JavaScript Templates), HTML, CSS
- **Database**: MySQL
- **Other Tools**: nodemon for development

## Project Setup

### Prerequisites

- Node.js (Latest LTS version recommended)
- MySQL Server

### Installation Steps

1. Clone the repository
   ```
   git clone <repository-url>
   cd event-management
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up the MySQL database
   - Create a database named `event_management`
   - Set up the following tables:
     ```sql
     CREATE TABLE event (
       id VARCHAR(50) PRIMARY KEY,
       name VARCHAR(255) NOT NULL
     );
     
     CREATE TABLE event_schedule (
       id VARCHAR(50),
       date DATE NOT NULL,
       time TIME NOT NULL,
       FOREIGN KEY (id) REFERENCES event(id) ON DELETE CASCADE
     );
     ```

4. Configure the database connection in `index.js` if needed:
   ```javascript
   const connection = mysql.createConnection({
     host: "localhost",
     user: "root",
     password: "your-password",
     database: "event_management",
   });
   ```

5. Start the application
   ```
   node index.js
   ```
   or with nodemon:
   ```
   npx nodemon index.js
   ```

6. Access the application at `http://localhost:8080`

## Application Structure

- **index.js** - Main application file with Express server and routes
- **views/** - EJS templates
  - **home.ejs** - Main page displaying all events
  - **show.ejs** - Detailed view of a specific event
  - **add.ejs** - Form to add a new event
  - **edit.ejs** - Form to edit an existing event
  - **delete.ejs** - Confirmation page for event deletion
- **public/styles/** - CSS files
  - **style.css** - Main stylesheet

## API Routes

- `GET /` - Home page showing all events
- `GET /show/:id` - Show details for a specific event
- `GET /add` - Display the add event form
- `POST /add` - Create a new event
- `GET /edit/:id` - Display the edit form for an event
- `POST /edit/:id` - Update an event
- `GET /delete/:id` - Display delete confirmation
- `POST /delete/:id` - Delete an event

## License

This project is licensed under the MIT License.
