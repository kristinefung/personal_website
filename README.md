# Personal Website

A full-stack personal website built with [Next.js](https://nextjs.org), TypeScript, Prisma, and MySQL. This project features a modular architecture for managing profiles, projects, journeys, technologies, and enquiries, with authentication and an admin dashboard.

## Features

- **Next.js** app with TypeScript
- **Prisma ORM** for MySQL database
- **Authentication** and user sessions
- **Admin dashboard** for managing content
- **API endpoints** for profile, projects, journeys and enquiries
- **State management** with Zustand
- **Component-based UI** (React)
- **Dockerized** for easy deployment
- **Jest** for unit testing

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MySQL database
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kristinefung/personal_website.git
   cd personal_website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your database credentials and secrets.

4. **Set up the database:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm start
```

### Docker

To build and run the app in Docker:
```bash
docker build -t personal-website .
docker run -p 3000:3000 --env-file .env personal-website
```

## Project Structure

```
src/
|_ app/           # Next.js app directory (pages, API routes)
|_ component/     # React components
|_ service/       # API and business logic
|_ store/         # Zustand stores for state management
|_ types/         # TypeScript types
|_ lib/           # Utilities, validation, and Prisma client
|_ test/          # Unit tests
prisma/
|_ schema.prisma  # Database schema
|_ migrations/    # Database migrations
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

