/**
 * WebSocketService.ts
 * Service for managing WebSocket connections to the backend chat API
 */

// Configurable backend URL - can be overridden via environment variables
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const WS_PROTOCOL = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const WS_URL = process.env.REACT_APP_WS_URL || `${WS_PROTOCOL}//${BACKEND_URL.replace(/^https?:\/\//, '')}/ws`;

export type MessageType = 'message' | 'follow_up' | 'payment_link' | 'show_document_upload' | 'session_info' | 'set_cookie' | 'typing_indicator' | 'typing_ended';

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
    
    try {
      console.log(`Connecting to WebSocket at ${WS_URL}`);
      this.socket = new WebSocket(WS_URL);
      
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.isConnecting = false;
      this.notifyStatusChange('error');
      this.scheduleReconnect();
    }
  }

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
    // If not connected, queue message and try to connect (if not already connecting)
    if (!this.isConnected) {
      console.log('WebSocket not connected, queueing message');
      this.pendingMessages.push({ type: 'message', text });
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
      device_id: this.deviceId
    };

    // Send the actual message
    this.socket?.send(JSON.stringify(message));
    
    // Log this outgoing message
    console.log(`[WEBSOCKET:SEND] Sent message: "${text.substring(0, 30)}..."`);
    
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
      }

      // Handle cookie setting
      if (data.type === 'set_cookie' && data.cookie_id) {
        this.cookieId = data.cookie_id;
        console.log(`Cookie ID set: ${this.cookieId}`);
        
        // Store in localStorage for persistence
        localStorage.setItem('registerKaroCookieId', this.cookieId);
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
      
      // If this is a message that might be followed by more content, trigger typing indicator
      if ((data.type === 'message' || data.type === 'follow_up') && data.text) {
        // Emit a typing indicator after a very short delay so it appears after the actual message
        setTimeout(() => {
          // Signal to UI that agent is still thinking/typing
          this.messageHandlers.forEach(handler => handler({
            type: 'typing_indicator',
            messageId: `typing-${Date.now()}`
          }));
        }, 10);
      }

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
    // Try to get existing cookie ID
    if (!this.cookieId) {
      this.cookieId = localStorage.getItem('registerKaroCookieId');
      console.log(`Using stored cookie ID: ${this.cookieId}`);
    }

    // Try to get existing session ID
    if (!this.sessionId) {
      this.sessionId = sessionStorage.getItem('chatSessionId');
      console.log(`Using stored session ID: ${this.sessionId}`);
    }

    // Generate or retrieve device ID
    if (!this.deviceId) {
      const storedDeviceId = localStorage.getItem('deviceId');
      if (storedDeviceId) {
        this.deviceId = storedDeviceId;
      } else {
        this.deviceId = this.generateDeviceId();
        localStorage.setItem('deviceId', this.deviceId);
      }
      console.log(`Using device ID: ${this.deviceId}`);
    }

    // Send cookie ID if we have one
    if (this.cookieId) {
      this.socket?.send(JSON.stringify({
        type: 'cookie_id',
        cookie_id: this.cookieId
      }));
    }

    // Send device ID
    this.socket?.send(JSON.stringify({
      type: 'device_id',
      device_id: this.deviceId
    }));

    // Send previous session ID if available
    if (this.sessionId) {
      this.socket?.send(JSON.stringify({
        type: 'previous_session_id',
        previous_session_id: this.sessionId
      }));
    }

    // Send detailed client info for better tracking
    const clientInfo = {
    device: {
      device_id: this.deviceId,
      platform: navigator.platform,
      user_agent: navigator.userAgent.substring(0, 100), // Truncate to avoid too much data
      screen_size: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      last_visit: new Date().toISOString()
    }
    };

    this.socket?.send(JSON.stringify({
      type: 'client_info',
      client_info: clientInfo,
      cookie_id: this.cookieId
    }));
  }
}

// Export singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;