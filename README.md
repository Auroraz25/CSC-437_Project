# CSC-437_Project

# App + Server Deployment

Author: Aurora Zhang (jzhan118)  
Repo: https://github.com/Auroraz25/CSC-437_Project

---

## Project Description

This project consists of:

- `server/`: Node.js backend server
- `app/`: React frontend application

The project is a full-stack web application consisting of both backend and frontend components.  
It is designed to be deployed on the CSSE-hosted VPS using the deployment process demonstrated in Lab 6.

---

## Deployment Status

At this time, I am unable to deploy the app to the server because I have forgotten my password for `jzhan118@host.csse.dev`.

I have already requested a password reset. Once I regain access, I will deploy the app following the standard Lab 6 deployment procedure, as described below.

---

## Deployment Process (based on Lab 6)

Once my password issue is resolved, I will deploy the app using the following steps:

### 1️⃣ SSH into the server

```bash
ssh jzhan118@jzhan118-host.csse.dev

sudo apt update
curl -sL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt-get install nodejs -y
node -v

git clone https://github.com/Auroraz25/CSC-437_Project.git
cd CSC-437_Project

cd server
npm install

cd ../app
npm install

# Start backend server
cd server
nohup npm run start &

# Start frontend app
cd ../app
nohup npm run dev &

# Note: The deployment process is identical to Lab 6, with the exception that both the server and the app are started as background processes using separate nohup commands. Once I regain access to my UNIX account and complete the deployment, I will update this README.

