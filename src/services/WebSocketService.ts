/**
 * WebSocketService.ts
 * Service for managing WebSocket connections to the backend chat API
 */

// Configurable backend URL - can be overridden via environment variables
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const WS_PROTOCOL = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

// Better WebSocket URL construction with more debugging
function constructWebSocketUrl() {
  // Use explicit WS_URL if provided in env
  if (process.env.REACT_APP_WS_URL) {
    console.log(`Using explicit WS_URL from env: ${process.env.REACT_APP_WS_URL}`);
    return process.env.REACT_APP_WS_URL;
  }
  
  // Extract hostname and port from BACKEND_URL
  let urlObj;
  try {
    urlObj = new URL(BACKEND_URL);
  } catch (error) {
    console.error(`Invalid BACKEND_URL format: ${BACKEND_URL}`, error);
    // Fallback to default
    console.log('Falling back to default WebSocket URL: ws://localhost:8001/ws');
    return 'ws://localhost:8001/ws';
  }
  
  const host = urlObj.host; // hostname:port
  const wsUrl = `${WS_PROTOCOL}//${host}/ws`;
  console.log(`Constructed WebSocket URL: ${wsUrl} from BACKEND_URL: ${BACKEND_URL}`);
  return wsUrl;
}

const WS_URL = constructWebSocketUrl();
// Create a unique tab ID that persists for this tab only with stronger entropy
// This ensures different browser tabs don't share sessions
const generateTabId = () => {
  // Combine timestamp, random string, and browser info for better uniqueness
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  const browserInfo = navigator.userAgent.split(/[\s/()]+/)[0]; // Extract just browser name
  return `tab_${timestamp}_${random}_${browserInfo}`;
};

const TAB_ID = generateTabId();

// Ensure we're not accidentally reusing an existing tab ID
const existingTabId = sessionStorage.getItem('registerKaroTabId');
if (existingTabId) {
  console.log(`Found existing tab ID, replacing: ${existingTabId}`);
}

// Store tab ID in sessionStorage (only persists for current tab)
sessionStorage.setItem('registerKaroTabId', TAB_ID);
console.log(`🆕 Initialized unique tab ID: ${TAB_ID}`);

// IMPORTANT: Clear any device or cookie IDs from previous sessions to force new user creation
// This prevents incorrect user association with other browser users like "Rahul"
localStorage.removeItem('deviceId');
console.log('💥 Cleared cached device ID to ensure proper user isolation');
console.log(`Initialized unique tab ID: ${TAB_ID}`);

export type MessageType = 'message' | 'follow_up' | 'payment_link' | 'show_document_upload' | 'session_info' | 'set_cookie' | 'typing_indicator' | 'typing_ended' | 'payment_status' | 'check_payment_status';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  time: string;
  metadata?: Record<string, any>;
}

export interface WebSocketResponse {
  type: MessageType;
  text?: string;
  link?: string;
  session_id?: string;
  cookie_id?: string;
  requires_cookie?: boolean;
  requires_device_id?: boolean;
  messageId?: string; // Added to help with message deduplication
  payment_completed?: boolean; // Server indicating completed payment
  payment_status?: string; // Payment status from server (completed, pending, failed)
  payment_id?: string; // Payment ID from server
  status?: string; // General status field (completed, pending, failed)
}

export type MessageHandler = (message: WebSocketResponse) => void;
export type ConnectionStatusHandler = (status: 'connected' | 'connecting' | 'disconnected' | 'error') => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private isConnected = false;
  private isConnecting = false;
  private sessionId: string | null = null;
  private cookieId: string | null = null;
  private deviceId: string | null = null;
  private messageHandlers: MessageHandler[] = [];
  private statusHandlers: ConnectionStatusHandler[] = [];
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pendingMessages: any[] = [];

  /**
   * Initialize the WebSocket connection
   */
  public connect(): void {
    if (this.isConnected || this.isConnecting) {
      console.log('WebSocket is already connected or connecting');
      return;
    }

    this.isConnecting = true;
    this.notifyStatusChange('connecting');
    
    // Generate a unique connection attempt ID for tracking in logs
    const connectionId = Date.now();
    
    try {
      console.log(`[WS:${connectionId}] Connecting to WebSocket at ${WS_URL}`);
      console.log(`[WS:${connectionId}] Backend URL is: ${BACKEND_URL}`);
      console.log(`[WS:${connectionId}] Protocol is: ${WS_PROTOCOL}`);
      
      this.socket = new WebSocket(WS_URL);
      
      // Enhanced event handlers with connection ID for correlation
      this.socket.onopen = () => {
        console.log(`[WS:${connectionId}] WebSocket connection OPENED successfully`);
        this.handleOpen();
      };
      
      this.socket.onmessage = (event) => {
        // Only log the first message to avoid spam
        const isFirstMessage = !this._messageReceived;
        if (isFirstMessage) {
          console.log(`[WS:${connectionId}] First message received, connection is WORKING`);
          this._messageReceived = true;
        }
        this.handleMessage(event);
      };
      
      this.socket.onclose = (event) => {
        console.log(`[WS:${connectionId}] WebSocket CLOSED: code=${event.code}, reason=${event.reason || 'No reason provided'}, clean=${event.wasClean}`);
        this.handleClose(event);
      };
      
      this.socket.onerror = (event) => {
        console.error(`[WS:${connectionId}] WebSocket ERROR:`, event);
        this.handleError(event);
      };
      
      // Set a connection timeout as a safety measure
      setTimeout(() => {
        if (this.isConnecting && !this.isConnected && this.socket) {
          console.error(`[WS:${connectionId}] CONNECTION TIMEOUT after 10 seconds`);
          
          // Log network state for debugging
          console.log(`[WS:${connectionId}] Network state: ${navigator.onLine ? 'ONLINE' : 'OFFLINE'}`);
          
          // Close socket and retry
          this.socket.close();
          this.isConnecting = false;
          this.notifyStatusChange('error');
          this.scheduleReconnect();
        }
      }, 10000);
      
    } catch (error) {
      console.error(`[WS:${connectionId}] Error creating WebSocket:`, error);
      this.isConnecting = false;
      this.notifyStatusChange('error');
      this.scheduleReconnect();
    }
  }
  
  // Track if we've received any messages (to avoid console spam)
  private _messageReceived: boolean = false;

  /**
   * Disconnect the WebSocket connection
   */
  public disconnect(): void {
    if (!this.socket) {
      return;
    }

    this.socket.close();
    this.socket = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.notifyStatusChange('disconnected');
    
    // Clear any reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  /**
   * Send a message through the WebSocket
   */
  public sendMessage(text: string): void {
    // Get the tab ID to ensure messages are properly isolated to this tab
    const tabId = sessionStorage.getItem('registerKaroTabId');
    
    // If not connected, queue message and try to connect (if not already connecting)
    if (!this.isConnected) {
      console.log('WebSocket not connected, queueing message');
      this.pendingMessages.push({ type: 'message', text, tab_id: tabId });
      if (!this.isConnecting) {
        this.connect();
      }
      return;
    }

    const message = {
      type: 'message',
      text,
      session_id: this.sessionId,
      cookie_id: this.cookieId,
      device_id: this.deviceId,
      tab_id: tabId // Include tab ID to maintain tab-specific conversation context
    };

    // Send the actual message
    this.socket?.send(JSON.stringify(message));
    
    // Log this outgoing message
    console.log(`[WEBSOCKET:SEND] Sent message: "${text.substring(0, 30)}..." (tab: ${tabId})`);
    
    // Clear any existing typing indicator timeout
    if (this.typingIndicatorTimeout) {
      clearTimeout(this.typingIndicatorTimeout);
    }
    
    // Setup a safety timeout to clear typing indicator if no response comes
    this.typingIndicatorTimeout = setTimeout(() => {
      console.log(`[WEBSOCKET:SAFETY] No response in 15 seconds, sending end-typing indicator`);
      this.notifyTypingEnded();
    }, 15000);
  }
  
  /**
   * Send end-typing event to clear the typing indicator
   */
  private notifyTypingEnded(): void {
    const endTypingMsg = {
      type: 'typing_ended'
    };
    
    // Notify all handlers that typing has ended
    this.messageHandlers.forEach(handler => handler(endTypingMsg as WebSocketResponse));
  }
  
  // Timeout reference to manage typing indicators
  private typingIndicatorTimeout: NodeJS.Timeout | null = null;

  /**
   * Notify the server of user inactivity
   */
  public notifyInactivity(context?: string): void {
    if (!this.isConnected || !this.sessionId) {
      return;
    }

    const message = {
      type: 'inactive',
      session_id: this.sessionId,
      cookie_id: this.cookieId,
      device_id: this.deviceId,
      context
    };

    this.socket?.send(JSON.stringify(message));
  }

  /**
   * Register a message handler
   */
  public addMessageHandler(handler: MessageHandler): void {
    // Add a unique ID to this handler for tracking
    const handlerId = `handler_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    console.log(`[DEBUG] Adding new message handler ${handlerId}. Total handlers: ${this.messageHandlers.length + 1}`);
    console.log(`[DEBUG] Current handlers stack:`, this.messageHandlers.length);
    
    // Check if this function is already registered to prevent duplicates
    const handlerStr = handler.toString();
    const existingHandler = this.messageHandlers.find(h => h.toString() === handlerStr);
    
    if (existingHandler) {
      console.warn(`[DEBUG] Handler appears to be a duplicate! Not adding again.`);
      return;
    }
    
    // Add the handler
    this.messageHandlers.push(handler);
  }

  /**
   * Register a connection status handler
   */
  public addStatusHandler(handler: ConnectionStatusHandler): void {
    this.statusHandlers.push(handler);
  }
  
  /**
   * Remove a connection status handler
   */
  public removeStatusHandler(handler: ConnectionStatusHandler): void {
    this.statusHandlers = this.statusHandlers.filter(h => h !== handler);
  }

  /**
   * Get current connection status
   */
  public getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' | 'error' {
    if (this.isConnected) return 'connected';
    if (this.isConnecting) return 'connecting';
    return 'disconnected';
  }
  
  /**
   * Get the count of message handlers
   * This helps in determining if we should disconnect when a component unmounts
   */
  public getMessageHandlerCount(): number {
    return this.messageHandlers.length;
  }
  
  /**
   * Explicitly check with server for payment status
   * External components can call this to verify if the user has previously completed payment
   */
  public checkPaymentStatus(): void {
    // Only check if we have a connection and sufficient identification
    if (!this.isConnected || (!this.cookieId && !this.deviceId)) {
      console.log('Unable to check payment status: Not connected or missing identifiers');
      return;
    }
    
    console.log('Explicitly checking payment status with server');
    
    this.sendToServer({
      type: 'check_payment_status',
      session_id: this.sessionId,
      cookie_id: this.cookieId,
      device_id: this.deviceId,
      tab_id: sessionStorage.getItem('registerKaroTabId') || TAB_ID
    });
  }
  
  /**
   * Helper method to send data to the server
   */
  public sendToServer(data: any): boolean {
    if (!this.isConnected || !this.socket) {
      console.log('Cannot send data - not connected');
      return false;
    }
    
    try {
      this.socket.send(JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error sending data to server:', e);
      return false;
    }
  }
  
  /**
   * Get the current session ID
   */
  public getSessionId(): string | null {
    return this.sessionId;
  }
  
  /**
   * Get the current cookie ID
   */
  public getCookieId(): string | null {
    return this.cookieId;
  }
  
  /**
   * Get the current device ID
   */
  public getDeviceId(): string | null {
    return this.deviceId;
  }

  /**
   * Handle WebSocket open event
   */
  private handleOpen(): void {
    console.log('WebSocket connection established');
    this.isConnected = true;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.notifyStatusChange('connected');

    // Send any pending messages
    if (this.pendingMessages.length > 0) {
      console.log(`Sending ${this.pendingMessages.length} pending messages`);
      this.pendingMessages.forEach(msg => {
        const fullMessage = {
          ...msg,
          session_id: this.sessionId,
          cookie_id: this.cookieId,
          device_id: this.deviceId
        };
        this.socket?.send(JSON.stringify(fullMessage));
      });
      this.pendingMessages = [];
    }

    // Send device fingerprint
    this.sendDeviceInfo();
  }

  /**
   * Handle WebSocket message event
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const data: WebSocketResponse = JSON.parse(event.data);
      
      // Generate a unique ID for this message for logging
      const messageTimeId = Date.now();
      
      // For text messages, create a preview for better identification
      const preview = data.text
        ? data.text.substring(0, 30).replace(/\s+/g, ' ')
        : '[no text]';
      
      console.log(`[WEBSOCKET:${messageTimeId}] Received type=${data.type}, preview="${preview}...", handlers=${this.messageHandlers.length}`);

      // Check for payment completion status from the server
      if (data.payment_completed === true ||
          (data.type === 'payment_status' && data.payment_status === 'completed') ||
          (data.type === 'message' && data.text && (
            data.text.includes("payment has been successfully received") ||
            data.text.includes("payment has been processed") ||
            data.text.includes("payment is complete") ||
            data.text.includes("payment successful")
          ))) {
        console.log(`[WEBSOCKET:${messageTimeId}] Payment completion detected from server`);
        
        // Store in localStorage for persistence
        try {
          localStorage.setItem('paymentCompleted', 'true');
          console.log('Payment marked as completed - synced from server');
        } catch (e) {
          console.error('Error storing payment status:', e);
        }
      }

      // Check if message indicates payment completed
      if (data.payment_status === 'completed' ||
          data.status === 'completed' ||
          data.payment_completed === true ||
          (data.type === 'payment_status' && data.status === 'completed')) {
        console.log(`[WEBSOCKET:${messageTimeId}] Payment completion detected from server`);
        
        try {
          localStorage.setItem('paymentCompleted', 'true');
          console.log(`[WEBSOCKET:${messageTimeId}] Stored payment completion in localStorage`);
        } catch (e) {
          console.error('Error storing payment status:', e);
        }
        
        // Notify all handlers that payment is completed
        this.messageHandlers.forEach(handler => handler({
          type: 'payment_status',
          payment_completed: true,
          status: 'completed',
          messageId: `payment_${messageTimeId}`
        } as WebSocketResponse));
      }

      // Handle session info
      if (data.type === 'session_info' && data.session_id) {
        // Only set session ID if it's different - prevent duplicate greetings
        const isNewSession = this.sessionId !== data.session_id;
        this.sessionId = data.session_id;
        console.log(`[WEBSOCKET:${messageTimeId}] Session ID set: ${this.sessionId} (isNew=${isNewSession})`);
        
        // Store in sessionStorage for persistence
        sessionStorage.setItem('chatSessionId', this.sessionId);
        
        // If this is a reconnection with the same session ID, we might not need
        // to process all the default welcome messages that follow
        if (!isNewSession) {
          console.log(`[WEBSOCKET:${messageTimeId}] Reconnected with existing session - may filter welcome messages`);
        }
        
        // Check if we have a cookie ID or device ID - query server for payment status
        if ((this.cookieId || this.deviceId) && !localStorage.getItem('paymentCompleted')) {
          console.log(`[WEBSOCKET:${messageTimeId}] Checking payment status with server`);
          
          // Query for payment status on session establishment
          this.socket?.send(JSON.stringify({
            type: 'check_payment_status',
            session_id: this.sessionId,
            cookie_id: this.cookieId,
            device_id: this.deviceId,
            tab_id: TAB_ID
          }));
        }
      }

      // Handle cookie setting
      if (data.type === 'set_cookie' && data.cookie_id) {
        this.cookieId = data.cookie_id;
        console.log(`Cookie ID set: ${this.cookieId}`);
        
        // Store in localStorage for persistence with 90-day expiration
        const cookieData = {
          id: this.cookieId,
          expires: Date.now() + (90 * 24 * 60 * 60 * 1000) // 90 days in milliseconds
        };
        localStorage.setItem('registerKaroCookieId', JSON.stringify(cookieData));
        console.log(`Set cookie with 90-day expiration: ${this.cookieId}`);
      }

      // For actual messages, add a messageId property to help frontend deduplicate
      if ((data.type === 'message' || data.type === 'follow_up') && data.text) {
        // Adding timestamp to make message unique even with same content
        data.messageId = `${messageTimeId}-${data.text.substring(0, 20)}`;
        
        // Detect greeting messages for special handling
        const isGreeting = data.text.includes("Hello!") ||
                         data.text.includes("Welcome") ||
                         data.text.includes("How can I help you");
                         
        if (isGreeting) {
          console.log(`[WEBSOCKET:${messageTimeId}] DETECTED GREETING MESSAGE: "${preview}..."`);
        }
        
        // Store the raw text preview for duplicate detection
        // @ts-ignore - add temp property for debugging
        data._rawPreview = preview;
      }

      // Notify all message handlers with tracking
      console.log(`[WEBSOCKET:${messageTimeId}] Notifying ${this.messageHandlers.length} handlers`);
      
      // Keep track of which handler processed this message
      const processedHandlers: string[] = [];
      
      // DISABLED: Typing indicators after messages are rendered are no longer needed
      // The loading indicator is set when a message is sent and cleared when response is received
      
      // If we decide to re-enable typing indicators in the future, they should only appear
      // BEFORE a message is received, not after

      this.messageHandlers.forEach((handler, index) => {
        // Generate a handler fingerprint for tracking
        const handlerFingerprint = handler.toString().substring(0, 50);
        processedHandlers.push(handlerFingerprint);
        
        console.log(`[WEBSOCKET:${messageTimeId}] Executing handler #${index+1}/${this.messageHandlers.length}`);
        handler(data);
      });
      
      // Log all handlers that processed this message
      if (data.type === 'message' || data.type === 'follow_up') {
        console.log(`[WEBSOCKET:${messageTimeId}] Message "${preview}" processed by ${processedHandlers.length} handlers`);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket close event
   */
  private handleClose(event: CloseEvent): void {
    console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
    this.isConnected = false;
    this.isConnecting = false;
    this.socket = null;
    this.notifyStatusChange('disconnected');
    
    // Try to reconnect
    this.scheduleReconnect();
  }

  /**
   * Handle WebSocket error event
   */
  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    this.notifyStatusChange('error');
    
    // Socket will close after error, but manually disconnect to be sure
    this.disconnect();
    
    // Try to reconnect
    this.scheduleReconnect();
  }

  /**
   * Schedule reconnection attempt with exponential backoff
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnect attempts reached');
      return;
    }

    const delay = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts));
    console.log(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  /**
   * Notify all status handlers of a connection status change
   */
  private notifyStatusChange(status: 'connected' | 'connecting' | 'disconnected' | 'error'): void {
    this.statusHandlers.forEach(handler => handler(status));
  }

  /**
   * Generate a device fingerprint for user tracking
   */
  private generateDeviceId(): string {
    // Simple device fingerprinting - in a production app, consider using a library
    const components = [
      navigator.userAgent,
      navigator.language,
      window.screen.width + 'x' + window.screen.height,
      new Date().getTimezoneOffset(),
      navigator.platform,
      !!navigator.cookieEnabled,
      !!window.indexedDB,
      !!window.localStorage,
      !!window.sessionStorage
    ];
    
    // Simple hash function
    let hash = 0;
    const str = components.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Convert to a string and make it positive
    return 'device_' + Math.abs(hash).toString(16);
  }

  /**
   * Send device information to the server
   */
  private sendDeviceInfo(): void {
    console.log(`⚠️ CLEARING ALL COOKIES AND LOCAL STORAGE TO FIX USER IDENTIFICATION ISSUES ⚠️`);
    
    // FIRST: Clear all identifiers in localStorage to prevent cross-user contamination
    localStorage.removeItem('deviceId');
    localStorage.removeItem('registerKaroCookieId');
    localStorage.removeItem('paymentCompleted');
    
    // Get the unique tab ID from sessionStorage
    const tabId = sessionStorage.getItem('registerKaroTabId') || generateTabId();
    sessionStorage.setItem('registerKaroTabId', tabId);
    console.log(`🆔 Using fresh tab ID: ${tabId}`);
    
    // Generate completely fresh IDs for everything to ensure isolation
    
    // 1. Fresh session ID with timestamp to prevent collisions
    this.sessionId = `fresh_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    sessionStorage.setItem('chatSessionId', this.sessionId);
    console.log(`🆕 Created completely new session ID: ${this.sessionId}`);
    
    // 2. Fresh device ID
    this.deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem('deviceId', this.deviceId);
    console.log(`🆕 Created new device ID: ${this.deviceId}`);
    
    // 3. Fresh cookie ID
    this.cookieId = `cookie_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const cookieData = {
      id: this.cookieId,
      expires: Date.now() + (90 * 24 * 60 * 60 * 1000) // 90 days
    };
    localStorage.setItem('registerKaroCookieId', JSON.stringify(cookieData));
    console.log(`🆕 Created new cookie ID: ${this.cookieId}`);
    
    if (this.socket) {
      // Tell server to create a new user session - critically important!
      this.socket.send(JSON.stringify({
        type: 'new_session',
        force_new: true,
        session_id: this.sessionId,
        tab_id: tabId
      }));
      console.log(`📤 Sent new_session command with force_new=true`);
      
      // Send cookie ID with force_new flag
      this.socket.send(JSON.stringify({
        type: 'cookie_id',
        cookie_id: this.cookieId,
        force_new: true,
        tab_id: tabId,
        reset_user: true  // Tell server to create new user instead of finding existing
      }));
      console.log(`📤 Sent cookie_id with force_new=true and reset_user=true`);
      
      // Send device ID with force_new flag
      this.socket.send(JSON.stringify({
        type: 'device_id',
        device_id: this.deviceId,
        force_new: true,
        tab_id: tabId,
        reset_user: true  // Tell server to create new user
      }));
      console.log(`📤 Sent device_id with force_new=true and reset_user=true`);
      
      // Send detailed client info
      const clientInfo = {
        device: {
          device_id: this.deviceId,
          tab_id: tabId,
          platform: navigator.platform,
          user_agent: navigator.userAgent.substring(0, 100),
          screen_size: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language,
          last_visit: new Date().toISOString(),
          create_new_user: true,  // Important flag for server
          reset_session: true     // Important flag for server
        }
      };
      
      this.socket.send(JSON.stringify({
        type: 'client_info',
        client_info: clientInfo,
        cookie_id: this.cookieId,
        tab_id: tabId,
        force_new: true,
        reset_user: true
      }));
      console.log(`📤 Sent client_info with all flags to ensure new user creation`);
    }
  }
}

// Export singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;