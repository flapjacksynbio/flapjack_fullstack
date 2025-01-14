# Flapjack Fronted

Front end project for Flapjack web application

## Environment Variables

To run the aplication, an environment variable file must be created in the root directory of the project. These files must be named `.env.prod` for production environment and `.env.dev` for development environment.

These files must contain the following fields:

```
REACT_APP_HTTP_API="<API HTTP url>"
REACT_APP_WS_API="<API WebSocket url>"
```

## Build

The app must be built before running, for this run:

`docker-compose -f <docker-compose path> build`

Where `<docker-compose path>` is `./docker-compose.dev.yml` for development environment and `./docker-compose.prod.yml` for production environment.

It should look like this `docker-compose -f docker-compose.prod.yml build`

## Run

To run the aplication:

`docker-compose -f <docker-compose path> up`

Where `<docker-compose path>` is `./docker-compose.dev.yml` for development environment and `./docker-compose.prod.yml` for production environment.
