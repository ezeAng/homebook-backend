# Homebook Backend API

## Overview

This README provides a comprehensive guide to the backend API for "Homebook," a robust and scalable application built using NodeJS and connected to a MySQL database. 
This backend is designed to support the main "Homebook" app, handling data management and API endpoint creation to ensure seamless data flow and functionality.

## Features

- **NodeJS Framework**: Utilizes the power and efficiency of NodeJS for server-side operations.
- **MySQL Database Integration**: Connects with a MySQL database for robust and reliable data storage.
- **API Endpoint Creation**: Offers a variety of API endpoints to interact with the "Homebook" app, ensuring seamless data retrieval and manipulation.
- **Security**: Implements essential security measures to protect data and user information.


## API Documentation

Here is an overview of the available API endpoints:
- login
- signup
- likes
- profiles

### User Management

- **Create User**: `POST /api/users`
- **Login**: `POST /api/users/login`
- **Get User Profile**: `GET /api/users/:id`

### More endpoints can be added as per the application requirements.

## Database Schema

The MySQL database schema is designed to efficiently store and manage the required data. It includes tables for users, profiles of designers, user likes etc.


## License

This project is licensed under [license-name]. For more details, see the `LICENSE` file in the repository.

---

For any queries or further documentation, please refer to the main "Homebook" app documentation or contact the project maintainers.
