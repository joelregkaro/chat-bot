# RegisterKaro AI Sales Agent Integration

This project integrates the RegisterKaro AI Sales Agent React frontend with the Python/FastAPI backend, creating a complete end-to-end solution.

## Project Structure

The project consists of two main components:

1. **Frontend (React)** - Located in this directory (`chat-bot`)
2. **Backend (Python/FastAPI)** - Located in the `ai-bot-backend/register_karo_agent` directory

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd ../ai-bot-backend/register_karo_agent
   ```

2. Create a virtual environment (if not already created):
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Configure environment variables:
   - Update the `.env` file with necessary API keys and settings
   - For testing, you can use the provided settings with limited functionality

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd chat-bot
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
3. Install the concurrently package for running both servers:
   ```
   npm install concurrently --save-dev
   ```

## Running the Application

### Running Frontend and Backend Together

Use the following command from the `chat-bot` directory to start both servers simultaneously:

```
npm run start:dev
```

This will start:
- The React frontend on http://localhost:3000
- The FastAPI backend on http://localhost:8001

### Running Separately

If you need to run the servers separately:

1. Start the backend:
   ```
   cd ../ai-bot-backend/register_karo_agent
   python start_server.py
   ```

2. Start the frontend:
   ```
   cd chat-bot
   npm start
   ```

## Features

- Real-time chat using WebSocket connections
- AI-powered responses from OpenAI's API
- Payment integration using Razorpay
- User session tracking and persistence
- Mobile-responsive design

## Implementation Details

### WebSocket Communication

The frontend connects to the backend via WebSockets for real-time messaging. The connection is established when the chat component mounts and maintains the connection throughout the user's session.

### Payment Processing

The integration handles Razorpay payment processing:
1. Backend generates a payment link
2. Frontend displays the payment popup
3. User completes payment
4. Backend verifies the payment status
5. Both sides update to reflect successful payment

## Troubleshooting

- If the WebSocket connection fails, check that both servers are running and that the WebSocket URL in `.env` is correct.
- For payment issues, verify that the Razorpay test keys are properly configured.
- Check the backend logs in `ai-bot-backend/register_karo_agent/logs/register_karo.log` for detailed error information.