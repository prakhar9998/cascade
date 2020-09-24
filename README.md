# cascade
A Full stack Kanban Board web application built using ExpressJS, ReactJS, Redux and MongoDB (MERN Stack).
## Main Features
* Drag and drop interface
* Real time collaboration using socket.io
* Optimistic UI updates for faster response
* Add colors and named labels
* Assign members
## Demo
![Demo](https://i.ibb.co/M7fX1GF/demo.gif)
## Steps to setup development server:
### Frontend
* `cd frontend` to change into frontend directory.
* Run `npm install` then `npm start` to start development server
* Add `.env` in root folder with follow variables `REACT_APP_API_URL` and `REACT_APP_HOST` for backend host and socket.io host respectively.
### Backend
* `cd backend` to change into backend directory.
* Run `npm install` to install dependencies.
* `npm run serverstart` for linux operating system.
* `SET DEBUG=backend:* | npm run devstart` in powershell windows.
* Setup a `.env` file in config folder as shown in `.env.example`.
