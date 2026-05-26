import React, { useEffect } from 'react'
import { CopilotProvider, useCopilot } from './context/CopilotContext'
import commonStorage from './utils/commonStorage';
import CopilotHeader from './components/CopilotHeader'
import CopilotBody from './components/CopilotBody'
import CopilotFooter from './components/CopilotFooter'
import styles from './styles/copilot.module.scss'

/**
 * Main Copilot Content Component
 * Handles initialization, Firebase setup, and message handling
 */

function cleanupFirebaseConnection() {
    if (window.__copilotFirebaseRef) {
        console.log("Cleaning up Firebase connection");
        window.__copilotFirebaseRef.off();
        window.__copilotFirebaseRef.off("value");
        delete window.__copilotFirebaseRef;
    }
}

const CopilotContent = ({
  // UI Configuration
  title = "Copilot",
  placeholder = "Enter a prompt here",
  secondaryPlaceholder,
  className = "",
  maintainHistory = false,
  showHeader = true,
  showCloseIcon = true,
  shouldShowPortal = false,
  showModelSelector = false,
  showDesignSelector = false,
  designSelectorOptions = [],
  modelSelectorOptions = [],
  displayNotification = () => {},
  showNewChat = true,
  jsxTitle = false,
  dispatch = () => {},
  // Event Handlers
  onClose,
  onNewChat,
  onViewHistory,
  onInit,
  onAccept = () => {},
  onReject = () => {},
  promptCallBack = () => {},
  onSubmitCallback = () => {},
  selectRenderer = (items) => {
        const itemsJSX = items.map((item) => {
            const { meta = {}, label } = item;
            const { id, thumbnailUrl, landingPageName } = meta;
            return ({
                value: id,
                label: label,
                type: "landing-pages",
                optionJSX: (
                    <div className="display-flex display-flex-center copilot-template-selector">
                        <div className="img-thumb">
                            <img src={thumbnailUrl} />
                        </div>
                        <div className="thumb-content">
                            <span>{label}</span>
                            <p>{landingPageName}</p>
                        </div>
                        {/* <i className="icon_phoenix-eye" onClick={() => {
                            console.log("Template selected:", id);
                        }}/> */}
                    </div>
                )
            });
        });
        return itemsJSX;
  },
  imageS3Callback,
  onApplyChanges,
  onItemClick,
  
  // API Configuration
  directSyncFromAPI = false,
  apiHelper, // beAPIResource instance
  apiEndPoints,
  payloadPreprocessor,
  // Firebase Configuration
  firebaseHelper, // getDbInstance function
  userId,
  accountId,
  sessionId,
  uniqueSessionId,
  emptyStateText,
  emptyStateIcon,
  defaultPosition,
  addToDashboardCallback,
  skipIndexDBsupport,
  startChatFromBottom = true,
  hideTopLoader = false,
  chatPaginationEnabled = false,
}) => {
  const { 
    messages,
    showHistory,
    clearMessages, 
    toggleHistory, 
    addMessage, 
    sendBotMessage, 
    setLoading, 
    loadChatsFromIndexedDB, 
    saveCurrentChatToIndexedDB,
    startLoadingTimeout,
    clearLoadingTimeout,
    triggerScrollToBottom,
    clearNewMessageDivider
  } = useCopilot();

  // ========== Event Handlers ==========

  // ========== Event Handlers ==========
  
  /**
   * Handles new chat creation
   * Saves current session, cleans up Firebase connections, and sets up new session
   */
  const handleNewChat = async () => {
    // Close history if it's currently open
    if (showHistory) {
      await toggleHistory();
    }

    // Save current session if there are messages and API is configured
    if (messages.length > 0 && apiHelper && apiEndPoints?.saveSession) {
      try {
        // Generate a title based on the first user message or a default
        const firstUserMessage = messages.find(msg => msg.sender === 'user');
        const title = firstUserMessage 
          ? (firstUserMessage.text || firstUserMessage.content || 'Chat Session').substring(0, 50) 
          : 'Chat Session';
        
        console.log('Saving current session with title:', title);
        
        // Call saveSession API
        const saveResponse = await apiHelper[apiEndPoints.saveSession.method](
          apiEndPoints.saveSession.url,
          { title }
        );
        
        console.log('Session saved successfully:', saveResponse);
      } catch (error) {
        console.error('Error saving session:', error);
        // Continue with new chat creation even if save fails
      }
    }

    await clearMessages();

    if (onNewChat) {
      onNewChat();
    }
  };

  /**
   * Handles history view toggle
   * Toggles history display and triggers callback
   */
  const handleViewHistory = async () => {
    await toggleHistory();
    if (onViewHistory) {
      onViewHistory();
    }
  };

  /**
   * Handles prompt selection
   * Sends the selected prompt as a bot message
   */
  const handlePromptCallback = (promptToSend, feedbackToLLM = false, customContext) => {
    console.log("prompt selected, sending:", promptToSend);
    console.log("feedbackToLLM", feedbackToLLM);
    // Trigger bot response with the prompt directly (no user message shown)
    sendBotMessage(promptToSend, null, feedbackToLLM, customContext);

    // Call the original callback if provided
    if (promptCallBack) {
      promptCallBack(promptToSend);
    }
  };

  /**
   * Handles the submission of a message by logging it and sending it as a bot response.
   */
  const handleSubmit = (message) => {
    console.log('Submit message:', message);
    // Send the message as a bot response
    sendBotMessage(message);
  };

  const handleItemClick = (action, callback) => {
    console.log('File handle action:', action, 'with callback:', callback);
    // Call the provided callback if it exists
    onItemClick && onItemClick(action, callback);
  };

  // ========== Firebase Setup ==========

  // ========== Firebase Setup ==========
  
  /**
   * Sets up Firebase real-time connection for receiving messages
   * @param {boolean} chatsLoaded - Whether chats were loaded from IndexedDB
   */
  const setupFirebaseConnection = async (chatsLoaded = false) => {
    // Validate required Firebase props
    if (!firebaseHelper || !userId || !accountId || !sessionId) {
      console.log("Firebase setup skipped - missing required props:", {
        firebaseHelper: !!firebaseHelper,
        userId: !!userId,
        accountId: !!accountId,
        sessionId: !!sessionId,
      });
      return;
    }

    console.log("Copilot:-> Setting up Firebase connection", { chatsLoaded }, `copilot/${accountId}/${userId}/${uniqueSessionId}`);

    // Track if we've skipped the first message when chats are loaded
    let hasSkippedFirstMessage = true;
    
    try {
      // Initialize Firebase database
      const realtimeDb = await firebaseHelper();
      cleanupFirebaseConnection();

      const firebaseRef = realtimeDb.ref(
        `copilot/${accountId}/${userId}/${uniqueSessionId}`
      );

      console.log(
        "Setting up Firebase listener at:",
        `copilot/${accountId}/${userId}/${uniqueSessionId}`
      );

      // Store firebase ref for cleanup
      window.__copilotFirebaseRef = firebaseRef;
      console.log("Copilot:-> Firebase connection established successfully");

      // Return a promise that resolves after the first Firebase event is processed
      return new Promise((resolve) => {
        // Listen for data changes from Firebase (entire data structure updates)
        firebaseRef.on("value", (snapshot) => {
         if (hasSkippedFirstMessage) {
            console.log(
              "Skipping first Firebase message - firebase just initialized"
            );
           hasSkippedFirstMessage = false;
           // Resolve the promise after skipping the first message
           resolve();
           return;
         }
        const rawData = snapshot.val();
        if (!rawData) return;

        console.log("Received Firebase raw data:", rawData);
        console.log("chatsLoaded::", chatsLoaded);
        console.log("hasSkippedFirstMessage::", hasSkippedFirstMessage);

        // Extract the actual message data from the nested structure
        // Expected structure: {status: {...}, block: [...]}
        let messageData = null;

        try {
          // Check if data has the expected direct structure with status and block
          if (rawData.status !== undefined || rawData.block !== undefined || rawData.blocks !== undefined) {
            // Data is already in the expected format
            messageData = rawData;
            console.log("Using direct data format:", messageData);
          } else {
            // Fallback: try to navigate through nested structure (legacy support)
            if (
              rawData[userId] &&
              rawData[userId][accountId] &&
              rawData[userId][accountId][sessionId]
            ) {
              messageData = rawData[userId][accountId][sessionId];
              console.log(
                "Extracted message data from nested structure:",
                messageData
              );
            } else {
              // Use raw data as fallback
              messageData = rawData;
              console.log("Using raw data as fallback:", messageData);
            }
          }
        } catch (error) {
          console.error("Error extracting message data:", error);
          messageData = rawData;
        }

        // Validate that we have actual message data
        if (!messageData) {
          console.log("No valid message data found in Firebase update");
          return;
        }

        // If chats were loaded from IndexedDB OR initial API call will be made, 
        // skip the first Firebase message to prevent duplicate content
        // if ((chatsLoaded) && !hasSkippedFirstMessage) {
        //   console.log(
        //     "Skipping first Firebase message - chats already loaded from IndexedDB or initial API call will be made"
        //   );
        //   hasSkippedFirstMessage = true;
        //   return;
        // }

        // Handle loading state from status
        if (messageData.status) {
          const isProcessing = messageData.status.processing === true;
          const loadingLabel = messageData.status.label || "Processing..."; // Fallback message
          const hasError = messageData.status.error && typeof messageData.status.error === 'object';

          console.log("Firebase loading state:", {
            isProcessing,
            loadingLabel,
            hasError,
            error: messageData.status.error
          });

          // Check for error first
          if (hasError) {
            // Log the error details for debugging
            console.error("Firebase message processing error:", messageData.status.error);
            
            // Clear loading state
            setLoading(false);
            clearLoadingTimeout();
            
            // Show error message to user
            addMessage({
              type: "error",
              content: "An error occurred while processing your request. Please try again later.",
              sender: "bot",
            });
            
            // Save error message to IndexedDB
            setTimeout(() => {
              saveCurrentChatToIndexedDB();
              console.log("Error message saved to IndexedDB");
            }, 100);
            
            return; // Exit early, don't process blocks
          }

          if (isProcessing) {
            // Set loading state with custom message
            setLoading(true, loadingLabel);
            // Reset the 90-second timeout when processing continues
            startLoadingTimeout();
            console.log(
              "Firebase processing=true - resetting 90-second timeout"
            );
            // Continue processing blocks even while loading (partial message)
          } else {
            // Clear loading state and timeout when processing is complete
            setLoading(false);
            clearLoadingTimeout();
            console.log(
              "Firebase processing=false - clearing loading and timeout"
            );
          }
        }

        // Strategy: Skip messages with initial flag (secondary check)
        if (messageData.initial === true) {
          console.log("Skipping Firebase message - has initial flag");
          return;
        }

        // Process block data for message content
        if ((messageData.block && Array.isArray(messageData.block) || (messageData.blocks && Array.isArray(messageData.blocks)))) {
          console.log(
            "Adding new Firebase message blocks to chat:",
            messageData.block || messageData.blocks
          );

          // Add the Firebase message as bot message using block data
          addMessage({
            type: "text",
            blocks: messageData.block || messageData.blocks, // Use block array directly
            sender: "bot",
          });

          // Save to IndexedDB after adding Firebase message
          setTimeout(() => {
            saveCurrentChatToIndexedDB();
            console.log("Firebase message saved to IndexedDB");
          }, 100);
        } else {
          console.log("No block data found in Firebase message");
        }
        });
      });
      
    } catch (firebaseError) {
      console.error("Firebase connection failed:", firebaseError);

      // Show Firebase error to user
      addMessage({
        type: "text",
        content: "Sorry, I encountered an error setting up real-time messaging. Please try refreshing the page.",
        sender: "bot",
      });
      
      // Return a resolved promise even on error to avoid blocking initialization
      return Promise.resolve();
    }
  };

  // ========== API Initialization ==========
  // ========== API Initialization ==========
  
  /**
   * Handles initial API call to set up the copilot session
   * @param {boolean} chatsLoaded - Whether chats were loaded from IndexedDB
   * @returns {boolean} - Whether an initial API call was made
   */
  const handleInitialApiCall = async (chatsLoaded) => {
      // Skip if chats already loaded or API not configured
      if (chatsLoaded || !apiHelper || !apiEndPoints?.init) {
        console.log("Initial API call skipped:", {
          chatsLoaded,
          hasApiHelper: !!apiHelper,
          hasInitEndpoint: !!apiEndPoints?.init,
        });
        return false; // No API call was made
      }

      try {
        console.log("Starting initialization with new API structure");

        // Set loading state while API call is in progress (without loading message for initial call)
        setLoading(true, "skip");
        startLoadingTimeout();

        // Get initial context from onInit if provided
        const initialContext = onInit ? onInit() : {};
        console.log("initialContext", initialContext);

        // Make the initial API call
        const apiResponse = await apiHelper[apiEndPoints.init.method](
          apiEndPoints.init.url,
          initialContext,
          { topLoader: !hideTopLoader },
        );
        console.log("Initial API Response:", apiResponse);

        // Check if this is a Storybook mock response (for demo purposes)
        // If it returns { success: true } without actual Firebase setup, show demo welcome message
        if (
          apiResponse?.success &&
          (!firebaseHelper || !window.__copilotFirebaseRef)
        ) {
          console.log(
            "Mock API response detected - showing demo welcome message"
          );

          // Add a welcome message for demo purposes
          addMessage({
            type: "text",
            content: "Hello! I'm your AI assistant. How can I help you today?",
            sender: "bot",
          });

          // For mock responses, clear loading and timeout since no Firebase event is expected
          setLoading(false);
          clearLoadingTimeout();
        }
        // else {
        //   // For real API responses, only clear loading state but keep timeout running
        //   // The timeout will be cleared when Firebase event arrives or timeout expires
        //   setLoading(false);
        //   console.log("API call completed - keeping timeout active for Firebase event");
        // }

        return true; // API call was made
      } catch (error) {
        console.error("Error during initialization:", error);

        // Add error message to chat
        addMessage({
          type: "text",
          content:
            "Sorry, I encountered an error during initialization. Please try again.",
          sender: "bot",
        });
        // On error, clear both loading and timeout
        setLoading(false);
        clearLoadingTimeout();

        return false; // API call failed
      }
  };

  // ========== Main Initialization Effect ==========
  
  useEffect(() => {
    /**
     * Main initialization function
     * Handles chat loading, API initialization, and Firebase setup
     */
    const initializeCopilot = async () => {
      console.log("=== Copilot Initialization Started ===");

      // Step 1: Try to load existing chat session from IndexedDB
      console.log("calling from initializeCopilot:", uniqueSessionId);
      const chatsLoaded = await loadChatsFromIndexedDB(uniqueSessionId, skipIndexDBsupport);
      console.log("Chats loaded from IndexedDB:", chatsLoaded);

      // Step 2: Determine if an initial API call will be made
      // const willMakeInitialApiCall = !chatsLoaded && apiHelper && apiEndPoints?.init;
      // console.log("Will make initial API call:", willMakeInitialApiCall);

      // // Step 2.5: Clear Firebase bucket if initial API call will be made
      // if (willMakeInitialApiCall && firebaseHelper && userId && accountId && uniqueSessionId) {
      //   try {
      //     console.log("Clearing Firebase bucket before initial API call");
      //     const realtimeDb = await firebaseHelper();
      //     const firebaseRef = realtimeDb.ref(
      //       `copilot/${accountId}/${userId}/${uniqueSessionId}`
      //     );
      //     await firebaseRef.remove();
      //     console.log("Firebase bucket cleared successfully");
      //   } catch (error) {
      //     console.error("Error clearing Firebase bucket:", error);
      //   }
      // }

      // Step 3: Setup Firebase connection BEFORE making API call to avoid race condition
      await setupFirebaseConnection(chatsLoaded);

      // Step 4: Handle initial API call if needed
      handleInitialApiCall(chatsLoaded);

      console.log("=== Copilot Initialization Complete ===");
    };
    
    // Start initialization
    initializeCopilot();
    
    // Cleanup Firebase connection on component unmount
    return () => {
      cleanupFirebaseConnection();
      // Clear any pending loading timeout
      clearLoadingTimeout();
    };
  }, []); // Empty dependency array - run once on mount

  // ========== Handle uniqueSessionId changes ==========
  
  useEffect(() => {
    // When uniqueSessionId changes, we need to set up a new Firebase connection
    if (uniqueSessionId && firebaseHelper && userId && accountId) {
      console.log("uniqueSessionId changed, setting up new Firebase connection:", uniqueSessionId);
      
      // Clean up existing Firebase connection
      cleanupFirebaseConnection();
      
      // Set up new Firebase connection with new uniqueSessionId
      setupFirebaseConnection(false);
    }
    return () => {
      // Clean up Firebase connection before next effect run
      cleanupFirebaseConnection();
    }
  }, [uniqueSessionId]); // React to uniqueSessionId changes

  // ========== Scroll Effect for shouldShowPortal ==========
  
  useEffect(() => {
    if (shouldShowPortal) {
      // Clear any existing new message dividers when portal is shown
      clearNewMessageDivider();
      // Trigger scroll to bottom
      triggerScrollToBottom();
    }
  }, [shouldShowPortal]); // Only depend on shouldShowPortal to avoid infinite loops

  // ========== Render ==========

  // ========== Render ==========
  
  return (
      <div className={`copilotWrapper ${styles.copilotWrapper} ${defaultPosition ? styles.defaultPos : ""}`}>
          <div className={`${styles.chatContainer} ${className}`}>
              {showHeader && <CopilotHeader jsxTitle={jsxTitle} showNewChat={showNewChat} title={title} onClose={onClose} onNewChat={handleNewChat} onViewHistory={handleViewHistory} maintainHistory={maintainHistory} showCloseIcon={showCloseIcon} />}
              <CopilotBody
                  chatPaginationEnabled={chatPaginationEnabled}
                  displayNotification={displayNotification}
                  dispatch={dispatch}
                  onAccept={onAccept}
                  onReject={onReject}
                  onItemClick={handleItemClick}
                  promptCallBack={handlePromptCallback}
                  onSubmit={handleSubmit}
                  selectRenderer={selectRenderer}
                  imageS3Callback={imageS3Callback}
                  onApplyChanges={onApplyChanges}
                  emptyStateText={emptyStateText}
                  emptyStateIcon={emptyStateIcon}
                  addToDashboardCallback={addToDashboardCallback}
                  onNewChat={handleNewChat}
                  onSubmitCallback={onSubmitCallback}
                  skipIndexDBsupport={skipIndexDBsupport}
                  startChatFromBottom={startChatFromBottom}
              />
              {
                !showHistory ?
                <CopilotFooter placeholder={placeholder} secondaryPlaceholder={secondaryPlaceholder} showModelSelector={showModelSelector} modelSelectorOptions={modelSelectorOptions} showDesignSelector={showDesignSelector} designSelectorOptions={designSelectorOptions} onItemClick={handleItemClick} />
                : null
              }
          </div>
      </div>
  );
};

/**
 * Main Copilot Component Wrapper
 * Provides context and renders CopilotContent
 */
const Copilot = (props) => {
  return (
    <CopilotProvider
      // Context Configuration
      currentContext={props.currentContext}
      // API Configuration
      handleChatSessionUpdate={props.handleChatSessionUpdate}
      apiHelper={props.apiHelper} // beAPIResource instance
      isEditMode={props.isEditMode}
      skipIndexDBsupport={props.skipIndexDBsupport}
      startChatFromBottom={props.startChatFromBottom}
      apiEndPoints={props.apiEndPoints}
      directSyncFromAPI={props.directSyncFromAPI}
      payloadPreprocessor={props.payloadPreprocessor}
      // Firebase Configuration
      firebaseHelper={props.firebaseHelper} // getDbInstance function
      userId={props.userId}
      accountId={props.accountId}
      sessionId={props.sessionId}
      // Storage Configuration
      indexDbHelper={commonStorage.createUserHelper(
        props.userId,
        props.accountId,
        props.indexDbName || props.uniqueSessionId || "defaultCopilotStore"
      )}
      uniqueSessionId={props.uniqueSessionId}
      maintainHistory={props.maintainHistory}
      // Loading Configuration
      loadingTimeoutDuration={props.loadingTimeoutDuration}
      getChatHistoryDetails={props.getChatHistoryDetails} // Function to get chat ID for saving/loading
      // Event Handlers
      onNewChat={props.onNewChat} // Pass the onNewChat callback
    >
      <CopilotContent {...props} />
    </CopilotProvider>
  );
};

export default Copilot