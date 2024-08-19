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