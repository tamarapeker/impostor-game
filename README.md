# 🕵️‍♂️ The Impostor Game

A lightweight, real-time multiplayer "social deduction" game built with **Node.js**, **Socket.io**, and **React**. 

This is a simple prototype designed for friends to play together during social gatherings. It provides a seamless, "no-timer, no-fuss" experience where the focus is on conversation and deception.

---

## 🚀 Features

* **Real-time synchronization:** Powered by Socket.io for instant role assignment and room updates.
* **Zero Database Architecture:** Room states and player lists are managed in-memory on the server for maximum speed and simplicity.
* **Automatic Clean-up:** The server automatically handles disconnections and deletes empty rooms to prevent memory leaks.
* **Admin Control:** The room creator has exclusive control over starting rounds and resetting the lobby.
* **Curated Word List:** A diverse set of 350+ nouns (Animals, Food, Sports, etc.) pre-shuffled for a balanced experience.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), CSS3 (Flexbox/Grid).
* **Backend:** Node.js, Express.
* **Communication:** WebSockets (Socket.io).
* **Deployment:** Optimized for PaaS like Render or Railway.

---

## 💻 How to Run Locally

### 1. Clone the repository
```bash
git clone [https://github.com/tamarapeker/impostor-game.git](https://github.com/tamarapeker/impostor-game.git)
cd impostor-game
```

### 2. Install dependencies
From the root directory, run:
```bash
npm run install-all
```

### 3. Run the application
Open two terminals:

Terminal 1 (Backend):
```bash
cd backend
node index.js
```
Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
Visit http://localhost:5173 in your browser. Open multiple tabs or incognito windows to simulate different players.

---

## 🎮 How to Play

1.  **Join:** Every player enters their name and the same **Room Code**.
2.  **Lobby:** Once at least 3 players have joined, the **Admin (👑)** clicks on **"Empezar!"**.
3.  **The Roles:**
    * **Citizens:** Will see a secret word (e.g., "Pizza").
    * **The Impostor:** Will see a message saying "🤫 YOU ARE THE IMPOSTOR" and no word.
4.  **The Game:** Players take turns describing the word without being too obvious. The Impostor must blend in by lying or guessing the topic.
5.  **Reset:** After the discussion, the Admin clicks **"Nueva Ronda"** to go back to the lobby and start again with a new word and a new random impostor.

---

Created by a Software Engineer for the love of the game. 🇦🇷
