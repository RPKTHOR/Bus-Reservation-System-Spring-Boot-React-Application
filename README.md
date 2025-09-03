# Bus-Reservation-System-Spring-Boot-React-Application
# 🚌 Bus Reservation System

A comprehensive web-based bus ticket reservation system built with Spring Boot and React. This system eliminates the hassles of traditional bus booking by providing real-time seat availability, secure payments, and instant e-ticket generation.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Bus Reservation System is a modern solution that addresses common problems in traditional bus booking:

- **Eliminates long queues** - Book tickets online anytime
- **Prevents overbooking** - Real-time seat management with 10-minute hold system
- **Secure payments** - Industry-standard payment processing
- **Instant tickets** - Digital e-tickets with QR codes
- **Mobile-friendly** - Responsive design for all devices

### Who Can Use This System?

- **Customers**: Book tickets, select seats, manage bookings
- **Administrators**: Manage buses, routes, schedules, and view reports
- **Support Staff**: Assist customers with their reservations

## ✨ Features

### For Customers
- 🔍 **Smart Trip Search** - Search by source, destination, and date
- 💺 **Visual Seat Selection** - Interactive seat map with real-time availability
- 💳 **Secure Payments** - Multiple payment methods with secure processing
- 🎫 **Digital Tickets** - Instant e-ticket generation with QR codes
- 📱 **Mobile Responsive** - Seamless experience across all devices
- 📊 **Booking Management** - View history, check status, cancel bookings

### For Administrators
- 🚌 **Fleet Management** - Add and manage buses with seat layouts
- 🗺️ **Route Planning** - Create routes with stops and timing
- 📅 **Trip Scheduling** - Schedule regular services with dynamic pricing
- 📈 **Business Intelligence** - Sales reports and analytics
- 👥 **User Management** - Customer support and account management

## 🛠 Technology Stack

### Backend
- **Spring Boot** - REST API development
- **Spring Security + JWT** - Authentication and authorization
- **MySQL** - Database management
- **JPA/Hibernate** - Object-relational mapping
- **Maven** - Dependency management
- **Swagger/OpenAPI** - API documentation

### Frontend
- **React.js** - User interface framework
- **React Router** - Navigation and routing
- **Bootstrap** - UI components and responsive design
- **Axios** - HTTP client for API calls
- **React Context** - State management

### Development Tools
- **Git** - Version control
- **Postman** - API testing
- **VS Code** - Development environment

## 🏗 System Architecture

```
Frontend (React)     ←→     Backend (Spring Boot)     ←→     Database (MySQL)
    │                           │                            │
    ├── Components              ├── Controllers              ├── Users
    ├── Pages                   ├── Services                 ├── Buses
    ├── Context                 ├── Repositories             ├── Routes
    ├── Services                ├── Security                 ├── Trips
    └── Utils                   └── Config                   ├── Bookings
                                                            └── Payments
```

## 🚀 Getting Started

### Prerequisites

- **Java 17+**
- **Node.js 16+**
- **React Vite 7+**
- **MySQL 8.0+**
- **Maven 3.6+**
- **Git**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bus-reservation-system.git
   cd bus-reservation-system
   ```

2. **Configure MySQL Database**
   ```sql
   CREATE DATABASE bus_reservation;
   ```

3. **Update application.properties**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bus_reservation
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   
   # JWT Configuration
   jwt.secret=your_jwt_secret_key
   jwt.expiration=86400000
   ```

4. **Run the backend**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

   Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API base URL**
   ```javascript
   // src/services/api.js
   const API_BASE_URL = 'http://localhost:8080/api/v1';
   ```

4. **Start the frontend**
   ```bash
   npm start
   ```

   Frontend will start on `http://localhost:3001`

### Default Admin Account
- **Email**: admin@busreservation.com
- **Password**: admin123

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/v1/auth/login` | User authentication | Public |
| POST | `/api/v1/auth/register` | User registration | Public |

### Bus Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/v1/buses` | Add new bus | Admin |
| GET | `/api/v1/buses` | List all buses | Admin |
| PUT | `/api/v1/buses/{id}` | Update bus | Admin |
| DELETE | `/api/v1/buses/{id}` | Delete bus | Admin |

### Trip & Booking

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/v1/trips/search` | Search available trips | Public |
| GET | `/api/v1/trips/{id}/seats` | Get seat layout | Public |
| POST | `/api/v1/bookings/hold` | Hold seats temporarily | Customer |
| POST | `/api/v1/payments/checkout` | Process payment | Customer |


## 📁 Project Structure

```
bus-reservation-system/
├── backend/
│   ├── src/main/java/com/busreservation/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/            # Data transfer objects
│   │   ├── entity/         # Database entities
│   │   ├── repository/     # Data access layer
│   │   ├── security/       # Authentication & authorization
│   │   └── service/        # Business logic
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql        # Initial data
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── context/       # Global state management
│   │   ├── services/      # API communication
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Helper functions
│   ├── package.json
│   └── README.md
├── docs/                  # Project documentation
├── README.md
└── .gitignore
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
- Import Postman collection from `/docs/api-collection.json`
- Base URL: `http://localhost:8080/api/v1`
- Include JWT token in Authorization header: `Bearer <token>`

## 🔧 Key Features Implementation

### Seat Hold System
- **10-minute temporary hold** prevents double booking
- Automatic release of expired holds
- Real-time seat availability updates

### Security Features
- JWT-based stateless authentication
- Role-based access control (Admin/Customer)
- Password encryption with BCrypt
- API rate limiting for search operations

### Payment Processing
- Secure payment gateway integration
- Transaction status tracking
- Automatic booking confirmation
- Payment failure handling with rollback

## 🚀 Deployment

### Production Environment Variables
```bash
# Database
DB_HOST=your_production_db_host
DB_PORT=3306
DB_NAME=bus_reservation_prod
DB_USERNAME=prod_user
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRATION=86400000

# Payment Gateway
PAYMENT_GATEWAY_KEY=your_gateway_key
PAYMENT_GATEWAY_SECRET=your_gateway_secret
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

- **Raja Pavan Karthik**
- **Project Type** - Full Stack React Batch Capstone Project

⭐ **Star this repository if it helped you!**
