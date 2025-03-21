# RegisterKaro Chat Bot Integration

## Overview

This document outlines the integration between the frontend chat interface and the RegisterKaro backend sales agent system.

## Integration Points

### 1. WebSocket Communication

The chat component communicates with the backend agent through a WebSocket connection:

- **WebSocket URL**: `ws://<backend-host>/ws`
- **Connection Flow**:
  1. Frontend establishes WebSocket connection
  2. Backend generates session ID and sends it to client
  3. Client creates device fingerprint and sends it to the server
  4. Client sends persistent cookie ID (if available) to the server
  5. Client and server exchange messages

### 2. Tab Isolation

Each browser tab gets a unique session to prevent cross-talk:

- Each tab generates a unique tab ID stored in sessionStorage
- Tab ID is included in all WebSocket messages
- Backend appends tab ID to session IDs for proper isolation

### 3. Payment Integration

Payment processing is integrated securely:

- Backend server generates Razorpay payment links
- Frontend renders Razorpay checkout in popup
- Payment status is synced between frontend and backend
- Users' payment status persists in the database
- Payment completion is verified through multiple channels:
  - Database records (primary source of truth)
  - Razorpay API verification
  - Message content detection
  - LocalStorage caching for performance

### 4. User Identification

Multiple identifiers help track users across sessions:

- **Device ID**: Generated from browser fingerprint
- **Cookie ID**: Persistent storage with 90-day expiration
- **Session ID**: Unique to browser tab session
- **Phone/Email**: Optional user-provided contact info

## Backend API Endpoints

### WebSocket Messages

Messages sent to the websocket endpoint follow this format:

```json
{
  "type": "message",
  "text": "Hello, I'm interested in company registration",
  "session_id": "abc123",
  "cookie_id": "def456",
  "device_id": "device_789",
  "tab_id": "tab_12345"
}
```

### Message Types

#### From Client to Server:
- `message`: Regular user message
- `inactive`: User inactivity notification
- `cookie_id`: Set or update cookie ID
- `device_id`: Set or update device fingerprint
- `client_info`: Send device and user details
- `check_payment_status`: Query for payment status in database
- `payment_status`: Update payment status in database

#### From Server to Client:
- `message`: Regular agent message
- `follow_up`: Follow-up messages after inactivity
- `payment_link`: Razorpay payment link
- `session_info`: Session details
- `set_cookie`: Tell client to set a cookie
- `typing_indicator`: Agent is typing
- `typing_ended`: Agent has stopped typing
- `payment_status`: Payment status update

## Running Locally

1. Start the backend server:
```bash
cd ai-bot-backend/register_karo_agent
python start_server.py
```

2. Start the frontend development server:
```bash
cd chat-bot
npm run dev
```

3. Access the application at `http://localhost:5173`

## Testing Tab Isolation

1. Open the application in multiple browser tabs
2. Check the console logs to verify unique tab IDs
3. Verify that conversations in each tab are independent
4. Test using `test-connection.tsx` to verify tab isolation

## Testing Payment Status Persistence

1. Complete a payment in one tab
2. Open a new tab with the same browser (shares cookie/device ID)
3. Verify payment status persists across tabs
4. Try clearing localStorage and verify that database still remembers payment
5. Test with different devices to verify device ID tracking