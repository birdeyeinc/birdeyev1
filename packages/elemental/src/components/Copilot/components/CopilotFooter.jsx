import React, { useState, useRef, useEffect } from 'react'
import { useCopilot } from '../context/CopilotContext'
import styles from '../styles/copilot.module.scss'
import SingleSelect from 'atoms/SingleSelect'
import loadingGif from "../assets/gif/Pre-comp.gif";
import barPng from "../assets/icons/bar_chart.png";

const CopilotFooter = ({ placeholder = "Enter a prompt here", secondaryPlaceholder = "Ask anything", showImageUploader = false, showModelSelector = false, showDesignSelector = false, designSelectorOptions = [], modelSelectorOptions = [], onItemClick = null }) => {
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true) // Track if contenteditable is empty
  const [shouldRestoreFocus, setShouldRestoreFocus] = useState(false) // Track if we should restore focus after loading
  const [hasInitialFocus, setHasInitialFocus] = useState(false) // Track if initial focus has been set
  const editableRef = useRef(null)
  const { addMessage, sendBotMessage, isLoading, loadingMessage, messages, reportSelectionState, removeReportPill, removeLastMessage } = useCopilot()

  const [selectedModel, setSelectedModel] = useState(modelSelectorOptions?.find(option => option.isSelected) || null)
  const [selectedDesign, setSelectedDesign] = useState(designSelectorOptions?.find(option => option.isSelected) || null)

  // Effect to focus on contentEditable when component first loads
  useEffect(() => {
    if (editableRef.current && !hasInitialFocus) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        if (editableRef.current && !hasInitialFocus) {
          editableRef.current.focus()
          setHasInitialFocus(true)
        }
      }, 100)
    }
  }, [hasInitialFocus]) // Depend on hasInitialFocus to avoid multiple calls

  // Effect to handle focus restoration when loading state changes
  useEffect(() => {
    if (!isLoading && editableRef.current) {
      // Restore focus whenever loading becomes false
      setTimeout(() => {
        if (editableRef.current) {
          editableRef.current.focus()
          
          // Position cursor at the end
          try {
            const range = document.createRange()
            const selection = window.getSelection()
            
            if (editableRef.current.childNodes.length > 0) {
              const lastNode = editableRef.current.lastChild
              if (lastNode.nodeType === Node.TEXT_NODE) {
                range.setStart(lastNode, lastNode.textContent.length)
              } else {
                range.setStartAfter(lastNode)
              }
            } else {
              range.setStart(editableRef.current, 0)
            }
            
            range.collapse(true)
            selection.removeAllRanges()
            selection.addRange(range)
          } catch (error) {
            console.log('Cursor positioning failed during focus restoration:', error)
          }
          
          // Mark that initial focus has been set if it wasn't already
          if (!hasInitialFocus) {
            setHasInitialFocus(true)
          }
        }
      }, 100) // Small delay to ensure contentEditable is fully enabled
      
      setShouldRestoreFocus(false) // Reset the flag
    }
  }, [isLoading, hasInitialFocus])

  // Additional effect to ensure focus after initialization completes
  useEffect(() => {
    // If we have messages and loading is false, but no initial focus yet, set focus
    if (!isLoading && !hasInitialFocus && editableRef.current) {
      setTimeout(() => {
        if (editableRef.current && !hasInitialFocus) {
          editableRef.current.focus()
          setHasInitialFocus(true)
        }
      }, 200) // Slightly longer delay for initialization scenarios
    }
  }, [messages, isLoading, hasInitialFocus])

  // Effect to update isSelected state when options change
  useEffect(() => {
    const selectedModelOption = modelSelectorOptions?.find(option => option?.isSelected) || null
    setSelectedModel(selectedModelOption)
  }, [modelSelectorOptions])

  useEffect(() => {
    const selectedDesignOption = designSelectorOptions?.find(option => option?.isSelected) || null
    setSelectedDesign(selectedDesignOption)
  }, [designSelectorOptions])

  const checkLastMessageIfMultiSelectDropDownFn = () => {
    if (!messages || messages.length === 0) return false;
    let response = false;
    const lastMessage = messages[messages.length - 1];
    // Check if the last message is a multi-select dropdown
    response = lastMessage.type === "multiSelectDropDown" || false;
    if(lastMessage?.blocks && Array.isArray(lastMessage.blocks)){
        const multiSelectBlock = lastMessage.blocks.find(block => block.type === 'multiSelectDropDown');
      response = multiSelectBlock ? true : false;
    }
    return response;
  }
  
  // Determine placeholder text based on chat state
  const getPlaceholderText = () => {
    // If there are any messages in the chat, show secondary placeholder
    if (messages && messages.length > 0) {
      return secondaryPlaceholder
    }
    // Otherwise, show the dynamic placeholder prop (e.g., "Enter a prompt here", "Ask me about reports", etc.)
    return placeholder
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Get text with preserved line breaks
    const messageText = getTextWithLineBreaks()
    const trimmedValue = messageText.trim()
    
    if (!trimmedValue || isLoading) return

    // Set flag to restore focus after loading completes
    setShouldRestoreFocus(true)


    let checkLastMessageIfMultiSelectDropDown = checkLastMessageIfMultiSelectDropDownFn();
    let customContext;

    if (checkLastMessageIfMultiSelectDropDown) {
        customContext = {
            campaignSelectionSkipped: "not_applied",
            locationSelectionSkipped: "skipped",
        };
    } else {
        customContext = {};
    }
    // Add user message
    addMessage({
      text: trimmedValue,
      content: trimmedValue,
      type: 'text',
      sender: 'user'
    }, false, customContext)

    // Trigger bot response
    sendBotMessage(trimmedValue)

    // Clear input and contenteditable
    setInputValue('')
    setIsEmpty(true) // Reset empty state
    if (editableRef.current) {
      editableRef.current.textContent = ''
      // Don't focus here since the element will be disabled during loading
      // Focus will be restored automatically when loading completes
    }
  }

  const handleKeyDown = (e) => {
    // Submit on Enter (unless Shift is held)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
    // Allow Shift+Enter for new line (default behavior when not prevented)
  }

  const checkIfEmpty = () => {
    if (!editableRef.current) return true
    
    const innerText = editableRef.current.innerText || ''
    const textContent = editableRef.current.textContent || ''
    const innerHTML = editableRef.current.innerHTML || ''
    
    // More comprehensive empty check
    const trimmedInnerText = innerText.trim()
    const trimmedTextContent = textContent.trim()
    
    // Check if content is truly empty
    const hasNoText = trimmedInnerText.length === 0 && trimmedTextContent.length === 0
    
    // Check for common empty HTML patterns
    const emptyHtmlPatterns = [
      '',
      '<br>',
      '<div></div>',
      '<div><br></div>',
      '<div><br/></div>',
      '<p></p>',
      '<p><br></p>',
      '&nbsp;',
      ' '
    ]
    
    const isEmptyHtml = emptyHtmlPatterns.includes(innerHTML.trim())
    
    // Clean up empty HTML if detected
    if (hasNoText || isEmptyHtml) {
      // Force clean the contenteditable
      setTimeout(() => {
        if (editableRef.current && (hasNoText || isEmptyHtml)) {
          editableRef.current.innerHTML = ''
        }
      }, 0)
      return true
    }
    
    return false
  }

  const handleInput = (e) => {
    // Get text with proper line breaks for state management
    const text = getTextWithLineBreaks()
    setInputValue(text)
    
    // Check if the contenteditable is actually empty for placeholder display
    const isContentEmpty = checkIfEmpty()
    setIsEmpty(isContentEmpty)
  }

  const getTextWithLineBreaks = () => {
    if (!editableRef.current) return ''
    
    // Use innerText first to get the actual text content as the user sees it
    // This preserves line breaks and handles HTML entities correctly
    const textContent = editableRef.current.innerText || ''
    
    // If innerText is empty but there's content, fall back to manual parsing
    if (!textContent && editableRef.current.innerHTML) {
      const htmlContent = editableRef.current.innerHTML
      
      // Only process structural HTML (div, br) not user-typed HTML content
      const textWithBreaks = htmlContent
        .replace(/<div>/gi, '\n')
        .replace(/<\/div>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '') // Remove any other HTML tags
        .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
        .replace(/&lt;/g, '<') // Decode HTML entities
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .trim()
      
      return textWithBreaks
    }
    
    return textContent
  }

  const handleWrapperClick = (e) => {
    // Focus the contenteditable div when wrapper is clicked
    if (editableRef.current && !isLoading) {
      // Check if the click was directly on the contentEditable div
      const isClickOnContentEditable = editableRef.current.contains(e.target) && 
                                      (e.target === editableRef.current || 
                                       e.target.closest('[contenteditable]') === editableRef.current)
      
      // If clicked directly on the contentEditable, let the browser handle cursor positioning naturally
      if (isClickOnContentEditable) {
        editableRef.current.focus()
        return
      }
      
      // Only position cursor at the end if clicked outside the contentEditable area (like on wrapper padding)
      editableRef.current.focus()
      
      // Position cursor at the end of the content
      setTimeout(() => {
        if (editableRef.current && document.activeElement === editableRef.current) {
          try {
            const range = document.createRange()
            const selection = window.getSelection()
            
            // If there's content, position cursor at the end
            if (editableRef.current.childNodes.length > 0) {
              const lastNode = editableRef.current.lastChild
              if (lastNode.nodeType === Node.TEXT_NODE) {
                range.setStart(lastNode, lastNode.textContent.length)
              } else {
                range.setStartAfter(lastNode)
              }
            } else {
              // If empty, position cursor at the start
              range.setStart(editableRef.current, 0)
            }
            
            range.collapse(true)
            selection.removeAllRanges()
            selection.addRange(range)
          } catch (error) {
            console.log('Cursor positioning failed:', error)
          }
        }
      }, 0)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Double-check empty state on blur in case input event missed something
    const isContentEmpty = checkIfEmpty()
    setIsEmpty(isContentEmpty)
  }

  const handlePaste = (e) => {
    // Prevent default paste behavior
    e.preventDefault()
    
    // Get plain text from clipboard
    const clipboardData = e.clipboardData || window.clipboardData
    const pastedText = clipboardData.getData('text/plain')
    
    // Insert the plain text at the current cursor position
    if (document.execCommand) {
      // Fallback for older browsers
      document.execCommand('insertText', false, pastedText)
    } else {
      // Modern approach using Selection API
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const textNode = document.createTextNode(pastedText)
        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
    
    // Trigger input event to update state
    handleInput(e)
  }

  const handleRemoveReportPill = (e, reportId) => {
      e.stopPropagation();

      // Remove the report pill locally
      removeReportPill();

      removeLastMessage("report_selection_suggestion_"); // Remove the last message which is the report selection suggestion

      // Trigger window post message event for report selection removal for web2
      informWeb2OfReportSelectionRemoval();
  };

  const informWeb2OfReportSelectionRemoval = () => {
      window.postMessage(
          {
              type: "COPILOT_REPORT_SELECTION_REMOVE",
              payload: {
                  timestamp: new Date().toISOString(),
              },
          },
          "*",
      );
  };

  return (
      <div className={styles.chatFooter}>
          {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.botMessage}`}>
                  <div className={`${styles.message}`}>
                      <div className={`${styles.messageContent} ${styles.loadingMessage}`} style={loadingMessage === "skip" ? { display: "none" } : {}}>
                          <div className={styles.loadingContent}>
                              <img src={loadingGif} alt="Loading..." className={styles.loadingGif} />
                              <span className={styles.loadingText}>{loadingMessage || "Analysing prompt..."}</span>
                          </div>
                      </div>
                  </div>
              </div>
          )}
          <form onSubmit={handleSubmit} className={styles.inputForm}>
              <div className={`${styles.inputWrapper} ${isFocused && !isLoading ? styles.userClick : ""}`} onClick={handleWrapperClick} style={{ cursor: "text" }}>
                  <div className={styles.inputBox}>
                      {/* Report Selection Pill */}
                      {reportSelectionState?.isSelectionOn && reportSelectionState?.reportTitle && (
                          <div className={styles.reportPill} onClick={(e) => !isLoading && e.stopPropagation()}>
                                  <img className={styles.pillIcon} src={barPng} alt="graph_img" />
                              <span className={styles.pillText}>{reportSelectionState.reportTitle}</span>
                              <button
                                  type="button"
                                  className={styles.pillClose}
                                  disabled={isLoading}
                                  onClick={(e) => !isLoading && handleRemoveReportPill(e, reportSelectionState.reportId)}
                              >
                                  <i className="icon_phoenix-enclose"></i>
                              </button>
                          </div>
                      )}
                      <div
                          ref={editableRef}
                          className={`${styles.editable} ${isEmpty ? styles.placeholder : ""}`}
                          contentEditable={!isLoading}
                          onInput={handleInput}
                          onKeyDown={handleKeyDown}
                          onKeyUp={() => {
                              // Additional check on keyup for delete/backspace operations
                              setTimeout(() => {
                                  const isContentEmpty = checkIfEmpty();
                                  setIsEmpty(isContentEmpty);

                                  // Force update inputValue state as well
                                  const text = getTextWithLineBreaks();
                                  setInputValue(text);
                              }, 10);
                          }}
                          onPaste={handlePaste}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          placeholder={getPlaceholderText()}
                          suppressContentEditableWarning={true}
                      ></div>
                  </div>
                  {/* <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={styles.messageInput}
            rows={1}
            disabled={isLoading}
          /> */}
                  <div className={styles.footerBottomWrap}>
                      <div>{showImageUploader && <i className="icon_phoenix-image-square"></i>}</div>
                      <button type="submit" className={styles.sendButton} disabled={!inputValue.trim() || isLoading}>
                          <div>
                              <i className={`icon_phoenix-disable-arrow ${styles.disable}`}></i>
                              <i className={`icon_phoenix-arrow ${styles.enable}`}></i>
                          </div>
                      </button>
                  </div>
              </div>
          </form>

          {showModelSelector || showDesignSelector ? (
              <div className={styles.footerDropdowns}>
                  {showModelSelector && (
                      <SingleSelect
                          selected={selectedModel?.value || ""}
                          options={modelSelectorOptions}
                          displayLabel={selectedModel?.label || "Model"}
                          onChange={(item) => {
                              setSelectedModel(item || {});
                              onItemClick && onItemClick({ type: "select-model", item });
                          }}
                          className="mt-5 copilot-select"
                          top={true}
                          inlineMode
                          isLowercaseFirstLetter={false}
                      />
                  )}
                  {showDesignSelector && (
                      <SingleSelect
                          selected={selectedDesign?.value || ""}
                          options={designSelectorOptions}
                          displayLabel={selectedDesign?.label || "Design"}
                          onChange={(item) => {
                              setSelectedDesign(item || {});
                              onItemClick && onItemClick({ type: "select-design", item });
                          }}
                          className="mt-5 copilot-select"
                          top={true}
                          inlineMode
                          isLowercaseFirstLetter={false}
                      />
                  )}
              </div>
          ) : null}
      </div>
  );
}

export default CopilotFooter
