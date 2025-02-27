# Flapjack Fullstack Documentation


## Overview
**Flapjack Fullstack** is a repository that includes both the backend and frontend components of the Flapjack project in a single compose, facilitating the deployment.

## Repository Structure
- **flapjack_api**: Contains the backend API code.
- **flapjack_frontend**: Contains the frontend module.
- **docker-compose.yml**: Configuration file for Docker Compose.

## Getting Started

### Usage

Access the data programatically through the API. For more information read the [API documentation](https://flapjacksynbio.github.io/flapjack_api/?shell#introduction).

For a better integration within Python workflows we developed [pyFlapjack](https://github.com/flapjacksynbio/pyFlapjack) to interface with the API.

### Prerequisites
- Docker
- Docker Compose

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/flapjacksynbio/flapjack_fullstack.git
   ```
2. Navigate to the project directory:
   ```bash
   cd flapjack_fullstack
   ```
3. Navigate to the frontend directory:
   ```bash
   cd flapjack_frontend
   ```
4. Create a environment variable:
   ```bash
   vim .env.dev
   ```
   To edit the file press i to insert and copy the following content:
   ```
   REACT_APP_HTTP_API=http://localhost:8000/api/
   REACT_APP_WS_API=ws://localhost:8000/ws/
   ```
   Then press esc and write :wq to write and quite.
   This will establish the connection between the frontend and backend.

5. Navigate to the fullstack directory:
   ```bash
   cd ..
   ```
6. Start the services using Docker Compose:
   ```bash
   docker compose up --build
   ```

7. Enter to Flapjack API docker bash:
   ```bash
   docker exec -it flap_api bash
   ```   
8. Run the migrations to create the data model:
   ```bash
   python manage.py migrate
   ```


## Usage
- Access the frontend at `http://localhost:3000`.
- The backend API is available at `http://localhost:8000`.

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request.

## Changing the object structure

To apply data base structure changes make sure to run
   ```bash
   python manage.py makemigrations
   ```
and then:
   ```bash
   python manage.py migrate
   ```

---
