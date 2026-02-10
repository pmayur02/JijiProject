📚 Learn with Jiji – Backend Service

Backend service that powers Jiji’s search & respond flow for AI learning content.

This service:

Accepts a user query

Retrieves relevant learning content

Returns a structured response consumable by the frontend

Built as part of VeidaLabs Software Developer Hiring Assignment


🏗️ Tech Stack

Node.js

Express.js

Supabase (DB + Auth + Storage)

dotenv

Swagger Link- http://localhost:8000/api-docs/#

API
○ POST /register - To register user
○ POST /login - To login user
○ POST /ask-jiji - To ask Query

🔐 .env - Create a dotenv file
PORT=8000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key



Run Project Locally

# 1. Clone repo


# 2. Install dependencies - npm install 


# 3. Create env file  - .env

#4.  PORT=8000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

#5 start server

#6 steps- register user -> login user -> ask question (use model questions provided below.)




curlCommands-

 POST /register - To register user

curl -X 'POST' \
  'http://localhost:8000/register' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Tom Cruise",
  "email": "tom@gmail.com",
  "password": "123456"
}'

	
Response body
Download
{
  "statusCode": 200,
  "message": "User registered successfully",
  "data": null
}

POST /login - To login user

curl -X 'POST' \
  'http://localhost:8000/login' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "tom@gmail.com",
  "password": "123456"
}'

POST /ask-jiji - To ask Query

curl -X 'POST' \
  'http://localhost:8000/ask-jiji' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer Bearer <YOUR_SUPABASE_JWT_TOKEN>'' \
  -H 'Content-Type: application/json' \
  -d '{
  "question": "What is React.js?"
}'

	
Response body
Download
{
  "statusCode": 200,
  "message": "Data fetched successfully.",
  "data": {
    "query": "What is React.js?",
    "answer": "React.js is a popular JavaScript library for building user interfaces, especially single-page applications, using a component-based approach.",
    "resources": {
      "video": "foldername/test_small.mp4",
      "ppt": "foldername/test_small.pptx"
    }
  }
}

Dummy Data for askJiJi endpoint-

    const modelData = [
        {
            question: "What is React.js?",
            answer: "React.js is a popular JavaScript library for building user interfaces, especially single-page applications, using a component-based approach."
        },
        {
            question: "What is a Large Language Model (LLM)?",
            answer: "A Large Language Model is an AI model trained on vast amounts of text data to understand, generate, and predict human-like language."
        },
        {
            question: "What is Node.js?",
            answer: "Node.js is a JavaScript runtime built on Chrome's V8 engine that allows developers to run JavaScript on the server side."
        },
        {
            question: "What is REST API?",
            answer: "A REST API (Representational State Transfer Application Programming Interface) is a set of rules that allows different software systems to communicate over HTTP."
        },
        {
            question: "What is Git?",
            answer: "Git is a distributed version control system used to track changes in source code during software development."
        }
    ];




# 📚 Learn with Jiji – Backend Service

Backend service that powers **Jiji’s search & respond flow** for AI learning content.

This service:
1. Accepts a user query  
2. Retrieves relevant learning content  
3. Returns a structured response consumable by the frontend  


---

## 🏗️ Tech Stack

- Node.js  
- Express.js  
- Supabase (DB + Auth + Storage)  
- dotenv  
- Swagger UI  

API Docs:  
http://localhost:8000/api-docs/#

---

## 📡 API Endpoints

POST /register   → Register user  
POST /login      → Login user  
POST /ask-jiji   → Ask learning query  

---

## 🔐 Environment Variables (`.env`)

Create a `.env` file in root directory:

PORT=8000  
SUPABASE_URL=your_supabase_url  
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  

---

# 🛠️ Run Project Locally

# 1. Clone the repository

# 2. Install dependencies
npm install  

# 3. Create env file
.env  

# 4. Add in .env
PORT=8000  
SUPABASE_URL=your_supabase_url  
SUPABASE_KEY=your_service_role_key  

# 5. Start server
npm run dev  

Server will start at:  
http://localhost:8000  

Swagger:  
http://localhost:8000/api-docs/#

---

# 🔁 API Flow

1. Register user  
2. Login user  
3. Ask question using token (Note: use model questions provided below.)  
4. Get structured response (answer + resources)

---

# 📮 CURL Commands

## Register User

curl -X 'POST' \
  'http://localhost:8000/register' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Tom Cruise",
  "email": "tom@gmail.com",
  "password": "123456"
}'

	
Response 
{
  "statusCode": 200,
  "message": "User registered successfully",
  "data": null
}

---

## Login User

curl -X 'POST' \
  'http://localhost:8000/login' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "tom@gmail.com",
  "password": "123456"
}'


Copy access_token from response.

---

## Ask Jiji (Protected API)

curl -X 'POST' \
  'http://localhost:8000/ask-jiji' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer Bearer <YOUR_SUPABASE_JWT_TOKEN>'' \
  -H 'Content-Type: application/json' \
  -d '{
  "question": "What is React.js?"
}'

	
Response body
{
  "statusCode": 200,
  "message": "Data fetched successfully.",
  "data": {
    "query": "What is React.js?",
    "answer": "React.js is a popular JavaScript library for building user interfaces, especially single-page applications, using a component-based approach.",
    "resources": {
      "video": "foldername/test_small.mp4",
      "ppt": "foldername/test_small.pptx"
    }
  }
}

---

# 📦 Dummy Model Data (Mock AI Logic)

const modelData = [
  {
    question: "What is React.js?",
    answer: "React.js is a popular JavaScript library for building user interfaces, especially single-page applications, using a component-based approach."
  },
  {
    question: "What is a Large Language Model (LLM)?",
    answer: "A Large Language Model is an AI model trained on vast amounts of text data to understand, generate, and predict human-like language."
  },
  {
    question: "What is Node.js?",
    answer: "Node.js is a JavaScript runtime built on Chrome's V8 engine that allows developers to run JavaScript on the server side."
  },
  {
    question: "What is REST API?",
    answer: "A REST API (Representational State Transfer Application Programming Interface) is a set of rules that allows different software systems to communicate over HTTP."
  },
  {
    question: "What is Git?",
    answer: "Git is a distributed version control system used to track changes in source code during software development."
  }
];

 
