# Gawekeun | Job Tracker

Welcome to my very first fullstack project, Gawekeun!, it's a website for tracking our jobs vacancies using system like kanban board. This project is build using Nextjs, React, GSAP, Redix for the frontend tech stack, and Express, Postgre, Supabase, Prisma for backend tech stack.

# Background Application

Seventh semester arrives like a storm —
the campus calls for internships as the next step in our journey.
Job vacancies scatter like leaves in the wind —
some caught, some lost, and many still drifting in the unknown.

For those still waiting, time becomes tangled.
Between studying, working, family moments, and silent hopes,
it’s easy to lose track — to forget which doors have been knocked on,
which are still unopened.

Gawekeun is born from this chaos —
a gentle compass in the whirlwind.
With a simple drag-and-drop,
it helps you trace your steps, organize your path,
and bring clarity to the noise.

# 🎯 Gawekeun | Job Application Tracker

<div align="center">

![Gawekeun Logo](public/logo-transparent.png)

**A modern, intuitive job application tracking system with Kanban board interface**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

</div>

---

## 📖 Background Story

> *Seventh semester arrives like a storm — the campus calls for internships as the next step in our journey. Job vacancies scatter like leaves in the wind — some caught, some lost, and many still drifting in the unknown.*

**Gawekeun** (Indonesian: "work") is born from the chaos of job hunting. When applications pile up and deadlines blur together, it's easy to lose track of which doors you've knocked on and which opportunities are still waiting.

This project serves as a **gentle compass in the whirlwind** — helping students and job seekers organize their applications, track progress, and bring clarity to the job search process.

*Dedicated to all my colleagues navigating the same journey toward their dream internships and careers! 🚀*

---

## ✨ Features

### 🎨 **Kanban Board Interface**
- **Drag & Drop**: Intuitive card movement between status columns
- **Real-time Updates**: Optimistic UI with instant visual feedback
- **Status Tracking**: Applied → Interviewing → Offered → Rejected/Withdrawn

### 🔍 **Advanced Search & Filtering**
- **Smart Search**: Find applications by company, position, or notes
- **Multi-filter Support**: Filter by status, job type, and more
- **Sorting Options**: Sort by date, company, position, or status
- **Real-time Results**: Instant filtering as you type

### 📧 **Smart Reminder System**
- **Email Notifications**: Automated reminders sent to your inbox
- **Customizable Timing**: Set reminder dates for follow-ups
- **Professional Templates**: Beautiful HTML email templates
- **Timezone Support**: Configurable timezone settings

### 📁 **File Management**
- **Document Upload**: Store resumes, cover letters, portfolios
- **Drag & Drop Interface**: Easy file uploads with progress tracking
- **File Organization**: Categorize files by type (Resume, Certificate, etc.)
- **Download & Share**: Easy access to your documents

### 🔐 **Secure Authentication**
- **Supabase Integration**: Enterprise-grade authentication
- **JWT Tokens**: Secure session management
- **Route Protection**: Protected dashboard and API routes

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Smooth interactions on mobile devices
- **Modern UI**: Clean, professional interface with Tailwind CSS

---

## 🛠️ Tech Stack

### **Frontend**
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[React 18](https://reactjs.org/)** - UI library with hooks
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - State management
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[@dnd-kit](https://dndkit.com/)** - Drag and drop functionality
- **[React Hot Toast](https://react-hot-toast.com/)** - Toast notifications

### **Backend**
- **[Express.js](https://expressjs.com/)** - Node.js web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe backend development
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Supabase](https://supabase.com/)** - Authentication and database hosting

### **Additional Tools**
- **[Nodemailer](https://nodemailer.com/)** - Email service
- **[Node-cron](https://github.com/node-cron/node-cron)** - Task scheduling
- **[Multer](https://github.com/expressjs/multer)** - File upload handling
- **[JWT](https://jwt.io/)** - JSON Web Tokens for authentication

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v15 or higher)
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/farhankarisma/gawekeun-job-tracker.git
cd gawekeun-job-tracker
```

2. **Install dependencies**

For the **backend**:
```bash
cd server
npm install
```

For the **frontend**:
```bash
cd client
npm install
```

### Environment Setup

3. **Backend environment variables**

Copy the example environment file and update with your values:

```bash
cd server
cp .env.example .env
```

Update the `.env` file with your actual values:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gawekeun_db"
DIRECT_URL="postgresql://username:password@localhost:5432/gawekeun_db"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# Email Configuration
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"

# JWT
JWT_SECRET="your_super_secret_jwt_key"
```

4. **Frontend environment variables**

Copy the example environment file and update:

```bash
cd client
cp .env.example .env.local
```

Update the `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3001"
```

### Database Setup

5. **Initialize the database**
```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### Running the Application

6. **Start the backend server**
```bash
cd server
npm run dev
```
Backend will run on `http://localhost:3001`

7. **Start the frontend application**
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:3000`

## 👨‍💻 Author

**Farhan Karisma**
- GitHub: [@farhankarisma](https://github.com/farhankarisma)
- LinkedIn: [Farhan Karisma](https://linkedin.com/in/farhankarisma)

---

<div align="center">

### 🌟 If this project helped you, please give it a star! ⭐

**Made with ❤️ for the job-hunting community**

</div>
