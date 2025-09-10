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

Check out the live application deployed on GitHub Pages: [DataPoint Task Manager](https://duiggi.dev/vue-tasks/tasks)

## 💻 Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript for type safety
- **Build Tool**: Vite for lightning-fast development
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Styling**: TailwindCSS with custom components
- **Deployment**: GitHub Pages

## 📦 Build for Production

To build the app for production:

```bash
npm run build
# or
yarn build
```

## 🚢 Deployment

This project is deployed using GitHub Pages. I chose GitHub Pages for deployment because:

- It's simple to set up for small projects
- It integrates perfectly with Vite's build system
- It's free and reliable for static site hosting
- It avoids the complexity of AWS Amplify for this scale of project

To deploy to GitHub Pages:

1. Update the `base` path in `vite.config.js` if deploying to a subfolder:

   ```js
   export default defineConfig({
     base: "/vue-tasks/",
     // ...
   });
   ```

2. Build your project:

   ```bash
   npm run build
   ```

3. Deploy using the GitHub Pages workflow or manually from the `dist` folder.

## 🔐 Authentication

This application uses JWT (JSON Web Tokens) for authentication:

- Access tokens for API requests
- Refresh tokens for obtaining new access tokens
- Automatic token refresh on expiration


---

<div align="center">
  <p>Made for DataPoint Challenge</p>
</div>
