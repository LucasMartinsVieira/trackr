# 📚 Trackr

Trackr is a fullstack web application designed to help users keep track of the books they're reading, plan to read, have completed, paused, or dropped. This project was built to demonstrate robust back-end development with Java and Spring Boot, along with a responsive and modern front-end built with Next.js.

## 🔧 Tech Stack Overview

### 🖥️ Front-End
- **Next.js (React)**
- Tailwind CSS
- Shadcn/ui

### 🔗 Back-End
- **Java 17 + Spring Boot**
- PostgreSQL
- JWT Authentication
- JPA (Hibernate)
- Bean Validation
- Integration with **[Open Library API](https://openlibrary.org)**

👉 **Back-end has its own README**:  
[📁 View Backend README](./api/README.md)

---

## 📦 Dockerized Setup

To run the full application with Docker:

```bash
docker compose up --build
```


Before doing so, make sure to create a `.env` file in the project root with the following content:

```env
# PostgreSQL Configuration
POSTGRES_DB=trackr-db
POSTGRES_USER=trackr-user
POSTGRES_PASSWORD=trackr-password

# Java Backend Configuration
DB_URL=jdbc:postgresql://db:5432/trackr-db
JWT_SECRET=secret

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://0.0.0.0:8080
```

> These environment variables are used to configure the PostgreSQL container, the Spring Boot backend, and the frontend API integration.

## 📸 Feature Walkthroughs (Videos)

- 📝 Adding a Book
![Adding a Book](./.github/assets/page-add.gif)

- 📖 Book Details Page
![Book Details Page](./.github/assets/details-page.png)

- 📚 Books List Page
![Book List Page](./.github/assets/list-page.png)

- ✍️ Book Edit Page
![Book Edit Page](./.github/assets/page-edit.gif)

---

Stay tuned for more updates and features in the next version!
