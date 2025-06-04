# Restaurant API

## Description

This is a REST API for managing a restaurant, built with Express.js and MySQL. It provides endpoints for user authentication, menu management, order placement, and table booking.

## Technologies Used

*   Node.js
*   Express.js
*   MySQL
*   bcryptjs
*   jsonwebtoken
  

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    *   Create a `.env` file in the root directory.
    *   Add the following environment variables:

        ```
        PORT=5000
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=""
        DB_NAME=restaurant_record
        JWT_SECRET=supersecretjwtkey
        ```

    *   Update the values with your actual database credentials and JWT secret.

4.  **Create the database:**

    *   Create a MySQL database named `restaurant_record`.
    *   Run the following SQL queries to create the necessary tables:

        ```sql
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'hotel_manager', 'customer') DEFAULT 'customer'
        );

        CREATE TABLE menus (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          image_url VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        CREATE TABLE orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          customer_id INT NOT NULL,
          order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          total_amount DECIMAL(10, 2) NOT NULL,
          status ENUM('pending', 'confirmed', 'preparing', 'delivered', 'cancelled') DEFAULT 'pending',
          FOREIGN KEY (customer_id) REFERENCES users(id)
        );

        CREATE TABLE order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          menu_item_id INT NOT NULL,
          quantity INT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders(id),
          FOREIGN KEY (menu_item_id) REFERENCES menus(id)
        );

        CREATE TABLE bookings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          customer_id INT NOT NULL,
          table_number INT NOT NULL,
          booking_date DATE NOT NULL,
          booking_time TIME NOT NULL,
          number_of_guests INT NOT NULL,
          status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES users(id)
        );
        ```

5.  **Start the server:**

    ```bash
    node server.js
    ```

## API Endpoints

### Authentication

*   **Register User** (`POST /api/auth/signup`)

    *   Description: Registers a new user.
    *   Request Body:

        ```json
        {
          "username": "newuser",
          "password": "password123",
          "role": "customer" (optional: "admin", "hotel_manager", "customer")
        }
        ```

    *   Response:

        ```json
        {
          "message": "User registered successfully",
          "token": "<JWT_token>"
        }
        ```

*   **Login** (`POST /api/auth/login`)

    *   Description: Logs in an existing user.
    *   Request Body:

        ```json
        {
          "username": "existinguser",
          "password": "password123"
        }
        ```

    *   Response:

        ```json
        {
          "message": "Login successful",
          "token": "<JWT_token>"
        }
        ```

### Menu Management

*   **Create Menu Item** (`POST /api/menus`)

    *   Description: Creates a new menu item (requires `hotel_manager` or `admin` role).
    *   Request Body:

        ```json
        {
          "name": "Pizza",
          "description": "Delicious pizza with tomato sauce and mozzarella",
          "price": 12.99,
          "image_url": "https://example.com/pizza.jpg"
        }
        ```

    *   Response:

        ```json
        {
          "message": "Menu item created successfully",
          "menuItemId": 1
        }
        ```

*   **Get All Menu Items** (`GET /api/menus`)

    *   Description: Retrieves all menu items (requires authentication).
    *   Response:

        ```json
        [
          {
            "id": 1,
            "name": "Pizza",
            "description": "Delicious pizza with tomato sauce and mozzarella",
            "price": "12.99",
            "image_url": "https://example.com/pizza.jpg",
            "created_at": "2024-02-09T00:00:00.000Z",
            "updated_at": "2024-02-09T00:00:00.000Z"
          }
        ]
        ```

*   **Get Menu Item by ID** (`GET /api/menus/:id`)

    *   Description: Retrieves a specific menu item by ID (requires authentication).
    *   Response:

        ```json
        {
          "id": 1,
          "name": "Pizza",
          "description": "Delicious pizza with tomato sauce and mozzarella",
          "price": "12.99",
          "image_url": "https://example.com/pizza.jpg",
          "created_at": "2024-02-09T00:00:00.000Z",
          "updated_at": "2024-02-09T00:00:00.000Z"
        }
        ```

*   **Update Menu Item** (`PUT /api/menus/:id`)

    *   Description: Updates a menu item (requires `hotel_manager` or `admin` role).
    *   Request Body:

        ```json
        {
          "name": "Updated Pizza",
          "description": "Delicious pizza with tomato sauce and extra mozzarella",
          "price": 13.99,
          "image_url": "https://example.com/updated_pizza.jpg"
        }
        ```

    *   Response:

        ```json
        {
          "message": "Menu item updated successfully"
        }
        ```

*   **Delete Menu Item** (`DELETE /api/menus/:id`)

    *   Description: Deletes a menu item (requires `hotel_manager` or `admin` role).
    *   Response:

        ```json
        {
          "message": "Menu item deleted successfully"
        }
        ```

### Orders

*   **Create Order** (`POST /api/orders`)

    *   Description: Creates a new order (requires authentication).
    *   Request Body:

        ```json
        {
          "order_items": [
            {
              "menu_item_id": 1,
              "quantity": 2
            },
            {
              "menu_item_id": 2,
              "quantity": 1
            }
          ]
        }
        ```

    *   Response:

        ```json
        {
          "message": "Order created successfully",
          "order_id": 1
        }
        ```

*   **Get Order Details** (`GET /api/orders/:id`)

    *   Description: Retrieves order details by ID (requires authentication). Customers can only view their own orders. Hotel managers and admins can view all orders.
    *   Response:

        ```json
        {
          "order": {
            "id": 1,
            "customer_id": 1,
            "order_date": "2024-02-09T00:00:00.000Z",
            "total_amount": "38.97",
            "status": "pending"
          },
          "order_items": [
            {
              "id": 1,
              "order_id": 1,
              "menu_item_id": 1,
              "quantity": 2,
              "price": "12.99"
            },
            {
              "id": 2,
              "order_id": 1,
              "menu_item_id": 2,
              "quantity": 1,
              "price": "12.99"
            }
          ]
        }
        ```

*   **Update Order Status** (`PUT /api/orders/:id`)

    *   Description: Updates the status of an order (requires `hotel_manager` or `admin` role).
    *   Request Body:

        ```json
        {
          "status": "confirmed"
        }
        ```

    *   Response:

        ```json
        {
          "message": "Order status updated successfully"
        }
        ```

### Bookings

*   **Create Booking** (`POST /api/bookings`)

    *   Description: Creates a new table booking (requires authentication).
    *   Request Body:

        ```json
        {
          "table_number": 5,
          "booking_date": "2024-02-10",
          "booking_time": "19:00:00",
          "number_of_guests": 4
        }
        ```

    *   Response:

        ```json
        {
          "message": "Booking created successfully",
          "booking_id": 1
        }
        ```

*   **Get Booking Details** (`GET /api/bookings/:id`)

    *   Description: Retrieves booking details by ID (requires authentication). Customers can only view their own bookings. Hotel managers and admins can view all bookings.
    *   Response:

        ```json
        {
          "id": 1,
          "customer_id": 1,
          "table_number": 5,
          "booking_date": "2024-02-10",
          "booking_time": "19:00:00",
          "number_of_guests": 4,
          "status": "pending",
          "created_at": "2024-02-09T00:00:00.000Z"
        }
        ```

*   **Cancel Booking** (`DELETE /api/bookings/:id`)

    *   Description: Cancels a booking (requires authentication). Customers can only cancel their own bookings. Hotel managers and admins can cancel all bookings.
    *   Response:

        ```json
        {
          "message": "Booking cancelled successfully"
        }
        ```

## Authentication

*   All authenticated endpoints require a valid JWT token in the `Authorization` header.
*   The token must be prefixed with `Bearer `.
*   Example: `Authorization: Bearer <JWT_token>`

## Role-Based Access Control

*   Some endpoints require specific user roles (`admin`, `hotel_manager`).
*   The `authorize` middleware is used to enforce role-based access control.

## Error Handling

*   The API returns appropriate HTTP status codes for different error conditions.
*   Error messages are included in the response body.

## Contributing

*   Feel free to contribute to this project by submitting pull requests.

## License

*   [ISC](LICENSE)
