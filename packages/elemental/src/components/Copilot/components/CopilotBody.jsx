import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useCopilot } from "../context/CopilotContext";
import { getComponentRegistry, FallbackBlock } from "./MessageComponents";
import ChatHistory from "./ChatHistory";
import styles from "../styles/copilot.module.scss";
import AiAvatar from "../assets/icons/ai-avatar.svg";
import UserAvatar from "../assets/icons/user-avatar.png";
import aiImg from "../assets/icons/aiImg.svg";

// Add CSS keyframes for spinner animation
const spinnerKeyframes = `
@keyframes copilot-spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject the CSS keyframes if not already present
if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  if (styleSheet && !document.querySelector('#copilot-spinner-keyframes')) {
    const style = document.createElement('style');
    style.id = 'copilot-spinner-keyframes';
    style.textContent = spinnerKeyframes;
    document.head.appendChild(style);
  }
}

// DelayedBlock component for staggered animations
const DelayedBlock = React.memo(({
  children,
  delay = 0,
  handleScrollToBottom,
  isLastBlock,
  isLoadingFromIndexedDB = false,
  showNewMessagePopup,
  resetScrollChanged,
  scrollChangedRef // ✅ use ref instead of state for latest value
}) => {
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If data is from IndexedDB, show immediately without delay or animation
    if (isLoadingFromIndexedDB) {
      setShow(true);
      setIsVisible(true); // Show immediately without animation
      
      if (isLastBlock && handleScrollToBottom) {
        // Add a small delay to ensure the DOM has updated
        setTimeout(() => {
          handleScrollToBottom();
        }, 100);
      }
      return;
    }

    // If showNewMessagePopup is true, show content immediately without animation
    // to avoid conflicts with user scrolling - and DO NOT auto-scroll
    if (showNewMessagePopup) {
      setShow(true);
      setIsVisible(true);
      return;
    }

    // For fresh data when no popup is showing, use the normal delay animation
    const timer = setTimeout(() => {
      setShow(true);
      setTimeout(() => setIsVisible(true), 100);
      // ✅ Only scroll if user hasn't interacted AND no popup is showing
      if (!scrollChangedRef.current && !showNewMessagePopup && handleScrollToBottom) {
        handleScrollToBottom();
      }

      // ✅ For last block, scroll after animation & reset scrollChanged
      if (isLastBlock) {
        setTimeout(() => {
          // Only auto-scroll if no popup is showing and user hasn't manually scrolled
          if (!scrollChangedRef.current && !showNewMessagePopup && handleScrollToBottom) {
            handleScrollToBottom();
          }
          // console.log("calling resetScrollChanged");
          // resetScrollChanged();
        }, 800);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [
    delay,
    isLastBlock,
    handleScrollToBottom,
    isLoadingFromIndexedDB,
    showNewMessagePopup,
    resetScrollChanged,
    scrollChangedRef // still safe in deps, but won't cause re-renders
  ]);

  if (!show) return null;
  
  // Only apply animation styles for fresh data, not IndexedDB data
  const animationStyles = isLoadingFromIndexedDB ? {} : {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
  };
  
  return (
    <div style={animationStyles}>
      {children}
    </div>
  );
});

const ChatMessage = React.memo(({
  message,
  onAccept,
  onReject,
  onItemClick,
  selectRenderer,
  imageS3Callback,
  onApplyChanges,
  onSubmit,
  promptCallBack,
  handleScrollToBottom,
  isLoadingFromIndexedDB,
  showNewMessagePopup,
  scrollChangedRef,
  resetScrollChanged,
  removedSteppersRef,
  addToDashboardCallback,
  onSubmitCallback,
  dispatch,
  displayNotification
}) => {
  const isUser = message.sender === "user";
  const [appliedBlockIndices, setAppliedBlockIndices] = useState(new Set());
  const [hasAppliedMessage, setHasAppliedMessage] = useState(false);
  const { messages, removeCompletedStepper } = useCopilot(); // Add removeCompletedStepper
  
  // Calculate if this bot message should show the bot icon
  // Show icon only for the first visible bot message after a user message
  const shouldShowBotIcon = useMemo(() => {
    
    if (isUser) {
      return false; // User messages never show bot icon
    }
    
    // Find the current message index
    const currentMessageIndex = messages.findIndex(msg => msg.id === message.id);
    
    if (currentMessageIndex === -1) {
      return true; // Default to showing icon if not found
    }
    
    // Helper function to check if a bot message would be rendered (not filtered out)
    const isBotMessageVisible = (msg) => {
      if (msg.sender === "user") return true; // User messages are always visible
      if (!msg.blocks || !Array.isArray(msg.blocks)) return true; // Non-block messages are visible
      
      // Check if message has renderable blocks (not all stepper blocks that are removed)
      const hasRenderableBlocks = msg.blocks.some(block => {
        if (block.type !== 'stepper') return true; // Non-stepper blocks are renderable
        
        // Check if this stepper block would be filtered out
        const { stepperId } = block;
        return !removedSteppersRef.current.has(stepperId);
      });
      
      return hasRenderableBlocks;
    };
    
    // Look backwards for the previous visible message
    let previousVisibleMessage = null;
    
    for (let i = currentMessageIndex - 1; i >= 0; i--) {
      const msg = messages[i];
      const isVisible = isBotMessageVisible(msg);
      
      if (isVisible) {
        previousVisibleMessage = msg;
        break;
      }
    }
    
    // Always show bot icon for bot messages
    const result = true;
    
    // Show bot icon for all bot messages
    return result;
  }, [isUser, messages, message.id, removedSteppersRef]);
  // Effect to detect and clean up completed steppers
  useEffect(() => {
    if (!message.blocks || !Array.isArray(message.blocks)) return;
    
    // Find all stepper blocks in this message
    const stepperBlocks = message.blocks.filter(block => block.type === 'stepper');
    
    stepperBlocks.forEach(block => {
      const { stepperId, steps } = block;
      
      // Skip if already removed
      if (removedSteppersRef.current.has(stepperId)) return;
      
      // Check if this is the first stepper with this ID
      const currentMessageIndex = messages.findIndex(msg => msg.id === message.id);
      const isFirstStepperWithThisId = !messages.slice(0, currentMessageIndex).some(msg => 
        msg.blocks?.some(block => block.type === 'stepper' && block.stepperId === stepperId)
      );
      
      if (!isFirstStepperWithThisId) return; // Only handle the first stepper instance
      
      // Get the current stepper state
      const currentMessage = messages.find(msg => msg.id === message.id);
      const stepperState = currentMessage?.stepperState || {};
      const currentSteps = stepperState[stepperId] || steps;
      
      // Look for the latest stepper data in subsequent messages
      let latestSteps = currentSteps;
      const laterMessages = messages.slice(currentMessageIndex + 1);
      for (const laterMsg of laterMessages) {
        if (laterMsg.blocks) {
          const stepperBlock = laterMsg.blocks.find(
            blockItem => blockItem.type === 'stepper' && blockItem.stepperId === stepperId
          );
          if (stepperBlock && stepperBlock.steps) {
            latestSteps = stepperBlock.steps;
          }
        }
      }
      
      // Check if all steps are completed
      const allStepsProcessed = latestSteps && latestSteps.length > 0 && latestSteps.every(step => step.processed === true);
      
      if (allStepsProcessed && !removedSteppersRef.current.has(stepperId)) {
        
        // Add delay to allow users to see the green checkmark animation
        setTimeout(() => {
          removedSteppersRef.current.add(stepperId); // Mark as removed for UI filtering
          removeCompletedStepper(stepperId); // Also remove from IndexedDB
        }, 1000); // 1 second delay to show completion state
      }
    });
  }, [messages, message.blocks, message.id, removeCompletedStepper]);

  // Get component registry with callbacks
  const componentRegistry = getComponentRegistry({
    onAccept,
    onReject,
    onItemClick,
    selectRenderer,
    messageId: message.id,
    imageS3Callback,
    onSubmit,
    promptCallBack,
    addToDashboardCallback,
    onSubmitCallback,
    dispatch,
    displayNotification
  });

const checkInBlocksForApplyChanges = () => {
    return message.blocks?.filter((block) => block.type === "applyChanges" && block?.source !== "api") ?? [];
};

// ✅ Get only valid non-API applyChanges blocks
const getApplyChangesPayloadFromBlocks = () => {
  return (
    message.blocks
      ?.filter(
        (block) =>
          block.type === "applyChanges" &&
          block?.source !== "api" && block.content
      )
      // ✅ Support both old (payload) and new (content)
      .map((block) => block.content ?? block.payload)
      // ✅ Normalize into flat array
      .flatMap((item) => (Array.isArray(item) ? item : [item]))
      // ✅ Remove undefined/null
      .filter(Boolean) ?? []
  );
};

useEffect(() => {
  if (!onApplyChanges || hasAppliedMessage) return;

  // ✅ 1. OLD behavior FIRST (backward compatibility)
  if (message.type === "applyChanges") {
    if (message?.payload) {
      onApplyChanges(message.payload);
      setHasAppliedMessage(true);
    }

    return;
  }

  // ✅ 2. BLOCKS (excluding API source + safe payload extraction)
  const payload = getApplyChangesPayloadFromBlocks();

  if (payload.length > 0) {
    onApplyChanges(payload);
    setHasAppliedMessage(true);
    return;
  }

  // ✅ 3. FALLBACK: old DB logic (per-block execution)
  if (message.blocks && Array.isArray(message.blocks)) {
    message.blocks.forEach((block, index) => {
      if (
        block.type === "applyChanges" &&
        block?.source !== "api" && // 👈 required
        !appliedBlockIndices.has(index)
      ) {
        const blockPayload = block.payload ?? block.content;

        if (!blockPayload) return; // ✅ safety guard

        onApplyChanges(blockPayload);

        setAppliedBlockIndices((prev) => {
          const updated = new Set(prev);
          updated.add(index);
          return updated;
        });
      }
    });
  }
}, [message, onApplyChanges, appliedBlockIndices, hasAppliedMessage]);

  // For user messages, always render as text
  if (isUser) {
    return (
      <div className={`${styles.messageWrapper} ${styles.userMessage}`}>
        <div>
          <span className={styles.userIcon}>
            {window?.BE?.user?.name ? (
              <div className={styles.userInitials}>
                {window.BE.user.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
            ) : (
              <img src={UserAvatar} alt="" />
            )}
          </span>
        </div>

        <div className={styles.message}>
          <div className={styles.messageContent}>
            {(message.content || message.text)
              ?.split("\n")
              .map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index <
                    (message.content || message.text).split("\n").length -
                      1 && <br />}
                </React.Fragment>
              ))}
          </div>
          {/* <div className={styles.messageTime}>
            {time}
          </div> */}
        </div>
      </div>
    );
  }

  // For bot messages with multiple blocks
  if (message.blocks && Array.isArray(message.blocks)) {
    // Check if all blocks are applyChanges type - if so, don't render anything
    const hasRenderableBlocks = message.blocks.some(
      (block) => block.type !== "applyChanges"
    );

    if (!hasRenderableBlocks) {
      // All blocks are applyChanges, don't render the message wrapper at all
      return null;
    }

    // Render blocks and check if any actually render content
    const renderedBlocks = [];
    
    for (let index = 0; index < message.blocks.length; index++) {
      const block = message.blocks[index];
      
      if (block.type === 'applyChanges') {
        // applyChanges is handled in useEffect, don't render anything
        continue;
      }
      
      const BlockComponent = componentRegistry[block.type] || FallbackBlock;
      
      // For stepper blocks, check if they should render before wrapping
      if (block.type === 'stepper') {
        // Find the stepper component instance to check if it should render
        const { stepperId, steps } = block;
        const currentMessage = messages.find(msg => msg.id === message.id);
        const stepperState = currentMessage?.stepperState || {};
        const currentSteps = stepperState[stepperId] || steps;
        
        // Check if this is the first stepper with this ID
        const currentMessageIndex = messages.findIndex(msg => msg.id === message.id);
        const isFirstStepperWithThisId = !messages.slice(0, currentMessageIndex).some(msg => 
          msg.blocks?.some(block => block.type === 'stepper' && block.stepperId === stepperId)
        );
        
        // Look for the latest stepper data in subsequent messages
        let latestSteps = currentSteps;
        const laterMessages = messages.slice(currentMessageIndex + 1);
        for (const laterMsg of laterMessages) {
          if (laterMsg.blocks) {
            const stepperBlock = laterMsg.blocks.find(
              blockItem => blockItem.type === 'stepper' && blockItem.stepperId === stepperId
            );
            if (stepperBlock && stepperBlock.steps) {
              latestSteps = stepperBlock.steps;
            }
          }
        }
        
        const allStepsProcessed = latestSteps && latestSteps.length > 0 && latestSteps.every(step => step.processed === true);
        
        // Don't render if not first stepper with this ID, or if it's been marked as removed
        if (!isFirstStepperWithThisId || removedSteppersRef.current.has(stepperId)) {
          continue;
        }
      }
      
      // Render the component
      renderedBlocks.push(
        <div key={index} className={styles.messageBlock}>
          <BlockComponent {...block} />
        </div>
      );
    }

    // If no blocks actually render anything, don't render the message wrapper
    if (renderedBlocks.length === 0) {
      return null;
    }

    return (
      <div className={`${styles.messageWrapper} ${styles.botMessage}`}>
        <div className={styles.botIconWrapper}>
          <span className={styles.botIcon}>
            {shouldShowBotIcon ? <img src={AiAvatar} alt="Bot Avatar"/> : null}
          </span>
        </div>

        <div className={styles.message}>
          <div className={styles.messageContent}>
            <div className={styles.multiBlockContainer}>
              {renderedBlocks.map((renderedBlock, blockIndex) => {
                // Calculate delay based on the current block index in renderedBlocks
                const isLastBlock = blockIndex === renderedBlocks.length - 1;

                return (
                  <DelayedBlock
                    handleScrollToBottom={handleScrollToBottom}
                    key={blockIndex}
                    delay={blockIndex * 535}
                    isLastBlock={isLastBlock}
                    isLoadingFromIndexedDB={isLoadingFromIndexedDB}
                    showNewMessagePopup={showNewMessagePopup}
                    scrollChangedRef={scrollChangedRef}
                    resetScrollChanged={resetScrollChanged}
                  >
                    {renderedBlock}
                  </DelayedBlock>
                );
              })}
            </div>
          </div>
          {/* <div className={styles.messageTime}>
            {time}
          </div> */}
        </div>
      </div>
    );
  }

  if (message.type === "applyChanges") {
    // applyChanges is handled in useEffect, don't render anything
    return null;
  }
  // For single bot messages, use the appropriate component based on type
  const MessageComponent = componentRegistry[message.type] || FallbackBlock;

  return (
    <div className={`${styles.messageWrapper} ${styles.botMessage}`}>
      <div>
        <span className={styles.botIcon}>
          {shouldShowBotIcon ? <img src={AiAvatar} alt="Bot Avatar"  /> : null}
        </span>
      </div>

      <div className={styles.message}>
        <div className={styles.messageContent}>
          <MessageComponent {...message} />
        </div>
        {/* <div className={styles.messageTime}>
          {time}
        </div> */}
      </div>
    </div>
  );
});

const ChatBody = ({
  onAccept,
  onReject,
  onItemClick,
  selectRenderer,
  onApplyChanges,
  onSubmit,
  imageS3Callback,
  promptCallBack,
  emptyStateText,
  emptyStateIcon,
  addToDashboardCallback,
  onNewChat,
  displayNotification,
  dispatch,
  onSubmitCallback,
  startChatFromBottom = true,
  chatPaginationEnabled
}) => {
  const {
    messages,
    isLoading,
    loadingMessage,
    shouldClearDivider,
    showHistory,
    historyLoading,
    chatHistory,
    toggleHistory,
    loadHistoryChat,
    loadMoreMessages, // Add pagination function
    scrollToBottom,
    isLoadingFromIndexedDB,
    pagination, // Add pagination state
    currentChatId, // Add current chat ID for pagination
  } = useCopilot();
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [showNewMessagePopup, setShowNewMessagePopup] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [newMessageDividerIndex, setNewMessageDividerIndex] = useState(null);
  const [isLoadingHistoryChat, setIsLoadingHistoryChat] = useState(false);
  const [scrollChanged, setScrollChanged] = useState(false);
  const [previousMessagesCount, setPreviousMessagesCount] = useState(0);
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
  
  // Add refs to track pagination state and prevent duplicate calls
  const paginationTriggeredRef = useRef(false);
  const lastPaginationTriggerTime = useRef(0);
  
  // ✅ Use ref for scrollChanged to prevent re-render issues
  const scrollChangedRef = useRef(false);
  // Track removed steppers to prevent duplicates - moved from ChatMessage to ChatBody
  const removedSteppersRef = useRef(new Set());

  const resetScrollChanged = useCallback(() => {
    scrollChangedRef.current = false;
  }, []);

    useEffect(() => {
    const handleUserScrollInteraction = () => {
      scrollChangedRef.current = true;
    };

    const chatBody = chatBodyRef.current;
    if (chatBody) {
      chatBody.addEventListener("wheel", handleUserScrollInteraction);
      chatBody.addEventListener("touchmove", handleUserScrollInteraction);
      window.addEventListener("keydown", (e) => {
        if (["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(e.key)) {
          handleUserScrollInteraction();
        }
      });
    }

    return () => {
      if (chatBody) {
        chatBody.removeEventListener("wheel", handleUserScrollInteraction);
        chatBody.removeEventListener("touchmove", handleUserScrollInteraction);
      }
      window.removeEventListener("keydown", handleUserScrollInteraction);
    };
  }, []);

  // Check if user is scrolled to bottom
  const checkIfScrolledToBottom = useCallback(() => {
    if (chatBodyRef.current) {
      // setScrollChanged(true); // ✅ user interacted
      const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px threshold
      // // Only update state if the value actually changed to prevent unnecessary re-renders
      // setIsScrolledUp(prev => {
      //   if (prev === isAtBottom) return prev; // No change needed
      //   return !isAtBottom;
      // });
      setIsScrolledUp(!isAtBottom);

      // Hide popup if user manually scrolled to bottom (but keep divider)
      if (isAtBottom && showNewMessagePopup) {
        setShowNewMessagePopup(false);
      }
      
      // Check if user scrolled to top for pagination
      // Calculate distance from top (handles both normal scroll and overscroll)
      const distanceFromTop = scrollTop + scrollHeight - clientHeight
 // Use absolute value to handle negative overscroll
      const isAtTop = distanceFromTop <= 5; // Within 10px of the top (including overscroll)
      
      if (isAtTop && chatPaginationEnabled && currentChatId && pagination.hasMoreMessages && !pagination.isLoadingMore) {
        // Additional checks to prevent premature triggering
        const hasEnoughContentToScroll = scrollHeight > clientHeight + 50; // Reduced from 100px to 50px
        const now = Date.now();
        const timeSinceLastTrigger = now - lastPaginationTriggerTime.current;
        
        // Only trigger if:
        // 1. We have enough scrollable content
        // 2. At least 1 second have passed since last pagination trigger (reduced from 2 seconds)
        // 3. We haven't already triggered pagination in this scroll session
        if (hasEnoughContentToScroll && timeSinceLastTrigger > 1000 && !paginationTriggeredRef.current) {
          // Set flags to prevent duplicate calls
          paginationTriggeredRef.current = true;
          lastPaginationTriggerTime.current = now;
          
          loadMoreMessages(currentChatId);
          
          // Reset the flag after a delay to allow future pagination
          setTimeout(() => {
            paginationTriggeredRef.current = false;
          }, 2000); // Reduced from 3000ms to 2000ms
        } else {
          console.log('Pagination blocked:', {
            hasEnoughContentToScroll,
            timeSinceLastTrigger,
            paginationTriggered: paginationTriggeredRef.current,
            minTime: timeSinceLastTrigger > 1000
          });
        }
      }
      
      // Reset pagination flag when user scrolls away from top
      if (scrollTop > 50) {
        paginationTriggeredRef.current = false;
      }
    }
  }, [showNewMessagePopup, chatPaginationEnabled, currentChatId, pagination.hasMoreMessages, pagination.isLoadingMore, loadMoreMessages, paginationTriggeredRef, lastPaginationTriggerTime]);

  const onLoadHistoryChat = useCallback((chatId) => {
    setIsLoadingHistoryChat(true);
    setShowNewMessagePopup(false);
    setNewMessageDividerIndex(null);
    loadHistoryChat(chatId);
  }, [loadHistoryChat]);

  // Function to scroll to bottom
  const handleScrollToBottom = useCallback(() => {
    if (messagesEndRef.current && chatBodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
      const currentScrollPosition = scrollTop + clientHeight;
      const distanceFromBottom = scrollHeight - currentScrollPosition;
      // Only scroll if there's meaningful content to scroll (more than 50px)
      // This prevents glitches when content height is small
      if (distanceFromBottom > 50) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  // Auto scroll to bottom when new messages arrive (only if user is at bottom)
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];

      // Check if this is a new message
      if (lastMessageId && latestMessage.id !== lastMessageId) {
        // Don't show popup if we're loading a historical chat
        if (
          isScrolledUp &&
          latestMessage.sender === "bot" &&
          !isLoadingHistoryChat
        ) {
          // User is scrolled up and new bot message arrived
          setShowNewMessagePopup(true);
          setNewMessageDividerIndex(messages.length - 1);
          // Mark as user-interacted to prevent auto-scroll when popup is shown
          scrollChangedRef.current = true;
        } else if (!isScrolledUp) {
          // User is at bottom, auto-scroll
          // ✅ Reset scrollChanged when a new message arrives and we're auto-scrolling
          resetScrollChanged();
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      } else if (!lastMessageId) {
        // First message, always scroll
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }

      setLastMessageId(latestMessage.id);

      // Reset the loading history flag after messages are processed
      if (isLoadingHistoryChat) {
        setIsLoadingHistoryChat(false);
      }
    }
  }, [messages, isScrolledUp, lastMessageId, isLoadingHistoryChat]);

  // Maintain scroll position when messages are prepended (pagination)
  useEffect(() => {
    if (chatBodyRef.current && messages.length > previousMessagesCount && previousMessagesCount > 0) {
      const newMessagesCount = messages.length - previousMessagesCount;
      // Only adjust scroll if messages were prepended (new messages at beginning)
      if (newMessagesCount > 0 && !isLoadingHistoryChat) {
        const currentScrollHeight = chatBodyRef.current.scrollHeight;
        const scrollHeightDifference = currentScrollHeight - previousScrollHeight;
        
        // Adjust scroll position to maintain visual position
        if (scrollHeightDifference > 0) {
          chatBodyRef.current.scrollTop += scrollHeightDifference;
        }
      }
    }
    
    // Update tracking variables
    setPreviousMessagesCount(messages.length);
    if (chatBodyRef.current) {
      setPreviousScrollHeight(chatBodyRef.current.scrollHeight);
    }
  }, [messages.length, isLoadingHistoryChat, previousMessagesCount, previousScrollHeight]);

  // Handle scroll to new message popup click
  const handleScrollToNewMessage = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowNewMessagePopup(false);
    // Reset scroll changed when user manually clicks to scroll
    resetScrollChanged();
    // Keep divider visible until user sends a message
  }, [resetScrollChanged]);

  // Clear divider when context indicates it should be cleared
  useEffect(() => {
    if (shouldClearDivider) {
      setNewMessageDividerIndex(null);
      setShowNewMessagePopup(false);
    }
  }, [shouldClearDivider]);

  // Reset local states when messages are cleared (New Chat)
  useEffect(() => {
    if (messages.length === 0) {
      setNewMessageDividerIndex(null);
      setShowNewMessagePopup(false);
      setLastMessageId(null);
      setIsScrolledUp(false);
      setIsLoadingHistoryChat(false);
      removedSteppersRef.current.clear(); // Reset removed steppers
      // Reset pagination flags
      paginationTriggeredRef.current = false;
      lastPaginationTriggerTime.current = 0;
    }
  }, [messages.length]);

  // Add scroll event listener with throttling
  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (chatBody) {
      let throttleTimer;
      const throttledScrollHandler = () => {
        if (throttleTimer) return;
        throttleTimer = setTimeout(() => {
          checkIfScrolledToBottom();
          throttleTimer = null;
        }, 100); // Throttle to every 100ms
      };
      
      chatBody.addEventListener("scroll", throttledScrollHandler, { passive: true });
      return () => {
        chatBody.removeEventListener("scroll", throttledScrollHandler);
        if (throttleTimer) {
          clearTimeout(throttleTimer);
        }
      };
    }
  }, [checkIfScrolledToBottom]);

  // Listen for scroll trigger from context
  useEffect(() => {
    if (scrollToBottom !== undefined) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollToBottom]);

  return (
      <div className={`custom-scroll ${!startChatFromBottom ? styles.chatBody : styles.chatBodyBottom} ${showHistory ? styles.chatBodyHistory : ""}`} ref={chatBodyRef}>
          <ChatHistory displayNotification={displayNotification} dispatch={dispatch} historyLoading={historyLoading} showHistory={showHistory} chatHistory={chatHistory} onChatSelect={onLoadHistoryChat} onBack={toggleHistory} onNewChat={onNewChat} />
          <div className={historyLoading || showHistory ? styles.chatHistoryHidden : ""}>
              {(messages.length === 0 && (emptyStateText || emptyStateIcon))
              ? (
                  <div className={styles.emptyState}>
                      <div className={styles.emptyStateIcon}>
                          <img src={aiImg} alt="empty" />
                      </div>
                      {
                       emptyStateText ? <p className={styles.emptyStateText}>{emptyStateText}</p> : null
                      }
                  </div>
              ) : (
                  <div className={styles.messagesContainer}>
                      {/* Pagination loading indicator at the top */}
                      {pagination.isLoadingMore && (
                          <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '12px',
                              backgroundColor: '#f5f5f5',
                              borderRadius: '8px',
                              margin: '8px 0',
                              fontSize: '14px',
                              color: '#666'
                          }}>
                              <div style={{
                                  width: '16px',
                                  height: '16px',
                                  border: '2px solid #ddd',
                                  borderTop: '2px solid #007bff',
                                  borderRadius: '50%',
                                  marginRight: '8px',
                                  animation: 'copilot-spinner 1s linear infinite'
                              }}></div>
                              <span>Loading more messages...</span>
                          </div>
                      )}
                      {messages.map((message, index) => (
                          <React.Fragment key={message.id}>
                              {/* Show divider for new message if user was scrolled up */}
                              {/* {newMessageDividerIndex === index && (
                                  <div className={styles.newMessageDivider}>
                                      <span className={styles.newMessageLabel}>New message</span>
                                  </div>
                              )} */}
                              <ChatMessage
                                  key={message.id}
                                  message={message}
                                  onAccept={onAccept}
                                  dispatch={dispatch}
                                  displayNotification={displayNotification}
                                  onReject={onReject}
                                  onItemClick={onItemClick}
                                  promptCallBack={promptCallBack}
                                  onSubmit={onSubmit}
                                  selectRenderer={selectRenderer}
                                  imageS3Callback={imageS3Callback}
                                  onApplyChanges={onApplyChanges}
                                  handleScrollToBottom={handleScrollToBottom}
                                  isLoadingFromIndexedDB={isLoadingFromIndexedDB}
                                  showNewMessagePopup={showNewMessagePopup}
                                  scrollChangedRef={scrollChangedRef}
                                  resetScrollChanged={resetScrollChanged}
                                  removedSteppersRef={removedSteppersRef}
                                  addToDashboardCallback={addToDashboardCallback}
                                  onSubmitCallback={onSubmitCallback}
                              />
                          </React.Fragment>
                      ))}
                      <div ref={messagesEndRef} />
                  </div>
              )}

              {/* New message popup */}
              {/* {showNewMessagePopup && (
                  <div className={styles.newMessagePopup} onClick={handleScrollToNewMessage}>
                      <span className={styles.popupText}>New message</span>
                      <span className={styles.popupArrow}>
                          <i className="icon_phoenix-arrow-down"></i>
                      </span>
                  </div>
              )} */}
          </div>
      </div>
  );
};

export default ChatBody;
