import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { Link, useLocation } from "react-router-dom";
import "../../assets/css/ChatBot.css";
import {sendMessage, fetchSessions, fetchSessionMessages, startNewChatSession} from "@/store/chatbot/action";
import FileTreeChatSelection from "./FileTreeChatSelection";
import {fetchFoldersRequest} from "@/store/fileManagement/action";

// Memoized message component to prevent re-renders
const Message = memo(({ message, isLast, isTyping, displayText, currentSessionId }) => {
  // Only show typing animation for the current session's last bot message
  const showTypingAnimation = isLast && message.type === 'bot' && isTyping &&
      (message.sessionId === currentSessionId);

  return (
      <div className={`message ${message.type}`}>
        <div className="message-avatar">
          {message.type === 'user' ?
              <FeatherIcon icon="user" /> :
              <FeatherIcon icon="cpu" />
          }
        </div>
        <div className="message-bubble">
          <div className="message-content">
            {showTypingAnimation
                ? displayText // Show the partially typed text during animation
                : message.content // Show full content when not animating
            }
            {showTypingAnimation && (
                <span className="typing-cursor">|</span>
            )}
          </div>
          <div className="message-timestamp">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
  );
});


// Memoized session item component
const SessionItem = memo(({ session, isActive, onSelect }) => {
  return (
      <div
          className={`session-item ${isActive ? 'active' : ''}`}
          onClick={() => onSelect(session.sessionId)}
      >
        <FeatherIcon icon="message-square" size={16} />
        <div className="session-info">
          <div className="session-name">{session.sessionName}</div>
          <div className="session-preview">
            {session.messages && session.messages.length > 0
                ? session.messages[0].content.substring(0, 30) + "..."
                : "Empty conversation"}
          </div>
        </div>
      </div>
  );
});

const ChatBot = memo(({ rtl }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Optimize selectors to only grab what's needed
  const tree = useSelector((state) => state.fileFolderReducer.tree || []);
  const {
    messages = [],
    sessions = [],
    loading = false,
    currentSessionId = null,
    pendingMessage = false
  } = useSelector((state) => state.chatbotReducer);

  const showGovAI = location.pathname !== "/login";

  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [resizeCount, setResizeCount] = useState(0);
  const [showSessions, setShowSessions] = useState(false);
  const [showFileTree, setShowFileTree] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [sessionNeedsRefresh, setSessionNeedsRefresh] = useState(false);

  const windowRef = useRef(null);
  const chatRef = useRef(null);
  const iframeRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Larger default size
  const defaultSize = { width: 450, height: 600 };
  const maxResizes = 2;
  const resizeStep = 0.3;

  // Track previous message count to detect new message creation
  const prevMessagesLengthRef = useRef(messages.length);

  useEffect(() => {
    if (showFileTree) {
      const userId = JSON.parse(sessionStorage.getItem("authUser"))?.userId;
      dispatch(fetchFoldersRequest({ userId }));
    }
  }, [showFileTree, dispatch]);

  // Detect when a new message is added and current session ID changes
  useEffect(() => {
    // If messages increased and we have a currentSessionId, mark sessions for refresh
    if (messages.length > prevMessagesLengthRef.current && currentSessionId) {
      setSessionNeedsRefresh(true);
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, currentSessionId]);

  // Fetch sessions when needed
  useEffect(() => {
    // This will refresh sessions when sessions panel is shown after a new message
    if (showSessions && sessionNeedsRefresh) {
      dispatch(fetchSessions());
      setSessionNeedsRefresh(false);
    }
  }, [showSessions, sessionNeedsRefresh, dispatch]);


  // Memoize functions
  const handleClick = useCallback(() => {
    setVisible(prevVisible => !prevVisible);
    setSelectedSessionId(null);
    dispatch(startNewChatSession());
  }, []);

  const handleCollapse = useCallback((evt) => {
    setVisible(false);
    evt.preventDefault();
    evt.stopPropagation();
  }, []);

  const handleResize = useCallback((increase, evt) => {
    if (windowRef.current) {
      const win = windowRef.current;
      const currentWidth = parseFloat(win.style.width) || defaultSize.width;
      const currentHeight = parseFloat(win.style.height) || defaultSize.height;

      setResizeCount(prevCount => {
        let newCount = prevCount;

        if (increase && prevCount < maxResizes) {
          win.style.width = `${currentWidth * (1 + resizeStep)}px`;
          win.style.height = `${currentHeight * (1 + resizeStep)}px`;
          newCount = prevCount + 1;
        } else if (!increase && prevCount > -maxResizes) {
          let newWidth = currentWidth - currentWidth * resizeStep;
          let newHeight = currentHeight - currentHeight * resizeStep;

          if (newWidth >= defaultSize.width && newHeight >= defaultSize.height) {
            win.style.width = `${newWidth}px`;
            win.style.height = `${newHeight}px`;
            newCount = prevCount - 1;
          }
        }

        return newCount;
      });
    }

    evt.preventDefault();
    evt.stopPropagation();
  }, [maxResizes, defaultSize.width, defaultSize.height, resizeStep]);

  const handleSendMessage = useCallback((evt) => {
    evt.preventDefault();
    if (!prompt.trim() || loading || pendingMessage) return;

    resetTypingAnimation(); // Reset typing animation when sending a new message

    // Dispatch with sessionId if exists, or create new session
    dispatch(sendMessage({
      documentId: selectedFileId,
      prompt: prompt,
      sessionId: selectedSessionId
    }));

    // Reset prompt
    setPrompt("");
  }, [prompt, loading, pendingMessage, selectedFileId, selectedSessionId, dispatch]);

  const handleFileSelect = useCallback((file) => {
    setSelectedFileId(file.id);
    setSelectedFileName(file.name);
    setShowFileTree(false);
    setSelectedSessionId(null);
  }, []);

  const handleSessionSelect = useCallback((sessionId) => {
    // Only fetch if we're changing sessions
    if (sessionId !== selectedSessionId) {
      resetTypingAnimation(); // Reset typing animation when changing sessions

      dispatch(fetchSessionMessages(sessionId));
      setSelectedSessionId(sessionId);

      // Extract file name from session if available
      const selectedSession = sessions.find(s => s.sessionId === sessionId);
      if (selectedSession) {
        const fileNameMatch = selectedSession.sessionName?.match(/Chat with: ([^(]+)/);
        if (fileNameMatch && fileNameMatch[1]) {
          setSelectedFileName(fileNameMatch[1].trim());
          setSelectedFileId(selectedSession.documentId);
        }
      }
    }
    setShowSessions(false);
  }, [sessions, dispatch, selectedSessionId]);

  const toggleSessionsPanel = useCallback(() => {
    setShowSessions(prev => {
      const newState = !prev;
      // Fetch sessions when opening the sessions panel if not loaded yet
      // OR if we need a refresh after creating a new session
      if (newState && (!sessionsLoaded || sessionNeedsRefresh)) {
        dispatch(fetchSessions());
        setSessionsLoaded(true);
        setSessionNeedsRefresh(false);
      }
      if (newState) {
        setShowFileTree(false);
      }
      return newState;
    });
  }, [sessionsLoaded, sessionNeedsRefresh, dispatch]);

  // Add this separate useEffect to handle session loading when visibility changes
  useEffect(() => {
    // Only load sessions when chat becomes visible and sessions aren't loaded yet
    if (visible && (!sessionsLoaded || sessionNeedsRefresh)) {
      dispatch(fetchSessions());
      setSessionsLoaded(true);
      setSessionNeedsRefresh(false);
    }
  }, [visible, sessionsLoaded, sessionNeedsRefresh, dispatch]);

  const toggleFileTree = useCallback(() => {
    setShowFileTree(prev => {
      const newState = !prev;
      if (newState) {
        setShowSessions(false);
      }
      return newState;
    });
  }, []);

  const clearSelectedFile = useCallback(() => {
    setSelectedFileId(null);
    setSelectedFileName(null);
    setSelectedSessionId(null);
  }, []);

  const startNewChat = useCallback(() => {
    setSelectedSessionId(null);
    setSelectedFileId(null);
    dispatch(startNewChatSession());
    setShowSessions(false);
  }, [dispatch]);

  const stopPropagation = useCallback((evt) => {
    evt.stopPropagation();
  }, []);

  // Memoize expensive calculations
  const getSessionName = useCallback((sessionId) => {
    const session = sessions.find(s => s.sessionId === sessionId);
    return session ? session.sessionName : "New Chat";
  }, [sessions]);

  // Format a message for display - memoized to prevent recreating objects
  const formatMessages = useCallback(() => {
    return (messages || [])
        .map(msg => ({
          id: msg.messageId || Date.now(),
          type: msg.userMessage ? 'user' : 'bot',
          content: msg.content,
          timestamp: msg.timestamp || new Date().toISOString(),
          sortTime: new Date(msg.timestamp || new Date().toISOString()).getTime(),
          sessionId: msg.sessionId || currentSessionId // Track which session this message belongs to
        }))
        .sort((a, b) => a.sortTime - b.sortTime);
  }, [messages, currentSessionId]);

  // Auto-scroll chat to bottom when messages change - with debounce
  useEffect(() => {
    if (chatRef.current) {
      const scrollTimer = setTimeout(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 10);
      return () => clearTimeout(scrollTimer);
    }
  }, [messages.length, displayText]);

  // NEW IMPLEMENTATION:trigger typing animation if you wanna disable it just comment this commented it
  useEffect(() => {
    // Clean up any existing typing animation
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    // Check if there are messages and we're not in a loading state
    if (messages.length > 0 && !loading && !pendingMessage) {
      const lastMessage = messages[messages.length - 1];

      // Only start typing if it's a bot message (not user message)
      if (!lastMessage.userMessage && lastMessage.messageId !== lastMessageId) {
        console.log("Starting typing animation for message:", lastMessage.messageId);

        // Update the last processed message ID
        setLastMessageId(lastMessage.messageId);

        // Reset typing animation state
        setIsTyping(true);
        setTypingIndex(0);
        setDisplayText(""); // Start with empty string

        const fullText = lastMessage.content;

        // Start with a delay to ensure the component has rendered
        setTimeout(() => {
          // Use a separate variable to track index outside of the interval closure
          let index = 0;

          // Create a new interval for character-by-character typing
          typingTimerRef.current = setInterval(() => {
            if (index < fullText.length) {
              // Important: Make a brand new string each time to trigger re-render
              const newText = fullText.substring(0, index + 1);
              setDisplayText(newText);
              index++;
            } else {
              // Animation is complete
              console.log("Typing animation complete");
              clearInterval(typingTimerRef.current);
              typingTimerRef.current = null;

              // Important: Set isTyping to false after a short delay
              setTimeout(() => {
                setIsTyping(false);
              }, 500);
            }
          }, 30); // Slightly slower speed for more visible typing effect
        }, 100); // Small initial delay
      }
    }

    // Cleanup function
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [messages, loading, pendingMessage, lastMessageId]);

  // Additional debug cleanup function to call when needed
  const resetTypingAnimation = () => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setIsTyping(false);
    setDisplayText("");
    setTypingIndex(0);
    console.log("Animation state manually reset");
  };

  // Memoize rendered message list to prevent unnecessary re-renders
  const formattedMessages = formatMessages();

  if (!showGovAI) {
    return null;
  }

  return (
      <div
          className={`chatbot ${rtl ? "rtl" : "ltr"}`}
          onClick={handleClick}
      >
        <div className="icon">
          <i className="ri-question-answer-fill"></i>
        </div>
        {visible && (
            <div
                ref={windowRef}
                className={`chat-window ${rtl ? "rtl" : "ltr"} ${visible ? "visible" : "hidden"}`}
                style={{width: defaultSize.width, height: defaultSize.height}}
                onClick={stopPropagation}
            >
              <div className="chat-header">
                <div className="chat-title-container">
                  <button
                      type="button"
                      className="sessions-button"
                      onClick={toggleSessionsPanel}
                      title="Chat sessions"
                  >
                    <FeatherIcon icon="message-square" size={16} />
                  </button>
                  <span>{selectedSessionId ? getSessionName(selectedSessionId) : (selectedFileName ? `Chat with: ${selectedFileName}` : "Chat with AI")}</span>
                </div>
                <div className="chat-controls">
                  <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={toggleFileTree}
                      title="Select PDF file"
                  >
                    <FeatherIcon icon="file" />
                  </button>

                  {selectedFileId && (
                      <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={clearSelectedFile}
                          title="Clear selected file"
                      >
                        <FeatherIcon icon="x-circle" />
                      </button>
                  )}

                  <button
                      type="button"
                      className="btn btn-sm btn-warning"
                      onClick={(e) => handleResize(true, e)}
                      title="Increase size"
                  >
                    <FeatherIcon icon="maximize" />
                  </button>

                  <button
                      type="button"
                      className="btn btn-sm btn-info"
                      onClick={(e) => handleResize(false, e)}
                      title="Decrease size"
                  >
                    <FeatherIcon icon="minimize" />
                  </button>

                  <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={handleCollapse}
                      title="Close chat"
                  >
                    <FeatherIcon icon="x" />
                  </button>

                  <Link
                      className="btn btn-sm btn-warning"
                      to="/govai"
                      target="_self"
                      title="Open in full screen"
                  >
                    <FeatherIcon icon="maximize-2" />
                  </Link>
                </div>
              </div>

              {showSessions ? (
                  <div className="sessions-panel">
                    <h4>Your conversations</h4>
                    <button
                        className="new-chat-btn"
                        onClick={startNewChat}
                    >
                      <FeatherIcon icon="plus" /> New Chat
                    </button>
                    <div className="sessions-list">
                      {sessions.length === 0 ? (
                          <div className="no-sessions">No previous conversations</div>
                      ) : (
                          sessions.map(session => (
                              <SessionItem
                                  key={session.sessionId}
                                  session={session}
                                  isActive={selectedSessionId === session.sessionId}
                                  onSelect={handleSessionSelect}
                              />
                          ))
                      )}
                    </div>
                  </div>
              ) : showFileTree ? (
                  <div className="file-tree-panel">
                    <h4>Select a PDF file</h4>
                    <div className="file-selector-container border rounded-md p-2 overflow-auto">
                      {tree.length === 0 ? (
                          <div className="no-files">No PDF files available</div>
                      ) : (
                          tree.map(node => (
                              <FileTreeChatSelection
                                  key={node.id}
                                  node={node}
                                  onFileSelect={handleFileSelect}
                                  selectedFileId={selectedFileId}
                              />
                          ))
                      )}
                    </div>
                    <button
                        className="close-panel-btn"
                        onClick={() => setShowFileTree(false)}
                    >
                      <FeatherIcon icon="chevron-left" /> Back to chat
                    </button>
                  </div>
              ) : (
                  <div className="chat-container">
                    <div className="chat-messages" ref={chatRef}>
                      {messages.length === 0 && (
                          <div className="welcome-message">
                            <div className="welcome-icon">
                              <FeatherIcon icon="message-circle" size={32} />
                            </div>
                            <h3>Welcome to AI Assistant</h3>
                            <p>
                              {selectedFileId ?
                                  `Ask questions about "${selectedFileName}"` :
                                  "Ask me anything or select a PDF file to chat about specific content"}
                            </p>
                            {!selectedFileId && (
                                <button
                                    className="select-pdf-btn"
                                    onClick={toggleFileTree}
                                >
                                  <FeatherIcon icon="file" /> Select a PDF
                                </button>
                            )}
                          </div>
                      )}

                      {/* Use memoized formattedMessages */}
                      {formattedMessages.map((formattedMsg, index) => (
                          <Message
                              key={formattedMsg.id}
                              message={formattedMsg}
                              isLast={index === formattedMessages.length - 1}
                              isTyping={isTyping && index === formattedMessages.length - 1 && formattedMsg.type === 'bot'}
                              displayText={displayText}
                              currentSessionId={selectedSessionId} // Pass the current session ID
                          />
                      ))}

                      {/* Show loading indicator when waiting for bot response */}
                      {(loading || pendingMessage) && (
                          <div className="message bot">
                            <div className="message-avatar">
                              <FeatherIcon icon="cpu" />
                            </div>
                            <div className="message-bubble">
                              <div className="message-content">
                                <div className="loading-dots">
                                  <span>.</span><span>.</span><span>.</span>
                                </div>
                              </div>
                            </div>
                          </div>
                      )}
                    </div>

                    <form onSubmit={handleSendMessage} className="chat-input">
                      <input
                          type="text"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder={
                            selectedFileId
                                ? `Ask about ${selectedFileName}...`
                                : "Ask me anything..."
                          }
                          disabled={loading || pendingMessage}
                      />
                      <button type="submit" disabled={!prompt.trim() || loading || pendingMessage}>
                        <FeatherIcon icon="send"/>
                      </button>
                    </form>
                  </div>
              )}
            </div>
        )}
      </div>
  );
});

export default ChatBot;