<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======

# Leave Management System – Frontend

A modern **Leave Management System frontend** built using **React, TypeScript, and Vite**.
This application provides a clean and scalable user interface for managing employee leave requests, approvals, and leave history.

The project follows professional development practices and is designed for long-term maintainability.

---

## ✨ Features

* Create and manage leave requests
* View leave request status and history
* Manager approval and rejection workflow
* Responsive and user-friendly UI
* Type-safe codebase using TypeScript
* Fast development with Vite and HMR

---

## 🧰 Tech Stack

* React
* TypeScript
* Vite
* ESLint
* CSS / UI Library (as applicable)
* REST API integration

---


## ⚙️ Prerequisites

Make sure you have the following installed:

* Node.js (version 18 or higher)
* npm or pnpm
* Git

---

## 🚀 Getting Started

### Clone the Repository

git clone [https://github.com/mathankumar-dev/leave-management-system-frontend.git](https://github.com/mathankumar-dev/leave-management-system-frontend.git)


cd leave-management-system-frontend

---

### Install Dependencies

```bash
npm install
```


---

## ▶️ Running the Application

npm run dev

The application will be available at:
[http://localhost:5173](http://localhost:5173)

---

## 🧪 Linting

Run ESLint to ensure code quality:

```bash
npm run lint
```


Fix all lint issues before pushing code.

---

## 🏗️ Build for Production

```bash
npm run build
```


The production-ready files will be generated in the `dist` directory.

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

VITE_API_BASE_URL=[http://localhost:8080/api](http://localhost:8080/api)

Do **NOT** commit `.env` files to the repository.

---

## 📜 Git & Contribution Rules

### Branching Strategy

* main → Stable and production-ready code
* feature/feature-name → New features
* fix/issue-name → Bug fixes

### Rules

* Do NOT push directly to `main`
* All changes must go through Pull Requests
* Keep PRs small and focused
* Write clear and meaningful commit messages

---


## 📌 Future Enhancements

* Role-based access control
* Improved error handling
* Unit and integration testing
* UI performance optimizations

---

## 📄 License

This project is intended for **internal, educational, or startup use**.
All rights reserved.

---

>>>>>>> ef840b7b368a91125478269a5a0dd298eab966cc
