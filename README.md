# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# Job Application Tracker - MVP Features

## Core Functionality
1. Job Application Entry
   - Add new job application with detailed information
   - Fields should include:
     * Company name
     * Job title
     * Application date
     * Job posting URL
     * Application method (direct, recruiter, referral)
     * Job location (remote/hybrid/on-site)
     * Salary range (optional)

2. Application Status Tracking
   - Predefined status categories:
     * Applied
     * Under Review
     * Phone Screen
     * Interview Scheduled
     * Technical Interview
     * Final Interview
     * Offer Received
     * Rejected
     * Accepted
     * Withdrawn
   - Ability to update status with a single click
   - Automatic date stamping when status changes

3. Contact Management
   - Add contact information for:
     * Recruiter
     * Hiring manager
     * Point of contact
   - Include fields for:
     * Name
     * Email
     * Phone number
     * LinkedIn profile (optional)

4. Notes and Documentation
   - Add personal notes for each application
   - Upload and attach relevant documents:
     * Resume version used
     * Cover letter
     * Interview preparation notes
     * Follow-up correspondence

5. Basic Search and Filter
   - Search applications by:
     * Company name
     * Job title
     * Current status
     * Application date range
   - Filter applications by status

6. Dashboard Overview
   - Summary of application statistics:
     * Total applications
     * Applications by status
     * Applications by month
   - Visual representation of job search progress

## User Experience
1. Simple, Clean Interface
   - Intuitive navigation
   - Mobile-responsive design
   - Quick add/edit functionality

2. Basic User Authentication
   - Email/password registration
   - Login functionality
   - Basic account management

## Optional (Nice-to-Have) Features for Future Iterations
1. Job Application Reminders
2. Application Timeline Visualization
3. Networking Contact Integration
4. Salary Comparison Tools
5. Application Performance Analytics

## Technical Considerations
- Web or mobile app with responsive design
- Simple, secure backend for data storage
- Easy data export (CSV/JSON)