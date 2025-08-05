// @/store/chatbot/reducer.js
import {
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  FETCH_SESSIONS_REQUEST,
  FETCH_SESSIONS_SUCCESS,
  FETCH_SESSIONS_FAILURE,
  FETCH_SESSION_MESSAGES_REQUEST,
  FETCH_SESSION_MESSAGES_SUCCESS,
  FETCH_SESSION_MESSAGES_FAILURE, START_NEW_CHAT
} from './actiontype';

const initialState = {
  messages: [],
  sessions: [],
  loading: false,
  error: null,
  currentSessionId: null,
  pendingMessage: false
};

const chatbotReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_MESSAGE_REQUEST:
      // Add the user message immediately to the UI
      const userMessage = action.payload.prompt
          ? {
            messageId: Date.now().toString(), // Generate a temporary ID
            content: action.payload.prompt,
            userMessage: true,
            timestamp: new Date().toISOString()
          }
          : null;
          console.log("userMessage-->",userMessage)
      return {
        ...state,
        loading: true,
        pendingMessage: true,
        // We'll add user message here if you want to show it immediately
        // This assumes action.payload contains the user message
        messages: userMessage
            ? [...state.messages, userMessage]
            : state.messages
      };

    case SEND_MESSAGE_SUCCESS:
      // First, make sure we're handling the response Mainarea correctly
      // The response should include a message or array of messages
      const aiResponse = action.payload;

      // Parse the response properly - assume it's an array of messages
      // If it's not an array, convert it to one
      const messageArray = Array.isArray(aiResponse) ? aiResponse : [aiResponse];

      // Get the latest bot message
      const aiMessage = messageArray.find(msg => !msg.isUserMessage) || {
        messageId: Date.now().toString(),
        content: "Sorry, I couldn't process your request.",
        timestamp: new Date().toISOString(),
        isUserMessage: false
      };

      // Update sessions with the new message
      const updatedSessions = state.sessions.map(session => {
        // If this is the current session, update its messages
        if (session.sessionId === (action.payload.sessionId || state.currentSessionId)) {
          return {
            ...session,
            messages: [...(session.messages || []), aiMessage]
          };
        }
        return session;
      });

      return {
        ...state,
        loading: false,
        pendingMessage: false,
        // Make sure to add the message with the correct Mainarea
        messages: [...state.messages, {
          messageId: aiMessage.messageId,
          content: aiMessage.content,
          timestamp: aiMessage.timestamp,
          userMessage: false // This should be false for bot messages
        }],
        sessions: updatedSessions,
        currentSessionId: action.payload.sessionId || state.currentSessionId
      };

    case SEND_MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
        pendingMessage: false,
        error: action.payload.error
      };

    case FETCH_SESSIONS_REQUEST:
      return {
        ...state,
        loading: true
      };

    case FETCH_SESSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        sessions: action.payload
      };

    case FETCH_SESSIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    case FETCH_SESSION_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true,
        messages: [] // Clear messages when loading a different session
      };

    case FETCH_SESSION_MESSAGES_SUCCESS:
      // Update the current session ID when messages are loaded
      return {
        ...state,
        loading: false,
        messages: action.payload,
        currentSessionId: action.payload.length > 0 ? action.payload[0].sessionId : state.currentSessionId
      };

    case FETCH_SESSION_MESSAGES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    case START_NEW_CHAT:
      return {
        ...state,
        currentSessionId: null,
        messages: []
      };

    default:
      return state;
  }
};

export default chatbotReducer;