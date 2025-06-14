# CSC 437 Project — Deployment Report

Author: Aurora Zhang (jzhan118)  

---

## Project Description

This project consists of:

- `server/`: Node.js backend server
- `app/`: React frontend application (using Vite)


This project is a simple **Bookshelf App** where users can add, view, and manage books.  
The app consists of a React frontend and a Node.js backend server, with API endpoints to manage the book data.


---

## Deployment Summary

The project was deployed to the CSSE VPS following the **Lab 6 style** deployment process, with two `nohup` processes:

- `server/`: `nohup npm run start &`
- `app/`: `nohup npm run dev &`

---

## Deployment Steps

1️⃣ Connected to VPS:

```bash
ssh jzhan118@jzhan118-host.csse.dev

2️⃣ Installed Node.js v20:
sudo apt update
curl -sL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt-get install nodejs -y
node -v  # v20.19.2

3️⃣ Cloned project repo:
git clone https://github.com/Auroraz25/CSC-437_Project.git
cd CSC-437_Project

4️⃣ Installed dependencies:
cd server
npm install

cd ../app
npm install

5️⃣ Deployed servers:
# Start backend server
cd ~/CSC-437_Project/server
nohup npm run start &

# Start frontend app (with --host)
cd ~/CSC-437_Project/app
nohup npm run dev &

→ Vite frontend running at:
Network: http://10.0.1.73:5174/

# Web Address:
https://jzhan118.csse.dev/app


