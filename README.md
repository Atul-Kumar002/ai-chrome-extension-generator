  # Extensio.ai

  AI-powered no-code Chrome extension generator built with React, Node.js, Groq AI, Monaco Editor, and Chrome Manifest V3.

  ---

  ## Features

  - AI Chrome extension generation
  - Monaco Editor integration
  - ZIP download support
  - Chrome Manifest V3 automation
  - Real-time file preview
  - Secure backend packaging system
  - Modular backend architecture
  - Extension editing workflow foundation

  ---

  ## Tech Stack

  Frontend:
  - React.js
  - Monaco Editor
  - Axios

  Backend:
  - Node.js
  - Express.js
  - Groq AI SDK
  - Archiver

  ---

  ## Project Structure

  ```txt
  Extensio.ai/
  │
  ├── backend/
  │   ├── config/
  │   ├── controllers/
  │   ├── models/
  │   ├── routes/
  │   ├── services/
  │   ├── temp/
  │   ├── .env
  │   ├── package.json
  │   └── server.js
  │
  ├── frontend/
  │   ├── public/
  │   ├── src/
  │   ├── package.json
  │   └── package-lock.json
  │
  ├── .gitignore
  └── README.md

  ## Installation

  ### Backend

  ```bash
  cd backend
  npm install
  npm run dev
  ```

  ### Frontend

  ```bash
  cd frontend
  =======
  # AI Chrome Extension Generator

  A Node.js project that generates Chrome extension code from a prompt, writes the files, zips them, and serves a download link.

  ## Usage

  ```bash
  npm install
  npm start
  ```

  ---

  ## Environment Variables

  Create:

  backend/.env

  ```env
  PORT=5000
  GROQ_API_KEY=your_key_here
  ```
  How It Works
  1. User enters extension prompt
  2. Groq AI generates Manifest V3 extension files
  3. Backend validates and packages files
  4. ZIP file is generated automatically
  5. User downloads and installs extension in Chrome


  Then open `http://localhost:3000/download` to download the generated extension zip.

