# Ticket Management System

A full-stack ticketing and support workflow platform built for real business operations. It supports role-based access for customers, agents, managers, and admins, enabling structured ticket submission, assignment, approval, escalation, and resolution.

## Overview

This project simulates a modern support system where different user roles collaborate to manage requests efficiently:

- Customers submit and track tickets
- Agents work on and resolve assigned issues
- Managers review and approve/reject tickets
- Admins manage users and role assignments

The application is built using a Node.js + Express backend, PostgreSQL database, and a static HTML/CSS/JS frontend served through Nginx.

## Features

- Role-based authentication and authorization
- Secure login with bcrypt password hashing and JWT tokens
- Ticket creation, updates, comments, and status tracking
- Manager approval/rejection workflow
- Agent assignment and escalation flows
- Admin user-role management
- PostgreSQL-backed persistence
- Dockerized setup for local and deployment environments
- Render-ready deployment configuration

## Tech Stack

- Frontend: HTML, CSS, JavaScript, Nginx
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Auth: JWT, bcrypt
- Deployment: Docker, Docker Compose, Render

## Project Structure

```text
.
├── backend/
│   └── backend/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── index.js
│       └── package.json
├── frontend/
│   ├── css/
│   ├── js/
│   ├── pages/
│   ├── index.html
│   └── nginx.conf
├── docker-compose.yml
├── new_ticket.sql
├── render.yaml
├── .env.example
├── README.md
└── init-db.sh
```

## Getting Started

### With Docker Compose

```bash
docker compose up -d
```

Access the app at:

- Frontend: http://localhost
- Backend API: http://localhost:5001
- Database: localhost:5432

### Backend locally

```bash
cd backend/backend
npm install
npm run dev
```

## Default Admin Login

```text
Email: atharrv@gmail.com
Password: Admin@123
```

## Why this project is valuable

This project demonstrates practical full-stack engineering skills including:

- REST API development
- Secure authentication and authorization
- Database design and data modeling
- Business workflow logic
- Role-based access control
- Frontend dashboard development
- Docker and deployment readiness

## Recruiter-Friendly Summary

This project showcases the ability to build a real-world, workflow-driven application from end to end. It combines business logic, secure backend services, and a functional user interface to solve a real operational need: managing support tickets across multiple roles with clear accountability and governance.
