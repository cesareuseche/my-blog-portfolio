---
title: "How to Build an API Using FastAPI"
date: "March 20th 2025"
description: "Learn to build a fast and efficient API using FastAPI, covering setup, routing, data validation, and deployment."
image: "/assets/images/python-illus.webp"
tag: "python 🐍"
id: 1
author: "Cesar Useche"
duration: "~6 min"
category: "TECH+++"
---

As a Computer Science master's student currently studying Python, and with 5 years of experience as a software engineer, I have spent most of my career working as a front-end developer, building innovative and amazing UIs. However, I have a deep passion for AI and languages like Python, which has led me to explore backend development and API design. FastAPI is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints. It provides automatic OpenAPI documentation and high performance thanks to Starlette and Pydantic.

In this guide, we'll explain what it is an API, how do they work, what kind of API methods we have available and we'll walk you through building a simple API using FastAPI, focusing on best practices and real-world applications.

## Understanding APIs
An API (Application Programming Interface) is the messenger that lets your front-end applications (like web or mobile apps) communicate with back-end servers. Think of it as a waiter: you (the client) send an order (request), and the waiter (API) delivers your food (data) from the kitchen (server).

### Key Components:
- **Client:** The front-end (browser or app) that makes the request.

- **Server:** The back-end that processes requests and returns responses.

- **Request & Response:** The exchange that includes HTTP methods (GET, POST, DELETE, PATCH, etc.), URLs, headers, and data payloads.

![API diagram](/assets/images/api-ilustration.png "API Diagram")

## Introducing FastAPI
FastAPI is a modern, Python-based web framework built on top of Starlette and Pydantic. It uses Python’s type hints to automatically validate data and generate interactive documentation. Its asynchronous capabilities mean it can handle thousands of requests per second, making it ideal for both small projects and large-scale applications.

### Why Choose FastAPI?
- **Speed:** Built for low-latency processing.

- **Simplicity:** Clean, intuitive syntax.

- **Automatic Documentation:** Out-of-the-box Swagger UI and ReDoc.

- **Asynchronous Programming:** Effortlessly handles concurrent requests.

- **Type Safety:** Uses Python type hints to catch errors early.

## Prerequisites
Before starting, ensure you have the following:
- Python 3.7+
- pip (Python package manager)
- A code editor (VS Code, PyCharm, etc.)
- Basic understanding of Python and RESTful APIs

## Step 1: Install FastAPI and Uvicorn
First, install FastAPI and Uvicorn (a high-performance ASGI server) using pip:

```sh
pip install fastapi uvicorn
```

## Step 2: Create the API Application
Create a new Python file, e.g., `main.py`, and start by importing FastAPI:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}
```

Here, we create an instance of `FastAPI` and define a simple route (`/`) that returns a JSON response.

## Step 3: Run the API
To start the API server, use Uvicorn:

```sh
uvicorn main:app --reload
```

This will start the server at `http://127.0.0.1:8000/`. The `--reload` flag enables auto-reloading when code changes, making development more efficient.

## Step 4: Structuring Your FastAPI Project

As your FastAPI application grows, it's best to separate concerns by organizing your code into different files. Here’s a recommended project structure:

``` sh
/my_fastapi_project
│── main.py            # Entry point (app instance & server start)
│── /routes
│   ├── items.py       # Routes for item-related endpoints
│── /models
│   ├── item.py        # Pydantic models
│── /services
│   ├── item_service.py # Business logic
│── requirements.txt   # Dependencies
│── Dockerfile         # Deployment setup
```

## Example of a Modular FastAPI Application:

```main.py``` (This is your entry point)

``` py
from fastapi import FastAPI
from routes import items

app = FastAPI()
app.include_router(items.router)  # Include routes from the 'items' module

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}
```

```routes/items.py``` (Routes for Item Handling)

``` py
from fastapi import APIRouter
from models.item import Item
from typing import Optional

router = APIRouter()

@router.post("/items/")
def create_item(item: Item):
    return {"item": item}

@router.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "query": q}
```

```models/item.py``` (Data Model)
``` py
from pydantic import BaseModel
from typing import Optional

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None
```

This structure follows the best practices of how to set up your API project, making sure your API is modular, maintainable, and scalable as it grows.

## Step 5: Explore Automatic Documentation
FastAPI automatically generates API documentation, saving development time. Visit:
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Step 6: Deploy the API
If you want to deploy your API. Here are some options:
- **Docker:** Package your API in a container for easy deployment.
- **AWS Lambda:** Deploy as a serverless function for scalability.
- **Heroku:** Quick and easy cloud deployment.

Example Dockerfile:

```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Conclusion
FastAPI simplifies API development with automatic validation, serialization, and documentation. This guide covered setting up FastAPI, creating routes, running the server, and deploying the API. As you advance, consider integrating FastAPI with databases like PostgreSQL or MongoDB for full-stack applications.

Happy coding! 🐍

