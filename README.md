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

## Prerequisites

- A virtual machine with Docker installed and running.

- A Gitlab account.

- A Gitlab repository for this application.

## Setup

### 1. Create a Gitlab repository

Create a new repository on Gitlab and push the source code of this application to it.

### 2. Create a virtual machine

Create a virtual machine with Docker installed and running. You can use any cloud provider you want.

### 3. Add variables to Gitlab

- Add variables to your Gitlab repository for all the environment variables defined in the `.env` file.

- Add the following variables to your Gitlab repository:

  - `SSH_KEY`: The private key of your virtual machine.

  - `VM_USER`: The username of your virtual machine.

  - `VM_IP`: The IP address of your virtual machine.

  - `VIRTUAL_HOST`: The domain name of your virtual machine.

  - `LETSENCRYPT_HOST`: The domain name of your virtual machine. (for Letsencrypt)

  - `LETSENCRYPT_EMAIL`: Your email address. (for Letsencrypt)

### 4. Setup Nginx and Letsencrypt on your virtual machine

Follow the instructions in the [Nginx setup guide](https://github.com/nginx-proxy/nginx-proxy) to setup Nginx on your virtual machine.

Follow the instructions in the [Letsencrypt setup guide](https://github.com/nginx-proxy/acme-companion) to setup Letsencrypt on your virtual machine.

### 5. Trigger the pipeline

Push a commit to your Gitlab repository to trigger the pipeline.
