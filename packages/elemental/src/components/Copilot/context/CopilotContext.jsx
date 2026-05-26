import React, { createContext, useContext, useReducer, useRef } from "react";
import { ACTIONS } from "./actions";
import { generateBotResponse } from "../utils/tempUtils";
import { buildMessageObject } from "../utils/chatHelpers";
import { dummyChatHistory } from "../utils/mockData";
import { noop, set } from "lodash";

const maintainIndexDBHistory = false;

// Initial state for chat
const initialState = {
  messages: [],
  isLoading: false,
  loadingMessage: null, // Custom loading message
  loadingTimestamp: null,
  error: null,
  shouldClearDivider: false,
  showHistory: false,
  historyLoading: false, // Loading state for chat history
  chatHistory: [],
  reportSelectionState: {
    isSelectionOn: null,
    reportTitle: null,
    reportId: null
  },
  currentChatId: null, // Track current chat ID for updating history
  scrollToBottom: false, // Trigger for scrolling to bottom
  // Pagination state
  pagination: {
    pageSize: 25,
    startIndex: 0,
    totalMessages: 0,
    isLoadingMore: false,
    hasMoreMessages: true
  },
};

// Reducer function
const chatReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null,
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.loading,
        loadingMessage: action.payload.message || null,
        loadingTimestamp: action.payload.loading
          ? (state.isLoading ? state.loadingTimestamp : new Date().toISOString())
          : null,
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case ACTIONS.CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
        error: null,
        shouldClearDivider: false,
        isLoading: false, // Also reset loading state for clean start
        currentChatId: null, // Clear current chat ID for new chat
        pagination: {
          pageSize: 25,
          startIndex: 0,
          totalMessages: 0,
          isLoadingMore: false,
          hasMoreMessages: true
        },
      };
    case ACTIONS.CLEAR_NEW_MESSAGE_DIVIDER:
      return {
        ...state,
        shouldClearDivider: !state.shouldClearDivider, // Toggle to trigger effect
      };
    case ACTIONS.TOGGLE_HISTORY:
      return {
        ...state,
        showHistory: !state.showHistory,
      };
    case ACTIONS.SET_HISTORY_LOADING:
      return {
        ...state,
        historyLoading: action.payload,
      };
    case ACTIONS.LOAD_HISTORY_CHAT:
      return {
        ...state,
        messages: action.payload.messages,
        showHistory: false,
        shouldClearDivider: false,
        currentChatId: action.payload.chatId,
      };
    case ACTIONS.SAVE_CHAT_TO_HISTORY:
      return {
        ...state,
        chatHistory: [action.payload, ...state.chatHistory],
        currentChatId: action.payload.id,
      };
    case ACTIONS.UPDATE_CURRENT_CHAT:
      return {
        ...state,
        chatHistory: state.chatHistory.map(chat =>
          chat.id === state.currentChatId
            ? { ...chat, messages: [...state.messages] }
            : chat
        ),
      };
    case ACTIONS.SET_CURRENT_CHAT_ID:
      return {
        ...state,
        currentChatId: action.payload,
      };
    case ACTIONS.SET_CHAT_HISTORY:
      return {
        ...state,
        chatHistory: action.payload,
      };
    case ACTIONS.UPDATE_MESSAGE_SUGGESTION_STATE:
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.messageId
            ? { ...message, suggestionState: action.payload.suggestionState }
            : message
        ),
      };
    case ACTIONS.UPDATE_MESSAGE_ACTION_STATE:
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.messageId
            ? { ...message, actionState: action.payload.actionState }
            : message
        ),
      };
    case ACTIONS.UPDATE_FILE_HANDLE_STATE:
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.messageId
            ? { ...message, fileHandleState: action.payload.fileHandleState }
            : message
        ),
      };
    case ACTIONS.UPDATE_INPUT_LABEL_STATE:
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.messageId
            ? { ...message, inputLabelState: action.payload.inputLabelState }
            : message
        ),
      };
    case ACTIONS.UPDATE_SELECT_STATE:
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.messageId
            ? { ...message, selectState: action.payload.selectState }
            : message
        ),
      };
    case ACTIONS.UPDATE_CUSTOM_FIELD_SELECTION_STATE:
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.messageId
            ? { ...message, customFieldSelectionState: action.payload.customFieldSelectionState }
            : message
        ),
      };
    case ACTIONS.UPDATE_MULTISELECT_DROPDOWN_STATE:
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.messageId
            ? { ...message, multiSelectDropdownState: action.payload.multiSelectDropdownState }
            : message
        ),
      };
    case ACTIONS.UPDATE_STEPPER_STATE:
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.messageId
            ? { ...message, stepperState: action.payload.stepperState }
            : message
        ),
      };
    case ACTIONS.REMOVE_COMPLETED_STEPPER:
      return {
        ...state,
        messages: state.messages.map(message => {
          if (message.stepperState && message.stepperState[action.payload.stepperId]) {
            const { [action.payload.stepperId]: removedStepper, ...remainingStepperState } = message.stepperState;
            return {
              ...message,
              stepperState: Object.keys(remainingStepperState).length > 0 ? remainingStepperState : undefined
            };
          }
          return message;
        }),
      };
    case ACTIONS.REMOVE_COMPONENT_BY_MESSAGE_ID:
      return {
          ...state,
          messages: state.messages.filter((message) => {
              if (message.id === action.payload.messageId) {
                  let filteredMessages = message.blocks.filter((block) => block.componentId !== action.payload.componentId);
                  // If no blocks remain, remove the entire message by returning false
                  return filteredMessages.length > 0;
              }
              return true; // Keep other messages
          }).map((message) => {
              if (message.id === action.payload.messageId) {
                  // Update the blocks for the target message if it still exists
                  let filteredMessages = message.blocks.filter((block) => block.componentId !== action.payload.componentId);
                  return {
                      ...message,
                      blocks: filteredMessages,
                  };
              }
              return message;
          }),
      };
    case ACTIONS.REMOVE_COMPONENT_BY_COMPONENT_ID:
      return {
          ...state,
          messages: state.messages.map((message) => {
              if (message.blocks && Array.isArray(message.blocks)) {
                  let filteredMessages = message.blocks.filter((block) => block.componentId !== action.payload.componentId);
                  return {
                      ...message,
                      blocks: filteredMessages.length > 0 ? filteredMessages : undefined,
                  };
              }
              return message;
          }),
      };
    case ACTIONS.REMOVE_MESSAGE_BY_COMPONENT_ID:
      return {
          ...state,
          messages: state.messages.filter((message) => {
              // Check if message has blocks with the specified componentId
              if (message.blocks && Array.isArray(message.blocks)) {
                  const hasComponentId = message.blocks.some((block) => block.componentId === action.payload.componentId);
                  return !hasComponentId; // Remove message if it contains the componentId
              }
              return true; // Keep messages without blocks
          }),
      };
    case ACTIONS.REMOVE_LAST_MESSAGE:
      return {
          ...state,
          messages: state.messages.length > 0 ? state.messages.slice(0, -1) : [],
      };
    case ACTIONS.TRIGGER_SCROLL_TO_BOTTOM:
      return {
        ...state,
        scrollToBottom: !state.scrollToBottom, // Toggle to trigger re-render
      };
    case ACTIONS.UPDATE_REPORT_SELECTION_STATE:
      return {
        ...state,
        reportSelectionState: {
          ...state.reportSelectionState,
          isSelectionOn: action.payload.isSelectionOn,
          reportTitle: action.payload.reportTitle,
          reportId: action.payload.reportId
        }
      };
    case ACTIONS.SET_PAGINATION_LOADING:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          isLoadingMore: action.payload
        }
      };
    case ACTIONS.LOAD_MORE_MESSAGES:
      return {
        ...state,
        messages: [...action.payload.messages, ...state.messages], // Prepend older messages
        pagination: {
          ...state.pagination,
          startIndex: action.payload.startIndex,
          totalMessages: action.payload.totalMessages,
          hasMoreMessages: action.payload.hasMoreMessages,
          isLoadingMore: false
        }
      };
    case ACTIONS.RESET_PAGINATION:
      return {
        ...state,
        pagination: {
          pageSize: 25,
          startIndex: 0,
          totalMessages: 0,
          isLoadingMore: false,
          hasMoreMessages: true
        }
      };
    case ACTIONS.SET_PAGINATION_DATA:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          totalMessages: action.payload.totalMessages,
          hasMoreMessages: action.payload.hasMoreMessages,
          startIndex: action.payload.startIndex || state.pagination.startIndex
        }
      };
    default:
      return state;
  }
};

// Create context
const ChatContext = createContext();

// Provider component
export const CopilotProvider = ({ 
  children, 
  currentContext, 
  apiHelper, // This will receive beAPIResource
  directSyncFromAPI,
  apiEndPoints, 
  firebaseHelper, // This will receive getDbInstance
  userId, 
  accountId, 
  payloadPreprocessor, 
  indexDbHelper, 
  uniqueSessionId, 
  maintainHistory = false,
  handleChatSessionUpdate,
  isEditMode,
  loadingTimeoutDuration = 0, // Loading timeout in milliseconds, defaults to 90 seconds
  getChatHistoryDetails = noop, // Function to get chat ID while saving
  onNewChat, // Callback for new chat creation
  skipIndexDBsupport
}) => {
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialState,
    chatHistory: dummyChatHistory
  });

  let customContextRef = useRef(null)
  let rootLevelSelectedChartContextRef = useRef(null)
  let rootLevelContextRef = useRef(null)

  // Flag to prevent multiple chat creation
  const chatCreationInProgress = React.useRef(false);
  
  // Flag to prevent saving immediately after loading from IndexedDB
  const isLoadingFromIndexedDB = React.useRef(false);
  
  // Flag to track IndexedDB availability
  const indexedDBAvailable = React.useRef(true);
  
  // Loading timeout management
  const loadingTimeoutRef = React.useRef(null);
  const LOADING_TIMEOUT_DURATION = loadingTimeoutDuration; // Use prop value or default

  // Test IndexedDB availability on mount
  // React.useEffect(() => {
  //   const testIndexedDB = async () => {
  //     if (!indexDbHelper) {
  //       console.log('📝 IndexedDB helper not provided - persistence will be disabled');
  //       indexedDBAvailable.current = false;
  //       return;
  //     }

  //     try {
  //       // Test if IndexedDB operations work by trying to get keys
  //       await indexDbHelper.getAllKeys();
  //       console.log('✅ IndexedDB is available and working');
  //       indexedDBAvailable.current = true;
  //     } catch (error) {
  //       console.log('❌ IndexedDB test failed:', error.message);
  //       console.log('IndexedDB operations will be skipped to prevent errors');
  //       indexedDBAvailable.current = false;
  //     }
  //   };

  //   testIndexedDB();
  // }, [indexDbHelper]);

  /**
   * Starts or resets the loading timeout
   * Sets loading to false after the configured timeout duration unless reset by Firebase processing status
   */
  const startLoadingTimeout = () => {
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    
    // Set new timeout
    loadingTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      loadingTimeoutRef.current = null;
    }, LOADING_TIMEOUT_DURATION);
  };

  /**
   * Clears the loading timeout
   */
  const clearLoadingTimeout = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  // IndexedDB helper functions
  const saveCurrentChatToIndexedDB = async () => {
    if (skipIndexDBsupport) {
      return;
    }
    // Early exit if IndexedDB is not available
    if (!indexDbHelper || !uniqueSessionId || !state.currentChatId || indexedDBAvailable.current === false) {
      if (indexedDBAvailable.current === false) {
        console.log('Skipping IndexedDB save - IndexedDB not available');
      }
      return;
    }

    try {
      // Filter out applyChanges messages before saving to IndexedDB
      const filteredMessages = state.messages.filter(message => {
        // Skip messages of type 'applyChanges'	
        if (message.type === 'applyChanges') {	
          return false;	
        }
        
        // Skip messages that have blocks where all blocks are 'applyChanges' type
        if (message.blocks && Array.isArray(message.blocks)) {
          const hasNonApplyChangesBlocks = message.blocks.some(block => block.type !== 'applyChanges');
          if (!hasNonApplyChangesBlocks) {
            return false; // All blocks are applyChanges, skip this message
          }
        }
        
        return true; // Keep this message
      });

      // Create the chat object with filtered messages
      const chatToSave = {
        id: state.currentChatId,
        messages: filteredMessages, // Save filtered messages (excluding applyChanges)
        lastUpdated: new Date().toISOString(),
        isLoading: state.isLoading,
        loadingTimestamp: state.loadingTimestamp,
        loadingMessage: state.loadingMessage,
      };
      
      // Try to get additional chat metadata from history if available
      const currentChat = state.chatHistory.find(chat => chat.id === state.currentChatId);
      if (currentChat) {
        // Include title and date info if available
        chatToSave.title = currentChat.title;
        chatToSave.date = currentChat.date;
        chatToSave.dateFormatted = currentChat.dateFormatted;
      }
      
      const key = `chat_${uniqueSessionId}_${state.currentChatId}`;
      getChatHistoryDetails({ 
        currentChatId: state.currentChatId,
        indexedDBKey: key
      }); // Call getChatHistoryDetails if provided
      
      // Save to IndexedDB
      await indexDbHelper.set(key, chatToSave);
    } catch (error) {
      console.log('IndexedDB save error:', error);
      
      // Handle specific IndexedDB errors
      if (error.name === 'NotFoundError' && error.message.includes('object stores')) {
        console.log('❌ IndexedDB object store not found - marking IndexedDB as unavailable');
        indexedDBAvailable.current = false;
      } else if (error.name === 'NotFoundError' || error.message.includes('transaction')) {
        console.log('IndexedDB transaction error - marking IndexedDB as unavailable');
        indexedDBAvailable.current = false;
      } else {
        console.error('Unexpected IndexedDB error:', error);
      }
    }
  };

  const clearCurrentChatFromIndexedDB = async () => {
    if (indexDbHelper && uniqueSessionId && state.currentChatId) {
      try {
        const key = `chat_${uniqueSessionId}_${state.currentChatId}`;
        
        // Wrap the actual IndexedDB operation in its own try-catch
        try {
          await indexDbHelper.delete(key);
        } catch (dbError) {
          // Handle specific IndexedDB errors at the operation level
          if (dbError.name === 'NotFoundError' || dbError.message.includes('object stores') || dbError.message.includes('transaction')) {
            console.log('IndexedDB transaction/object store error - likely in Storybook/demo environment, skipping clear operation');
            return; // Exit early for demo environment errors
          }
          // Re-throw other errors to be caught by outer catch
          throw dbError;
        }
        
      } catch (error) {
        console.error('Error clearing chat from IndexedDB:', error);
        
        // This catch block handles any other errors that might occur
        console.warn('IndexedDB clear operation failed, continuing without clearing:', error.message);
      }
    }
  };

  const loadChatsFromIndexedDB = async (uniqueSessionId, skipIndexDBsupport) => {
    if (!isEditMode && skipIndexDBsupport) return false;

    if (isEditMode) {
        await clearCurrentChatFromIndexedDB();
        const sanitizedUniqueSessionId = uniqueSessionId ? uniqueSessionId.replace(/\//g, "") : uniqueSessionId;
        await loadHistoryChat(sanitizedUniqueSessionId);
    } else {
        if (skipIndexDBsupport) {
            return false;
        }
        if (indexDbHelper && uniqueSessionId) {
            try {
                // Early check for IndexedDB availability - this is where the error occurs in Storybook
                let allKeys;
                try {
                    allKeys = await indexDbHelper.getAllKeys();
                } catch (dbError) {
                    // Handle specific IndexedDB object store errors (common in Storybook/demo environments)
                    if (dbError.name === "NotFoundError" || dbError.message.includes("object stores")) {
                        return null;
                    }
                    // Re-throw other database errors
                    throw dbError;
                }

                const sessionChatKeys = allKeys.filter((key) => key.startsWith(`chat_${uniqueSessionId}_`));

                if (sessionChatKeys.length > 0) {
                    const loadedChats = [];
                    for (const key of sessionChatKeys) {
                        try {
                            const chatData = await indexDbHelper.get(key);
                            if (chatData) {
                                loadedChats.push(chatData);
                            }
                        } catch (error) {
                            console.error(`Error loading chat ${key}:`, error);
                        }
                    }

                    if (loadedChats.length > 0) {
                        // Sort chats by last updated (newest first)
                        loadedChats.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

                        // Load the most recent chat
                        const mostRecentChat = loadedChats[0];

                        if (mostRecentChat.isLoading && mostRecentChat.loadingTimestamp) {
                            const now = Date.now();
                            const loadingStart = new Date(mostRecentChat.loadingTimestamp).getTime();
                            const elapsed = now - loadingStart;
                            const remaining = LOADING_TIMEOUT_DURATION - elapsed;
                            if (remaining > 0) {
                                setLoading(true, mostRecentChat.loadingMessage);
                                loadingTimeoutRef.current = setTimeout(() => {
                                    setLoading(false);
                                    loadingTimeoutRef.current = null;
                                }, remaining);
                            } else {
                                setLoading(false);
                            }
                        }

                        // Set flag to prevent immediate saving after loading
                        isLoadingFromIndexedDB.current = true;

                        dispatch({
                            type: ACTIONS.LOAD_HISTORY_CHAT,
                            payload: {
                                messages: mostRecentChat.messages,
                                chatId: mostRecentChat.id,
                            },
                        });

                        // Update chat history with all loaded chats
                        dispatch({ type: ACTIONS.SAVE_CHAT_TO_HISTORY, payload: mostRecentChat });

                        // Reset the flag after a short delay
                        setTimeout(() => {
                            isLoadingFromIndexedDB.current = false;
                        }, 500);

                        return mostRecentChat.id; // Return the loaded chat ID
                    }
                } else {
                    console.log("No session chat keys found for uniqueSessionId:", uniqueSessionId);
                }
            } catch (error) {
                console.error("Error loading chats from IndexedDB:", error);

                // Additional fallback for any missed IndexedDB errors
                if (error.name === "NotFoundError" || error.message.includes("object stores") || error.message.includes("transaction")) {
                    console.log("IndexedDB transaction/object store error - likely in Storybook/demo environment, skipping IndexedDB operations");
                    return null;
                }

                // For other errors, still return null but log them
                console.warn("IndexedDB operation failed, continuing without saved chats:", error.message);
            }
        } else {
            console.log("IndexedDB loading skipped - missing props:", { indexDbHelper, uniqueSessionId });
        }
        return null; // No chats loaded
    }
  };

  // Action creators
  const addMessage = (message, LLMfeedback = false, extraParams, rootLevelContext) => {
    customContextRef.current = extraParams;
    rootLevelContextRef.current = rootLevelContext;
    const newMessage = buildMessageObject(message);
    dispatch({ type: ACTIONS.ADD_MESSAGE, payload: newMessage });

    // Set loading state immediately when user sends a message
    if (message.sender === "user") {
      if (!LLMfeedback) {
        setLoading(true);
        // Start the loading timeout immediately
        startLoadingTimeout();
      }

      dispatch({ type: ACTIONS.CLEAR_NEW_MESSAGE_DIVIDER });

      // Disable actionable elements in previous messages and persist to IndexedDB
      state.messages.forEach((msg, index) => {
        // Check if message has suggestions that aren't selected
        // Only disable if no suggestion was previously selected (don't override previous selections)
        if (
          msg.blocks?.some((block) => block.type === "suggestions") &&
          (!msg.suggestionState?.selectedSuggestionId ||
            msg.suggestionState?.selectedSuggestionId === null)
        ) {
          updateMessageSuggestionState(msg.id, "DISABLED_BY_NEWER_MESSAGE");
        }

        // Check if message has actions that aren't selected
        if (
          msg.blocks?.some((block) => block.type === "actions") &&
          !msg.actionState?.selectedAction
        ) {
          updateActionableButtonState(msg.id, "DISABLED_BY_NEWER_MESSAGE");
        }

        // Check if message has actions that aren't selected
        if (msg.blocks?.some(block => block.type === 'select') && !msg?.selectState?.isUsed) {
          updateSelectState(msg.id, 'DISABLED_BY_NEWER_MESSAGE');
        }

        // Check if message has actions that aren't selected
        if (msg.blocks?.some(block => block.type === 'fileHandle') && !msg.fileHandleState?.isUsed) {
          updateFileHandleState(msg.id, 'DISABLED_BY_NEWER_MESSAGE');
        }

        // Check if message has actions that aren't selected
        if (msg.blocks?.some(block => block.type === 'custom-field-mapping') && !msg?.customFieldSelectionState?.isUsed) {
          updateCustomFieldSelectionState(msg.id, 'DISABLED_BY_NEWER_MESSAGE');
        }

        // Check if message has actions that aren't selected
        if (msg.blocks?.some(block => block.type === 'inputLabel') && !msg.inputLabelState?.isUsed) {
          updateInputLabelState(msg.id, 'DISABLED_BY_NEWER_MESSAGE');
        }
      });
    }

    // Update current chat in history if we're in an existing chat
    if (state.currentChatId) {
      // Use setTimeout to ensure the message is added to state first
      setTimeout(() => {
        dispatch({ type: ACTIONS.UPDATE_CURRENT_CHAT });
      }, 0);
    }

    // For bot messages (especially Firebase messages), ensure they get saved to IndexedDB
    // if (message.sender === "bot" && state.currentChatId) {
    //   // Use setTimeout to ensure the message is in state before saving
    //   setTimeout(() => {
    //     console.log("after state:", state.messages);
    //     saveCurrentChatToIndexedDB();
    //   }, 200);
    // }
  };

  const setLoading = (loading, message = null) => {
    dispatch({ 
      type: ACTIONS.SET_LOADING, 
      payload: { loading, message } 
    });
  };

  const setError = (error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  };

  const setHistoryLoading = (loading) => {
    dispatch({ type: ACTIONS.SET_HISTORY_LOADING, payload: loading });
  };

  const clearMessages = async () => {
    // Clear current chat from IndexedDB before clearing messages
    await clearCurrentChatFromIndexedDB();
    
    // Clear any pending loading timeout
    clearLoadingTimeout();
    
    // Clean up Firebase connection if it exists
    if (window.__copilotFirebaseRef) {
      window.__copilotFirebaseRef.off();
      delete window.__copilotFirebaseRef;
    }
    
    dispatch({ type: ACTIONS.CLEAR_MESSAGES });
  };

  const clearNewMessageDivider = () => {
    dispatch({ type: ACTIONS.CLEAR_NEW_MESSAGE_DIVIDER });
  };

  const triggerScrollToBottom = () => {
    dispatch({ type: ACTIONS.TRIGGER_SCROLL_TO_BOTTOM });
  };

  const removeReportPill = () => {
    dispatch({ type: ACTIONS.UPDATE_REPORT_SELECTION_STATE, payload: { reportTitle: null, reportId: null, isSelectionOn: false } });
  };

  const updateMessageSuggestionState = (messageId, suggestionId) => {
    const suggestionState = {
      selectedSuggestionId: suggestionId,
      timestamp: new Date().toISOString()
    };
    
    dispatch({ 
      type: ACTIONS.UPDATE_MESSAGE_SUGGESTION_STATE, 
      payload: { messageId, suggestionState }
    });
    
    // Save to IndexedDB when suggestion state changes
    if (state.currentChatId) {
      setTimeout(() => {
        saveCurrentChatToIndexedDB();
      }, 100);
    }
  };

  const updateActionableButtonState = (messageId, selectedActionState) => {
    
    const actionState = {
      selectedAction: selectedActionState, // Changed from selectedActionId to selectedAction
      timestamp: new Date().toISOString()
    }
    
    dispatch({ 
      type: ACTIONS.UPDATE_MESSAGE_ACTION_STATE, 
      payload: { messageId, actionState }
    });

    // Save to IndexedDB when action state changes
    if (state.currentChatId) {
      setTimeout(() => {
        saveCurrentChatToIndexedDB();
      }, 100);
    }
  }

  const updateFileHandleState = (messageId, isUsed) => {
    
    const fileHandleState = {
      isUsed: isUsed,
      timestamp: new Date().toISOString()
    };
    
    dispatch({ 
      type: ACTIONS.UPDATE_FILE_HANDLE_STATE, 
      payload: { messageId, fileHandleState }
    });

    // Save to IndexedDB when file handle state changes
    if (state.currentChatId) {
      setTimeout(() => {
        saveCurrentChatToIndexedDB();
      }, 100);
    }
  };

  const updateInputLabelState = (messageId, isUsed) => {
    
    const inputLabelState = {
      isUsed: isUsed,
      timestamp: new Date().toISOString()
    };
    
    dispatch({ 
      type: ACTIONS.UPDATE_INPUT_LABEL_STATE, 
      payload: { messageId, inputLabelState }
    });

    // Save to IndexedDB when input label state changes
    if (state.currentChatId) {
      setTimeout(() => {
        saveCurrentChatToIndexedDB();
      }, 100);
    }
  };

  const updateSelectState = (messageId, isUsed) => {
    
    const selectState = {
      isUsed: isUsed,
      timestamp: new Date().toISOString()
    };
    
    dispatch({ 
      type: ACTIONS.UPDATE_SELECT_STATE, 
      payload: { messageId, selectState }
    });

    // Save to IndexedDB when select state changes
    if (state.currentChatId) {
      setTimeout(() => {
        saveCurrentChatToIndexedDB();
      }, 100);
    }
  };

  const updateCustomFieldSelectionState = (messageId, isUsed) => {
    
    const customFieldSelectionState = {
      isUsed: isUsed,
      timestamp: new Date().toISOString()
    };
    
    dispatch({ 
      type: ACTIONS.UPDATE_CUSTOM_FIELD_SELECTION_STATE, 
      payload: { messageId, customFieldSelectionState }
    });

    // Save to IndexedDB when custom field selection state changes
    if (state.currentChatId) {
      setTimeout(() => {
        saveCurrentChatToIndexedDB();
      }, 100);
    }
  };

  const updateMultiSelectDropdownState = (messageId, isUsed, selectedValues = null) => {
    const multiSelectDropdownState = {
      isUsed: isUsed,
      selectedValues: selectedValues,
      timestamp: new Date().toISOString()
    };
    
    dispatch({ 
      type: ACTIONS.UPDATE_MULTISELECT_DROPDOWN_STATE, 
      payload: { messageId, multiSelectDropdownState }
    });

    // Save to IndexedDB when multiselect dropdown state changes
    if (state.currentChatId) {
      setTimeout(() => {
        saveCurrentChatToIndexedDB();
      }, 100);
    }
  };

  const updateStepperState = (messageId, stepperId, updatedSteps) => {
    // Get current message to preserve existing stepper states
    const currentMessage = state.messages.find(msg => msg.id === messageId);
    const currentStepperState = currentMessage?.stepperState || {};
    const currentSteps = currentStepperState[stepperId];
    
    // Check if the steps have actually changed to prevent infinite loops
    if (currentSteps && JSON.stringify(currentSteps) === JSON.stringify(updatedSteps)) {
      return;
    }
    
    const stepperState = {
      ...currentStepperState,
      [stepperId]: updatedSteps
    };
    
    dispatch({ 
      type: ACTIONS.UPDATE_STEPPER_STATE, 
      payload: { messageId, stepperState }
    });

    // Save to IndexedDB when stepper state changes
    if (state.currentChatId) {
      setTimeout(() => {
        saveCurrentChatToIndexedDB();
      }, 100);
    }
  };

  const removeComponentByMessageId = (messageId, componentId) => {
    
    dispatch({ 
      type: ACTIONS.REMOVE_COMPONENT_BY_MESSAGE_ID, 
      payload: { messageId, componentId }
    });

    // Save to IndexedDB after removing component
    if (state.currentChatId) {
      setTimeout(() => {
        saveCurrentChatToIndexedDB();
      }, 100);
    }
  }

  const removeComponentByComponentId = (componentId) => {
    dispatch({ 
      type: ACTIONS.REMOVE_COMPONENT_BY_COMPONENT_ID, 
      payload: { componentId }
    });

    // Save to IndexedDB after removing component
    if (state.currentChatId) {
      setTimeout(() => {
        saveCurrentChatToIndexedDB();
      }, 100);
    }
  }

  const removeMessageByComponentId = (componentId) => {
    dispatch({ 
      type: ACTIONS.REMOVE_MESSAGE_BY_COMPONENT_ID, 
      payload: { componentId }
    });

    // Save to IndexedDB after removing message
    if (state.currentChatId) {
      setTimeout(() => {
        saveCurrentChatToIndexedDB();
      }, 100);
    }
  }

  const removeLastMessage = (byType = null) => {
    if (state.messages.length === 0) {
        return;
    }
    let hasReportSelectionSuggestion = true;

    if (byType) {
        // Check if last message contains blocks with componentId starting with 'report_selection_suggestion_'
        const lastMessage = state.messages[state.messages.length - 1];
        hasReportSelectionSuggestion = lastMessage.blocks && Array.isArray(lastMessage.blocks) && 
        lastMessage.blocks.some((block) => block.componentId && block.componentId.startsWith(byType));
    }

    if (!hasReportSelectionSuggestion) {
      return;
    }

    dispatch({ 
      type: ACTIONS.REMOVE_LAST_MESSAGE
    });

    // Save to IndexedDB after removing last message
    if (state.currentChatId) {
      setTimeout(() => {
        saveCurrentChatToIndexedDB();
      }, 100);
    }
  }

  const removeCompletedStepper = (stepperId) => {
    
    dispatch({ 
      type: ACTIONS.REMOVE_COMPLETED_STEPPER, 
      payload: { stepperId }
    });

    // Save to IndexedDB after removing stepper
    if (state.currentChatId) {
      setTimeout(() => {
        saveCurrentChatToIndexedDB();
      }, 100);
    }
  };

  const toggleHistory = async () => {
    // If we're about to show history, set loading and fetch it first
    if (!state.showHistory) {
      setHistoryLoading(true);
      // Use setTimeout to ensure state update is processed before API call
      setTimeout(async () => {
        await fetchChatHistory();
        dispatch({ type: ACTIONS.TOGGLE_HISTORY });
      }, 0);
    } else {
      dispatch({ type: ACTIONS.TOGGLE_HISTORY });
    }
  };

  const loadHistoryChat = async (chatId) => {
    if (!apiHelper || !apiEndPoints?.getMessageBySessionId) {
      return;
    }
    try {
      // reviews-01deeaaa-1bfa-462e-b6b4-84ef79cc2176-1766125006803
      handleChatSessionUpdate(chatId);
      // Call the API to get session messages with session_id and pagination parameters
      const urlWithParams = `${apiEndPoints.getMessageBySessionId.url}?session_id=${chatId}&pageSize=${state.pagination.pageSize}&startIndex=${state.pagination.startIndex}`;
      const response = await apiHelper[apiEndPoints.getMessageBySessionId.method](urlWithParams);
      
      if (response?.data && Array.isArray(response.data.messages)) {
        // Transform API messages to our internal format if needed
        const messages = response.data.messages.map((msg) => ({
            id: msg.message_id || `msg_${Date.now()}_${Math.random()}`,
            text: msg.content || msg.text || "",
            content: msg.display_prompt || msg.content || msg.text || "",
            sender: msg.role === "user" ? "user" : "bot",
            type: msg.type || "text",
            timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
            blocks: msg.blocks?.map((block, index)=>{
              return {
                  ...block,
                  source: "api",
              };
            }) || undefined, // Preserve blocks if they exist
        }));
        
        // Get total count from response or set to current length if not provided
        const totalMessages = response.data.total_count || messages.length;
        const hasMoreMessages = messages.length === state.pagination.pageSize; // might need to check this
        
        dispatch({ 
          type: ACTIONS.LOAD_HISTORY_CHAT, 
          payload: { 
            messages: messages, 
            chatId: chatId
          } 
        });
        
        // Set initial pagination data
        dispatch({
          type: ACTIONS.SET_PAGINATION_DATA,
          payload: {
            startIndex: 0, // Reset to 0 for initial load
            totalMessages: totalMessages,
            hasMoreMessages: hasMoreMessages
          }
        });

        // Also set the session id of the loaded chat
      } else {
        // Still dispatch with empty messages to load the chat
        dispatch({ 
          type: ACTIONS.LOAD_HISTORY_CHAT, 
          payload: { 
            messages: [], 
            chatId: chatId
          } 
        });
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
      
      // Fallback to local chat history if API fails
      const selectedChat = state.chatHistory.find(chat => chat.id === chatId);
      if (selectedChat) {
        dispatch({ 
          type: ACTIONS.LOAD_HISTORY_CHAT, 
          payload: { 
            messages: selectedChat.messages, 
            chatId: chatId
          } 
        });
      }
    }
  };

  // Load more messages for pagination
  const loadMoreMessages = async (chatId) => {
    // Check if we should load more messages
    const currentTotalLoaded = state.pagination.startIndex + state.pagination.pageSize;
    if (currentTotalLoaded >= state.pagination.totalMessages && state.pagination.totalMessages > 0) {
      return;
    }

    if (state.pagination.isLoadingMore) {
      return;
    }

    if (!apiHelper || !apiEndPoints?.getMessageBySessionId) {
      return;
    }

    try {
      // Set loading state
      dispatch({ type: ACTIONS.SET_PAGINATION_LOADING, payload: true });

      const nextStartIndex = state.pagination.startIndex + 1;

      // Call the API to get more session messages with pagination parameters
      const urlWithParams = `${apiEndPoints.getMessageBySessionId.url}?session_id=${chatId}&pageSize=${state.pagination.pageSize}&startIndex=${nextStartIndex}`;
      const response = await apiHelper[apiEndPoints.getMessageBySessionId.method](urlWithParams);
      
      if (response?.data && Array.isArray(response.data.messages)) {
        // Transform API messages to our internal format
        const newMessages = response.data.messages.map((msg) => ({
            id: msg.message_id || `msg_${Date.now()}_${Math.random()}`,
            text: msg.content || msg.text || "",
            content: msg.display_prompt || msg.content || msg.text || "",
            sender: msg.role === "user" ? "user" : "bot",
            type: msg.type || "text",
            timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
            blocks: msg.blocks?.map((block, index)=>{
              return {
                  ...block,
                  source: "api",
              };
            }) || undefined, // Preserve blocks if they exist
        }));

        // Get total count from response or calculate
        const totalMessages = response.data.total_count || (nextStartIndex + newMessages.length);
        
        // Calculate if there are more messages based on total count and current position
        // We have more messages if: (current startIndex + 1) * pageSize < totalMessages
        const hasMoreMessages = ((nextStartIndex + 1) * state.pagination.pageSize) < totalMessages;

        dispatch({ 
          type: ACTIONS.LOAD_MORE_MESSAGES, 
          payload: { 
            messages: newMessages, 
            startIndex: nextStartIndex,
            totalMessages: totalMessages,
            hasMoreMessages: hasMoreMessages
          } 
        });
      } else {
        // Mark that there are no more messages to load
        dispatch({ 
          type: ACTIONS.LOAD_MORE_MESSAGES, 
          payload: { 
            messages: [], 
            startIndex: nextStartIndex,
            totalMessages: state.pagination.totalMessages,
            hasMoreMessages: false
          } 
        });
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
      // Reset loading state on error
      dispatch({ type: ACTIONS.SET_PAGINATION_LOADING, payload: false });
    }
  };

  // Fetch chat history from API
  const fetchChatHistory = async () => {
    if (!apiHelper || !apiEndPoints?.getSessionMessages) {
      setHistoryLoading(false);
      return;
    }

    try {
      // Call the API to get session messages
      const response = await apiHelper[apiEndPoints.getSessionMessages.method](
        apiEndPoints.getSessionMessages.url
      );
      
      if (response?.data && Array.isArray(response.data.sessions)) {
        // Transform API response to match our chat history format
        const chatHistoryItems = response.data.sessions.map((session, index) => {
          // Convert API session format to our internal format
          const messages = session.messages || [];
          const firstMessage = messages.find(msg => msg.sender === 'user' || msg.role === 'user');
          
          return {
            id: session.session_id || session.id || `session_${index}`,
            title: session.title || firstMessage?.content || firstMessage?.text || 'Chat Session',
            date: session.created_at || session.createdAt || new Date().toISOString().split('T')[0],
            dateFormatted: session.created_at 
              ? new Date(session.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long', 
                  year: 'numeric'
                })
              : new Date().toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long', 
                  year: 'numeric'
                }),
            // messages: messages.map(msg => ({
            //   id: msg.id || `msg_${Date.now()}_${Math.random()}`,
            //   text: msg.content || msg.text || '',
            //   content: msg.content || msg.text || '',
            //   sender: msg.sender || (msg.role === 'user' ? 'user' : 'bot'),
            //   type: 'text',
            //   timestamp: msg.timestamp || msg.created_at || new Date().toISOString()
            // })),
            lastUpdated: session.updated_at || session.updatedAt || new Date().toISOString()
          };
        });
        // Update the chat history in state
        dispatch({ 
          type: ACTIONS.SET_CHAT_HISTORY, 
          payload: chatHistoryItems 
        });
      } else {
        console.log('No chat history data received or invalid format');
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      // Set loading state to false regardless of success or error
      setHistoryLoading(false);
    }
  };

  // Delete chat session by ID
  const deleteChatSession = async (sessionId) => {
    if (!apiHelper || !apiEndPoints?.deleteSessionById) {
      console.log('API helper or deleteSessionById endpoint not available');
      return false;
    }

    try {
      // Call the API to delete session with session_id in the URL path
      const deleteUrl = `${apiEndPoints.deleteSessionById.url}${sessionId}`;
      const response = await apiHelper[apiEndPoints.deleteSessionById.method](deleteUrl);
      
      
      // If deletion was successful, remove from local state and IndexedDB
      if (response?.success !== false) {
        // Remove from chat history state
        dispatch({ 
          type: ACTIONS.SET_CHAT_HISTORY, 
          payload: state.chatHistory.filter(chat => chat.id !== sessionId)
        });
        
        // If the deleted session is the current chat, clear messages
        if (state.currentChatId === sessionId) {
          await clearMessages();
        }
        
        // Also remove from IndexedDB if available
        if (indexDbHelper && uniqueSessionId) {
          try {
            const indexedDBKey = `chat_${uniqueSessionId}_${sessionId}`;
            await indexDbHelper.delete(indexedDBKey);
          } catch (dbError) {
            console.warn('Failed to delete from IndexedDB (non-critical):', dbError.message);
          }
        }
        
        return true;
      } else {
        console.error('Failed to delete session:', response);
        return false;
      }
    } catch (error) {
      console.error('Error deleting chat session:', error);
      return false;
    }
  };

  // Update chat session title by ID
  const updateSessionTitle = async (sessionId, newTitle) => {
    if (!apiHelper || !apiEndPoints?.saveSession) {
      return false;
    }

    try {
      // Call the API to update session title
      const response = await apiHelper[apiEndPoints.saveSession.method](
        apiEndPoints.saveSession.url+`/${sessionId}/title`,
        { 
          sessionId: sessionId,
          title: newTitle 
        }
      );
      
      
      // If update was successful, update local state
      if (response?.success !== false) {
        // Update chat history state
        dispatch({ 
          type: ACTIONS.SET_CHAT_HISTORY, 
          payload: state.chatHistory.map(chat => 
            chat.id === sessionId 
              ? { ...chat, title: newTitle }
              : chat
          )
        });
        
        // Also update IndexedDB if available
        if (indexDbHelper && uniqueSessionId) {
          try {
            const indexedDBKey = `chat_${uniqueSessionId}_${sessionId}`;
            const existingChat = await indexDbHelper.get(indexedDBKey);
            if (existingChat) {
              if (skipIndexDBsupport) {
                return true;
              }
              await indexDbHelper.set(indexedDBKey, { 
                ...existingChat, 
                title: newTitle 
              });
            }
          } catch (dbError) {
            console.warn('Failed to update title in IndexedDB (non-critical):', dbError.message);
          }
        }
        
        return true;
      } else {
        console.error('Failed to update session title:', response);
        return false;
      }
    } catch (error) {
      console.error('Error updating session title:', error);
      return false;
    }
  };

  // Helper function to create new chat in history
  const createNewChatHistory = async (userMessage) => {
    // Set flag to prevent multiple chat creation
    chatCreationInProgress.current = true;
    
    try {
      const today = new Date();
      
      // Create user message object to include in initial messages
      const userMessageObj = buildMessageObject({
        text: userMessage,
        content: userMessage,
        type: "text",
        sender: "user"
      });
      
      const newChat = {
        id: `chat_${Date.now()}`,
        date: today.toISOString().split('T')[0],
        dateFormatted: today.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long', 
          year: 'numeric'
        }),
        title: userMessage || 'New Chat',
        messages: [userMessageObj], // Start with the user message
        lastUpdated: new Date().toISOString()
      };
      
      // Only add to chat history if maintainHistory is true
      if (maintainIndexDBHistory) {
        dispatch({ type: ACTIONS.SAVE_CHAT_TO_HISTORY, payload: newChat });
      } else {
        // Even if not maintaining history, set the currentChatId for IndexedDB persistence
        dispatch({ type: ACTIONS.SET_CURRENT_CHAT_ID, payload: newChat.id });
      }
      
      // Always save to IndexedDB for session persistence (regardless of maintainHistory)
      if (indexDbHelper && uniqueSessionId) {
        try {
          if (skipIndexDBsupport) {
            return newChat.id;
          }
          const key = `chat_${uniqueSessionId}_${newChat.id}`;
          
          // Wrap the actual IndexedDB operation in its own try-catch
          try {
            await indexDbHelper.set(key, newChat);
          } catch (dbError) {
            // Handle specific IndexedDB errors at the operation level
            if (dbError.name === 'NotFoundError' || dbError.message.includes('object stores') || dbError.message.includes('transaction')) {
              // Don't throw, just continue
            } else {
              // Re-throw other errors to be caught by outer catch
              throw dbError;
            }
          }
          
        } catch (error) {
          console.error('Error saving new chat to IndexedDB:', error);
          // For other errors, log them but don't throw to avoid breaking the chat flow
          console.warn('IndexedDB new chat save operation failed, continuing without saving:', error.message);
        }
      }
      
      return newChat.id;
    } catch(error){
      console.log("Error creating new chat history:", error);
    }
     finally {
      // Reset flag when done
      chatCreationInProgress.current = false;
    }
  };

  // Send bot message with new API structure
  const sendBotMessage = async (userMessage, existingChatId = null, feedbackToLLM = false, customContext) => {
    if (customContext) {
        customContextRef.current = customContext; // set custom context for this API call
    } else if (!customContextRef.current && customContext === undefined) {
        customContextRef.current = null; // reset custom context if not provided
    }
    // Don't create new chat if we're already in the process of creating one
    if (chatCreationInProgress.current) {
      return;
    }
    
    // Silent feedback to LLM no need to show loading state
    // Also, don't set loading if it's already set (user message already set it)
    if (!feedbackToLLM && !state.isLoading) {
      setLoading(true);
      // Start the 90-second loading timeout
      startLoadingTimeout();
    }

    // Use existingChatId if provided, otherwise check state
    const chatId = existingChatId || state?.currentChatId;
    const isFirstConversation = !chatId;

    // If this is the first conversation, create chat for IndexedDB persistence immediately
    if (isFirstConversation) {
      await createNewChatHistory(userMessage);
    }

    try {
      // If we have the new API structure, use it
      if (apiHelper && apiEndPoints?.sendPrompt) {
        // Prepare the payload for sendPrompt
        let payload = {
          message: userMessage,
          context: currentContext,
        };



        // Apply payload preprocessor if provided
        if (payloadPreprocessor) {
          payload = payloadPreprocessor(payload);
        }

        if(customContextRef.current){
          payload.context = {
            ...payload.context,
            ...customContextRef.current
          };
        }

        if(rootLevelContextRef.current){
          payload = {
            ...payload,
            ...rootLevelContextRef.current
          }
        }
        if(rootLevelSelectedChartContextRef.current){
          payload = {
            ...payload,
            ...rootLevelSelectedChartContextRef.current
          }
        }
        // add requestTimeout
        // payload.requestTimeout = new Date().toISOString(); // NLP will handle this at there end for 90 seconds timeout
        payload.userId = userId;
        payload.accountId = accountId;
        // payload.message = userMessage; // safety check to ensure message is included even after preprocessor call


        // Make the API call using apiHelper (beAPIResource)
        const apiResponse = await apiHelper[apiEndPoints.sendPrompt.method](
          apiEndPoints.sendPrompt.url,
          payload,
          { topLoader: false, isPrimaryAPI: false }
        );
        customContextRef.current = null; // reset custom context after API call
        rootLevelContextRef.current = null; // reset custom context after API call

        if(directSyncFromAPI){
          let tempBlocks = apiResponse.data.block.map((item, index) => {
            if(item.type === "chart" && item.content && item.content[0]){  
              // Create a deep copy to avoid mutating original data
              return {
                ...item,
                content: item.content.map((contentItem, contentIndex) => {
                  if (contentIndex === 0) {
                    return {
                      ...contentItem,
                      user_message_id: apiResponse.data.assistant_message_id
                    };
                  }
                  return contentItem;
                })
              };
            }
            // Return the item as is if it's not a chart or doesn't have content
            return item;
          });

          
          setLoading(false);
          addMessage({
            type: "text",
            blocks: tempBlocks,
            sender: "bot",
          });
        }

        // Check if this is a Storybook mock response (for demo purposes)
        // If it returns { success: true } without actual Firebase setup, show demo data
        if (apiResponse?.success && (!firebaseHelper || !window.__copilotFirebaseRef)) {
          // Show demo response using generateBotResponse for UI demonstration
          setTimeout(() => {
            const botResponseBlocks = generateBotResponse(
              userMessage,
              currentContext
            );
            const botMessage = {
              type: "text",
              blocks: botResponseBlocks,
              sender: "bot",
            };
            addMessage(botMessage);
          }, 1000);
        }

        // Note: We don't add the message here since Firebase will handle the response
        // Firebase listener should be already set up from initialization
      } else {
        /**
         * @note Need to remove this fallback when we fully switch to new API
         * This is just for testing purposes
         * It simulates a bot response based on the user message and current context
         * This will be replaced with actual API call in production
         */
        // Fallback to simulated response
        setTimeout(() => {
          const botResponseBlocks = generateBotResponse(
            userMessage,
            currentContext
          );
          const botMessage = {
            type: "text",
            blocks: botResponseBlocks,
            sender: "bot",
          };
          addMessage(botMessage);
        }, 1000);
      }
    } catch (error) {
      console.error("Error calling API:", error);

      // Add error message
      const errorMessage = {
        type: "text",
        content: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
      };

      addMessage(errorMessage);
      // Always clear loading and timeout on error
      setLoading(false);
      clearLoadingTimeout();
    } finally {
      // Only clear loading and timeout if we're not waiting for Firebase
      // Firebase will handle loading state based on processing status
      if (!apiHelper || !apiEndPoints?.sendPrompt) {
        // For fallback/testing mode, clear loading normally
        setLoading(false);
        clearLoadingTimeout();
      }
      // For API mode, Firebase will manage loading state and timeout
    }
  };

  // Auto-save chat to IndexedDB whenever messages change
  React.useEffect(() => {
    // Don't save immediately after loading from IndexedDB
    if (isLoadingFromIndexedDB.current) {
      return;
    }
    
    if (state.currentChatId && state.messages.length > 0) {
      // For immediate saving (like Firebase messages), save right away if the last message is from bot
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage && lastMessage.sender === "bot") {
        // Save immediately for bot messages (Firebase responses)
        const immediateTimeout = setTimeout(() => {
          saveCurrentChatToIndexedDB();
        }, 100);
        
        return () => clearTimeout(immediateTimeout);
      } else {
        // Debounce the save operation for user messages to avoid too frequent saves
        const saveTimeout = setTimeout(() => {
          saveCurrentChatToIndexedDB();
        }, 1000); // Save after 1 second of inactivity
        
        return () => clearTimeout(saveTimeout);
      }
    }
  }, [state.messages, state.currentChatId, state.isLoading, state.loadingTimestamp]);

  // Post window event when loading state changes
  React.useEffect(() => {
    // Post window event with loading state
    window.postMessage({
      type: 'COPILOT_LOADING_STATE_CHANGED',
      payload: {
        isLoading: state.isLoading,
        timestamp: new Date().toISOString()
      }
    }, '*');
  }, [state.isLoading]);

  // Listen for COPILOT_PROMPT_MESSAGE events from parent component
  React.useEffect(() => {
      const handlePromptMessage = async (event) => {
          if (!event.data || !event.data.type) return;

          switch (event.data.type) {
              case "COPILOT_PROMPT_MESSAGE": {
                  const { payload } = event.data;
                  const { message: promptMessage, timestamp, source, messageId } = payload;

                  // Respond back to parent with loading state and messageId
                  window.postMessage(
                      {
                          type: "COPILOT_PROMPT_RESPONSE",
                          payload: {
                              messageId,
                              response: state.isLoading,
                          },
                      },
                      "*",
                  );


                  // If copilot is loading, ignore the message
                  if (state.isLoading) {
                      return;
                  }


                  triggerScrollToBottom();

                  const isFirstConversation = !state?.currentChatId;
                  let loadedChatId;

                  // if (isFirstConversation) {
                  //     console.log("No current chat, checking for most recent chat");

                  //     loadedChatId = await loadChatsFromIndexedDB();
                  //     console.log("loadedChatId", loadedChatId);

                  //     if (!loadedChatId) {
                  //         console.log("No existing chats found, creating new chat for prompt message");
                  //         // await createNewChatHistory(promptMessage);
                  //     } else {
                  //         console.log("Using loaded most recent chat:", loadedChatId);
                  //     }
                  // }

                  // Add user message
                  addMessage({
                      text: promptMessage,
                      content: promptMessage,
                      type: "text",
                      sender: "user",
                      source,
                      messageId,
                  });


                  // Send bot message
                  if (isFirstConversation) {
                      sendBotMessage(promptMessage, loadedChatId);
                  } else {
                      sendBotMessage(promptMessage);
                  }

                  break;
              }
            
              case "COPILOT_SEND_PROMPT": {
                  const { payload } = event.data;
                  const { promptMessage, customContext, displayLabel } = payload;
                  // Add user message
                  addMessage({
                      text: promptMessage,
                      content: displayLabel,
                      type: "text",
                      sender: "user",
                  });

                  sendBotMessage(promptMessage, null, false, customContext);

                  break;
              }

              case "COPILOT_NEW_CHAT": {
                  try {
                      // Close history if it's currently open
                      // if (state.showHistory) {
                      //   await toggleHistory();
                      // }

                      // Clear current chat messages
                      await clearMessages();

                      // Call the onNewChat callback if it exists
                      if (onNewChat) {
                          onNewChat();
                      }

                      // Respond with confirmation
                      window.postMessage(
                          {
                              type: "COPILOT_NEW_CHAT_RESPONSE",
                              payload: {
                                  success: true,
                                  timestamp: new Date().toISOString(),
                              },
                          },
                          "*",
                      );
                  } catch (error) {
                      console.error("Error creating new chat:", error);

                      // Respond with error
                      window.postMessage(
                          {
                              type: "COPILOT_NEW_CHAT_RESPONSE",
                              payload: {
                                  success: false,
                                  error: error.message,
                                  timestamp: new Date().toISOString(),
                              },
                          },
                          "*",
                      );
                  }

                  break;
              }

              case "COPILOT_REPORT_SELECTION": {
                  const { payload } = event.data;
                  const {
                      reportTitle,
                      reportId,
                      isSelectionOn,
                      reportSuggestion,
                  } = payload;
                  if(!reportId || !reportTitle){
                      console.error("reportId and reportTitle are required in payload");
                      return;
                  }
                  if(state.reportSelectionState.isSelectionOn && state.reportSelectionState.reportId === reportId){
                      console.log("Report is already selected, ignoring selection");
                      return;
                  }
                  if (state.reportSelectionState.isSelectionOn && state.reportSelectionState.reportId !== reportId) {
                      removeLastMessage("report_selection_suggestion_"); // remove the previous suggestion message
                       // Clear the rootLevelSelectedChartContextRef when another report is selected without deselecting the previous one
                      rootLevelSelectedChartContextRef.current = null;
                  }
                    addMessage({
                        type: "text",
                        blocks: [
                            {
                                componentId: `report_selection_suggestion_` + reportId,
                                type: "text",
                                content: `If you want, I can help you with:`,
                            },
                            {
                                componentId: `report_selection_suggestion_` + reportId,
                                type: "suggestions",
                                removeMessageAndShowUserPromptOnClick: true,
                                options: reportSuggestion,
                            },
                        ],
                        sender: "bot",
                    });

                  // keep report id handy to send in context as selected_chart_ids: [reportid] when user selects a report,
                  // so that LLM can use that to provide more relevant response based on selected report
                  rootLevelSelectedChartContextRef.current = {
                      selected_chart_ids: [reportId],
                  };
                  try {
                      // Update the report selection state
                      dispatch({ 
                          type: ACTIONS.UPDATE_REPORT_SELECTION_STATE, 
                          payload: { reportTitle, reportId, isSelectionOn }
                      });

                      // Respond with confirmation
                      window.postMessage(
                          {
                              type: "COPILOT_REPORT_SELECTION_RESPONSE",
                              payload: {
                                  success: true,
                                  reportTitle,
                                  reportId,
                                  isSelectionOn: isSelectionOn || !state.reportSelectionState.isSelectionOn,
                                  timestamp: new Date().toISOString(),
                              },
                          },
                          "*",
                      );
                  } catch (error) {
                      console.error("Error selecting report:", error);
                      // Respond with error
                      window.postMessage(
                          {
                              type: "COPILOT_REPORT_SELECTION_RESPONSE",
                              payload: {
                                  success: false,
                                  error: error.message,
                                  timestamp: new Date().toISOString(),
                              },
                          },
                          "*",
                      );
                  }

                  break;
              }

              case "COPILOT_REPORT_SELECTION_REMOVE": {
                  try {
                      // Reset the report selection state to initial state
                      dispatch({ 
                          type: ACTIONS.UPDATE_REPORT_SELECTION_STATE, 
                          payload: { reportTitle: null, reportId: null, isSelectionOn: null }
                      });

                      // Clear the rootLevelSelectedChartContextRef when report is deselected
                      rootLevelSelectedChartContextRef.current = null;

                      // Respond with confirmation
                      window.postMessage(
                          {
                              type: "COPILOT_REPORT_SELECTION_REMOVE_RESPONSE",
                              payload: {
                                  success: true,
                                  message: "Report selection cleared successfully",
                                  timestamp: new Date().toISOString(),
                              },
                          },
                          "*",
                      );
                  } catch (error) {
                      console.error("Error removing report selection:", error);
                      // Respond with error
                      window.postMessage(
                          {
                              type: "COPILOT_REPORT_SELECTION_REMOVE_RESPONSE",
                              payload: {
                                  success: false,
                                  error: error.message,
                                  timestamp: new Date().toISOString(),
                              },
                          },
                          "*",
                      );
                  }

                  break;
              }

              default:
                  // Ignore unknown message types
                  break;
          }
      };

      window.addEventListener("message", handlePromptMessage);

      return () => {
          window.removeEventListener("message", handlePromptMessage);
      };
  }, [state.isLoading, addMessage, sendBotMessage, loadChatsFromIndexedDB]);

  // Cleanup timeout on component unmount
  React.useEffect(() => {
    return () => {
      clearLoadingTimeout();
    };
  }, []);

  const contextValue = {
    ...state,
    addMessage,
    setLoading,
    setError,
    setHistoryLoading,
    clearMessages,
    clearNewMessageDivider,
    triggerScrollToBottom,
    updateMessageSuggestionState,
    updateActionableButtonState,
    updateFileHandleState,
    updateInputLabelState,
    updateSelectState,
    updateCustomFieldSelectionState,
    updateMultiSelectDropdownState,
    updateStepperState,
    removeCompletedStepper,
    removeComponentByMessageId,
    removeComponentByComponentId,
    removeMessageByComponentId,
    removeLastMessage,
    sendBotMessage,
    toggleHistory,
    loadHistoryChat,
    loadMoreMessages, // Add pagination function
    fetchChatHistory,
    deleteChatSession,
    updateSessionTitle,
    loadChatsFromIndexedDB,
    saveCurrentChatToIndexedDB, // Expose this function
    startLoadingTimeout, // Expose timeout management
    clearLoadingTimeout, // Expose timeout management
    reportSelectionState: state.reportSelectionState,
    removeReportPill: removeReportPill,
    isLoadingFromIndexedDB: isLoadingFromIndexedDB.current, // Expose the flag to skip animations for loaded data
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useCopilot = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useCopilot must be used within a CopilotProvider");
  }
  return context;
};

export default ChatContext;
