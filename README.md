Product Review API

This is a REST API for managing users, products, and product reviews. It uses Node.js, Express, MongoDB, Mongoose, and MVC architecture.

The project does not include a frontend, authentication, or image uploads. Image fields store filenames or URLs only.

Project Structure

Models contain the database schemas.
Controllers contain the application logic.
Routes define the API endpoints.
App.js configures Express and error handling.
Server.js connects to MongoDB and starts the server.

Installation

Install Node.js and MongoDB. Open the project folder and run npm install.

Configuration

Create a file named .env and add the following values.

PORT equals 3000
MONGODB_URI equals your MongoDB connection string

Do not share your .env file or database credentials.

Start the Server

Use npm start to start the server.
Use npm run dev to start the server during development.

The API runs at http://localhost:3000/api/v1.

API Endpoints

Users use /users for create and list operations. Use /users/id for reading, updating, and deleting one user.

Products use /products for create and list operations. Use /products/id for reading, updating, and deleting one product.

Reviews use /reviews for create and list operations. Use /reviews/id for reading, updating, and deleting one review.

Sorting

The Users, Products, and Reviews list endpoints accept a sort query parameter.

Use a field name for ascending sorting, for example /products?sort=price.

Add a minus sign for descending sorting, for example /reviews?sort=-rating.

Separate fields with commas to sort by more than one field, for example /products?sort=category,-price.

Relationships

Each review stores userId and productId as Mongoose references to the User and Product collections. Review responses populate both fields so the related user and product data is included.

Testing

Import the Postman collection from the postman folder. Create a user first, then create a product. Use their IDs to create a review. Test the remaining read, update, and delete operations.

Also test missing fields, duplicate emails, duplicate product names, invalid values, malformed IDs, and nonexistent records.

Request Flow

The request moves from the route to the controller, then to the Mongoose model and MongoDB. The result returns through the controller as a JSON response.
