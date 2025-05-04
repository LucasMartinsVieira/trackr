# 🛠️ Trackr – Backend

This is the back-end service for **Trackr**, a reading tracker web application. Built with **Java 17** and **Spring Boot**, the API provides all functionality for user authentication, book CRUD operations, and external book metadata fetching via the **Open Library API**.

## 🧱 Key Responsibilities

- ✅ User Registration & Login
- 🔐 JWT-based Authentication
- 📚 CRUD for Books
- 🔄 Book Status Management (Reading, Completed, Want to Read, Paused, Dropped)
- 🌐 **Open Library API** integration for metadata (covers, authors, publish date, etc.)
- 🧱 Layered architecture: `Controller → Service → Repository → Entity`
- ⚠️ Exception Handling with custom errors

## 🧰 Technologies

- **Java 17**
- **Spring Boot**
- **Spring Security + JWT**
- **PostgreSQL + JPA (Hibernate)**
- **Flyway** for DB migrations
- **Open Library API**
- **Docker**

## 🌐 API Overview

|           Endpoint            | Method |               Description                |
| ----------------------------- | ------ | ---------------------------------------- |
| `/auth/register`              | POST   | Register a new user and return JWT       |
| `/auth/login`                 | POST   | Authenticate and return JWT              |
| `/auth/me`                    | GET    | Get the authenticated user information   |
| `/auth/delete/{id}`           | DELETE | Delete user                              |
| `/books`                      | GET    | List all user books                      |
| `/books`                      | POST   | Add a book                               |
| `/books/{id}`                 | GET    | Get book by ID                           |
| `/books/{id}`                 | PUT    | Update a book                            |
| `/books/{id}`                 | PATCH  | Update book reading status               |
| `/books/{id}`                 | DELETE | Delete a book                            |
| `/books/search`               | GET    | Search for a book in the openlibrary api |
| `/books/search/{id}/editions` | GET    | Search for editions from a Work id       |
| `/books/search/{id}/edition`  | GET    | Get edition information                  |


> This project has a [swagger](https://www.swagger.io) documentation, access in http://localhost:8080/swagger-ui.html

## 🔒 Authentication

All endpoints (except auth) are protected using JWT.  
Include the token in the `Authorization` header:

`Authorization: Bearer <token>`

## 🚀 Running Locally

Using Docker

```
docker build -t trackr-api .
docker run -p 8080:8080 --env-file .env trackr-api
```

## 📚 Open Library Integration

When adding a book by ISBN or title, Trackr attempts to fetch book metadata from the [Open Library API](https://openlibrary.org/developers/api). This enriches the book entry with additional information like author, cover image, and publish date.

## 📂 Project Structure

```
├── api/
│ ├── controllers/ # REST Controllers
│ ├── dtos/ # Request/response models
│ ├── external/ # OpenLibrary API client + models
│ └── mappers/ # DTO to domain mappers
├── domain/ # Core domain entities & enums
├── infra/
│ ├── exception/ # Custom exceptions + handler
│ ├── security/ # JWT auth config
│ └── springdoc/ # API docs config
├── repositories/ # Spring Data JPA Repositories
├── services/ # Business logic services
└── TrackrApplication.java # Main entry point
```