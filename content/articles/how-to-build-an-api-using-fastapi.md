---
title: "How to Build an API Using FastAPI"
date: "March 20th 2025"
description: "Learn to build a fast and efficient API using FastAPI, covering setup, routing, data validation, and deployment."
image: "/assets/images/python-api-fast.jpg"
tag: "python 🐍"
id: 1
author: "Cesar Useche"
duration: "~3 min"
category: "TECH+++"
---

As a Computer Science master's student currently studying Python, and with 5 years of experience as a software engineer, I have spent most of my career working as a front-end developer, building innovative and amazing UIs. However, I have a deep passion for AI and languages like Python, which has led me to explore backend development and API design. FastAPI is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints. It provides automatic OpenAPI documentation and high performance thanks to Starlette and Pydantic.

In this guide, we'll walk through building a simple API using FastAPI, focusing on best practices and real-world applications.

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

## Step 4: Add More Routes with Data Validation
FastAPI uses Pydantic for data validation and serialization. Let’s define a model and add routes for CRUD operations:

```python
from typing import Optional
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

@app.post("/items/")
def create_item(item: Item):
    return {"item": item}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "query": q}
```

Here, `Item` is a Pydantic model that ensures data integrity by enforcing types.

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

