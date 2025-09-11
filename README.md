<div align="center">
  <img src="public/favicon.svg" alt="DataPoint Logo" width="120" height="120" />
  <h1>DataPoint Task Manager</h1>
  <p>A sleek, modern task management solution built with Vue 3, TypeScript, and Vite.</p>

  <div>
    <img src="https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3" />
    <img src="https://img.shields.io/badge/TypeScript-4.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </div>
</div>

---

## ✨ Features

- **📝 Task Management**: Create, update, and delete tasks with ease
- **🚥 Task Status**: Track tasks with color-coded status indicators (Pending, In Progress, Completed)
- **👤 User Authentication**: Secure login system with token-based authentication
- **🎨 Modern UI**: Sleek, responsive design with smooth animations
- **🔄 State Management**: Centralized state with Pinia for efficient data handling
- **📱 Mobile-Friendly**: Fully responsive design works on all devices

## 🚀 Live Demo

Check out the live application: [DataPoint Task Manager](https://datapoint-tasks.netlify.app/)

## 💻 Technologies Used

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript for type safety
- **Build Tool**: Vite for lightning-fast development
- **State Management**: Pinia for predictable state handling
- **HTTP Client**: Axios for API communication
- **Styling**: TailwindCSS with custom components
- **UI Components**: Custom-built Vue components
- **Authentication**: JWT (JSON Web Token) based auth

## 🚢 Deployment

This project is deployed using GitHub Pages through a GitHub Actions workflow:

- **CI/CD**: Automated GitHub Actions workflow handles the deployment process
- **Hosting**: GitHub Pages hosts the static build output
- **Configuration**: Vite is configured with the correct base path for GitHub Pages
- **Workflow**: On push to main branch, the app is built and deployed automatically
- **Zero Downtime**: Seamless deployment ensures the application is always available

The deployment workflow simplifies the process and ensures that the latest version is always available to users without manual intervention.

## 👤 User Workflow

The DataPoint Task Manager provides an intuitive experience for the end user:

1. **Authentication**:
   - Users begin at the login screen where they enter their credentials
   - The system validates credentials and establishes a secure session
   - Failed login attempts display clear error messages

2. **Task Management**:
   - Upon login, users are presented with their task dashboard
   - Tasks are visually organized by status with color coding:
     - Gray for Pending tasks
     - Amber/Orange for In Progress tasks
     - Green for Completed tasks
   - Overdue tasks are highlighted with a red indicator

3. **Task Operations**:
   - **Create**: Users can add new tasks via the "New Task" button
   - **Update**: Tasks can be edited by clicking the pencil icon button
   - **Delete**: Remove tasks when they're no longer needed
   - **Status Change**: Click the task status icon to cycle through status options
   - **View Details**: Expand tasks to see full descriptions and other details

4. **Profile Management**:
   - Access user profile options by clicking on the user's initials
   - Logout securely when finished

The interface is designed to be intuitive, with visual feedback for all actions and a responsive layout that works across desktop and mobile devices.

## 🏗️ Architecture & Solution Approach

### Architecture

This project follows a modern frontend architecture:

- **Component-Based Structure**: Modular Vue components for better maintainability
- **Centralized State Management**: Using Pinia stores for predictable data flow
- **API Layer Abstraction**: Dedicated API modules for backend communication
- **Type Safety**: TypeScript interfaces and types throughout the application
- **Responsive Design**: Mobile-first approach with TailwindCSS

### Solution Approach

The application was built with these principles in mind:

1. **User Experience Focus**: Clean, intuitive interface with minimal learning curve
2. **Performance Optimization**: Leveraging Vite for fast development and optimized builds
3. **Maintainability**: Clear code structure and separation of concerns
4. **Scalability**: Component architecture that can grow as new features are added
5. **Security**: Token-based authentication with secure storage practices

## 🔐 Authentication

This application uses JWT (JSON Web Tokens) for authentication:

- Access tokens for API requests
- Refresh tokens for obtaining new access tokens
- Automatic token refresh on expiration

## 📋 Project Structure

```
datapoint-ui/
├── .github/            # GitHub configuration
│   └── workflows/      # GitHub Actions workflows for CI/CD
│       └── deploy.yml  # Deployment workflow for GitHub Pages
├── public/              # Static assets
│   ├── favicon.svg      # SVG favicon
│   ├── icons/           # App icons for various platforms
│   └── site.webmanifest # Progressive Web App manifest
├── src/
│   ├── api/             # API integration
│   ├── assets/          # Project assets
│   ├── components/      # Vue components
│   │   ├── Login.vue    # Authentication component
│   │   ├── TaskForm.vue # Task creation form
│   │   └── Tasks.vue    # Main tasks component
│   ├── model/           # Data models
│   ├── routes/          # Vue router configuration
│   ├── store/           # Pinia stores
│   │   └── User.ts      # User state management
│   ├── App.vue          # Root component
│   ├── main.ts          # Application entry point
│   ├── style.css        # Global styles
│   └── types.ts         # TypeScript types/interfaces
├── index.html           # HTML template
└── vite.config.ts       # Vite configuration
```

## 🔄 GitHub Workflow

The application is automatically deployed using a GitHub Actions workflow:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "16"

      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: dist
```

This workflow runs automatically when changes are pushed to the main branch, building and deploying the application to GitHub Pages.

---

<div align="center">
  <p>Made with ❤️ for DataPoint Challenge</p>
</div>
