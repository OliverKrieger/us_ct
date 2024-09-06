# Installation

Web URL: ctfrontend-production.up.railway.app

# Installation

## Docker installation

Please find docker documentation for setting up docker for your desired operating system:
https://docs.docker.com/engine/install/

## Docker Locally:

Once you have docker running, the following commands can be used to run the project:

- Build and run the project:
`docker-compose up --build`

## Requirements

If you do not want to install docker or are unable, the app can be ran manually, but there are list of requirements that have to be installed:

- Latest Node version from:  https://nodejs.org/en/download/package-manager

To run the backend:

- Build backend:
`yarn install`
`yarn run build`

- Start backend:
`yarn start`

To run the frontend:

- Build frontend:
`yarn install`

- Start frontned:
`yarn start`

# Environment variables

## Client

- REACT_APP_WS_URL => Where the client will find the websocket, for the compose setup should be set to ws://localhost:8081/ locally

# Railway Setup

- On railway, create an empty project
- Right click in the empty areas and select "Empty Service" (can also use the Create buttom at top right if all menus closed)
- Make two of them, name one ct_backend and one ct_frontned (for coding test backend and coding test frontend)
- Click on backend and go to settings and generate a domain on port 8080
- Then click on frontned and under Variables add a variables called `REACT_APP_WS_URL` (where the server will be) with the value set as the link to the backend with `wss://` in front (for websockets). For instance `wss://ctbackend-production.up.railway.app`
- Then generate a domain on port 8080 for frontend as well (because they are served from the same port, could be served from different ones)