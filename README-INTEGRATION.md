# RegisterKaro Chat Bot Integration Guide

This document provides information about how the chat frontend integrates with the RegisterKaro agent backend, along with implementation details for key features.

## Key Integration Features

1. **WebSocket Communication**: The frontend communicates with the backend via WebSockets
2. **Tab-Isolated Sessions**: Each browser tab maintains its own isolated chat session
3. **Persistent Sessions**: User sessions are stored with 90-day cookie expiration
4. **Payment Processing**: Seamless integration with Razorpay for payments
5. **Document Requirements**: Post-payment document requirement display

## Frontend-Backend Communication

### WebSocket Protocol

The frontend connects to the backend using a WebSocket connection and exchanges JSON messages. Key message types include:

- `message`: Text messages from the user to the agent
- `session_info`: Session identification from the server
- `cookie_id`: Cookie-based session persistence
- `client_info`: Client device and environment information 
- `payment_link`: Payment link processing
- `tab_id`: Browser tab identification for isolated sessions

### Session Management

Sessions are managed through multiple identifiers to ensure both persistence and proper isolation:

- **Cookie ID**: Stored in localStorage with 90-day expiration for long-term persistence across browser sessions
- **Session ID**: Unique identifier for each WebSocket connection
- **Tab ID**: Ensures each browser tab gets its own isolated context
- **Device ID**: Browser fingerprinting for device identification

## Implementation Details

### Tab Isolation

Browser tabs are isolated through the following mechanism:

1. Each tab generates a unique `tab_id` when initialized
2. This ID is stored in `sessionStorage` (unique to each tab)
3. The `tab_id` is sent with every message to the backend
4. The backend appends the `tab_id` to the session ID to create isolated sessions
5. This prevents cross-talk between tabs while still allowing persistent user identity

### Payment Processing

Payment processing follows this flow:

1. Backend generates a Razorpay payment link
2. Frontend receives the link via WebSocket
3. Frontend opens the payment link in a new tab
4. After payment, the backend verifies the payment status
5. Upon successful payment, the backend sends document requirements

### Post-Payment Flow

After successful payment:

1. Payment popup closes automatically
2. Backend confirms payment completion
3. Backend sends document requirements specific to the company type
4. User receives notification that our team will contact them shortly

## Testing the Integration

1. **Basic Chat**: Ensure messages are sent and received properly
2. **Multiple Tabs**: Open multiple tabs and verify each maintains its own conversation
3. **Session Persistence**: Close and reopen browser to verify session persistence
4. **Payment Flow**: Test the payment flow (using test mode)

## Troubleshooting

### Common Issues

1. **WebSocket Connection Issues**:
   - Check network connectivity
   - Verify backend server is running
   - Ensure WebSocket endpoint URLs are correct

2. **Session Problems**:
   - Clear browser data/cookies if experiencing unexpected behavior
   - Check browser console for error messages

3. **Payment Integration Issues**:
   - Verify Razorpay test keys are configured correctly
   - Check network logs for payment API communication

## Recent Fixes

### 2025-03-20 Updates

1. **Fixed typing indicator issues**:
   - Disabled post-message typing indicators
   - Added better typing indicator handling

2. **Fixed session persistence**:
   - Implemented 90-day cookie expiration
   - Added format versioning for future compatibility
   - Improved error handling for malformed cookies

3. **Fixed payment popup issues**:
   - Switched to direct new tab opening for payments
   - Added fallback for popup blockers
   - Improved payment status checking

4. **Improved tab isolation**:
   - Implemented session isolation per browser tab
   - Fixed cross-tab session pollution
   - Added tab tracking in all WebSocket messages

5. **Updated document flow**:
   - Removed document upload prompts
   - Added document requirements information after payment
   - Improved company-type specific document requirements