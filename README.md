# Running the app with source code

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Running the app with Docker

You can also run the application using Docker. Here are the steps:

## Build the Docker image

Run the following command to build a Docker image from the Dockerfile:

```sh
docker build -t <your-image-name> .
```

Replace `<your-image-name>` with the name you want to give to your Docker image.

## Run the Docker container

After building the image, you can run the application in a Docker container with the following command:

```sh
docker run --env-file .env -p 3000:3000 <your-image-name>
```

This command runs the Docker container with the environment variables defined in the `.env` file. The `-p 8080:8080` option maps the port 8080 inside the Docker container to port 8080 on your machine.

Replace `<your-image-name>` with the name of your Docker image.

Please note that you need to have Docker installed on your machine to run these commands.

# CI/CD with Gitlab CI

This repository contains a `.gitlab-ci.yml` file that defines a CI/CD pipeline for this application. The pipeline consists of the following stages:

- `build`: Builds the Docker image and pushes it to the Gitlab registry.

- `deploy`: Deploys the application to the virtual machine.
