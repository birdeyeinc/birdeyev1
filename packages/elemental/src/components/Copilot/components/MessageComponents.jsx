import React, { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useCopilot } from '../context/CopilotContext'
import Tooltip from 'atoms/Tooltip'
import styles from '../styles/copilot.module.scss'
import FormInput from 'atoms/FormInput'
import Button from 'atoms/Button';
import SingleSelect from 'atoms/SingleSelect';
import FileUploader from 'components/FileUploader';
import GraphTable from 'components/GraphTable';
import { columnBaseConfig } from "./constants/columnBaseConfig";
import { tableReportData } from './constants/tableBaseConfig'
import { mergeWith, isArray, merge } from "lodash";
import MultiSelectWrapper from 'atoms/Multiselect'
import MultiSelectPaginatedDropdownComponent from 'atoms/MultiSelectPaginatedDropdown/index.jsx'

// === Utility Functions ===
const isDisabledByNewerMessage = (messageId, messages) => {
  const currentMessageIndex = messages.findIndex(msg => msg.id === messageId);
  if (currentMessageIndex === -1) return false;
  
  // First check if it's already marked as disabled in the message state (persisted)
  const currentMessage = messages.find(msg => msg.id === messageId);
  if (currentMessage?.suggestionState?.selectedSuggestionId === 'DISABLED_BY_NEWER_MESSAGE' || 
      currentMessage?.actionState?.selectedAction === 'DISABLED_BY_NEWER_MESSAGE' ||
      currentMessage?.fileHandleState?.isUsed === 'DISABLED_BY_NEWER_MESSAGE' ||
      currentMessage?.inputLabelState?.isUsed === 'DISABLED_BY_NEWER_MESSAGE' ||
      currentMessage?.selectState?.isUsed === 'DISABLED_BY_NEWER_MESSAGE' ||
      currentMessage?.customFieldSelectionState?.isUsed === 'DISABLED_BY_NEWER_MESSAGE' ||
      currentMessage?.multiSelectDropdownState?.isUsed === 'DISABLED_BY_NEWER_MESSAGE') {
    return true;
  }
  
  // Check if there are any user messages after this message (runtime check)
  const messagesAfterCurrent = messages.slice(currentMessageIndex + 1);
  let newMsgFromUser = messagesAfterCurrent.some(msg => msg.sender === 'user');
  return newMsgFromUser;
};

// === Message Type Components ===
export const HeadingBlock = ({ level, content }) => {
  const Tag = `h${level}`;
  return <Tag className={`${styles.chatHeading} ${styles[`h${level}`]}`}>{content}</Tag>;
};

export const TextBlock = ({ content, variant }) => (
  <div className={`${styles.chatText} ${variant === 'lightText' ? styles.lightText : ''}`}>
    <ReactMarkdown
     remarkPlugins={[remarkGfm]}
      components={{
        li: ({ children }) => <li>{children}</li>,
        table: ({ children }) => <table>{children}</table>,
        thead: ({ children }) => <thead>{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => <tr>{children}</tr>,
        th: ({ children }) => <th>{children}</th>,
        td: ({ children }) => <td>{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export const ImageBlock = ({ url, alt }) => (
  <div className={styles.chatImage}>
    <img src={url} alt={alt} />
  </div>
);

export const ErrorBlock = ({ content }) => (
  <div className={styles.chatError}>
    <i className="icon_phoenix-alert"></i>
    {content}
  </div>
);

export const CollapsibleBlock = ({ title, content, promptCallBack, messageId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // Get component registry for nested content - memoized to prevent recreation
  const componentRegistry = useMemo(() => 
    getComponentRegistry({ promptCallBack, messageId }), 
    [promptCallBack, messageId]
  );
  
  const renderContent = () => {
    if (Array.isArray(content)) {
      // Content is an array of message objects
      return content.map((item, index) => {
        const Component = componentRegistry[item.type] || FallbackBlock;
        return (
          <div key={index} className={styles.messageBlock}>
            <Component {...item} />
          </div>
        );
      });
    } else {
      // Content is a string
      return <div className={styles.chatText}>{content}</div>;
    }
  };

  return (
    <div className={styles.chatCollapsible}>
      <div
        className={`${styles.collapsibleHeader} ${
          isExpanded ? styles.expanded : ""
        }`}
      >
        <div className={styles.collapsibleTitle}>
          <ReactMarkdown>{title}</ReactMarkdown>
        </div>
      </div>
      {!isExpanded && (
        <div
          className={styles.details}
          onClick={() => setIsExpanded(true)}
        >
          Details
          <i
            className={`icon_phoenix-chevron-down ${styles.collapsibleIcon}`}
          ></i>
        </div>
      )}
      {isExpanded && (
        <div className={styles.collapsibleContent}>
          {renderContent()}
          <div
            className={styles.hideDetails}
            onClick={() => setIsExpanded(false)}
          >
            Hide Details
            <i
              className={`icon_phoenix-chevron-up ${styles.collapsibleIcon}`}
            ></i>
          </div>
        </div>
      )}
    </div>
  );
};

export const CardBlock = ({ title, content, highlights, onAccept, onReject, promptCallBack, messageId }) => {
  // Get component registry for nested content (will be injected) - memoized to prevent recreation
  const componentRegistry = useMemo(() => 
    getComponentRegistry(onAccept, onReject, null, promptCallBack, messageId), 
    [onAccept, onReject, promptCallBack, messageId]
  );
  
  const renderContent = () => {
    if (Array.isArray(content)) {
      // Content is an array of message objects
      return content.map((item, index) => {
        const Component = componentRegistry[item.type] || FallbackBlock;
        return (
          <div key={index} className={styles.messageBlock}>
            <Component {...item} onAccept={onAccept} promptCallBack={promptCallBack} />
          </div>
        );
      });
    } else {
      // Content is a string
      return <p>{content}</p>;
    }
  };

  return (
    <div className={styles.chatCard}>
      {title ? <h3>{title}</h3> : null}
      {renderContent()}
      {highlights && (
        <ul>
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const SuggestionButtons = ({ options, promptCallBack, messageId, removeMessageAndShowUserPromptOnClick = false, componentId }) => {
  const { updateMessageSuggestionState, messages, removeComponentByMessageId, addMessage } = useCopilot();

  // Find the current message to get its suggestion state
  const currentMessage = messages.find(msg => msg.id === messageId);
  const suggestionState = currentMessage?.suggestionState;
  const selectedSuggestionId = suggestionState?.selectedSuggestionId;

  const handleSuggestionClick = (option, index) => {
    if (option.event_type === "window") {
        if (option.event_target) {
            window.postMessage(
                {
                    type: option.event_target,
                    payload: {
                        text: option.prompt,
                        content: option.label,
                        messageId: messageId,
                        componentId: componentId,
                    },
                },
                "*",
            );
        }
        removeComponentByMessageId(messageId, componentId);
        return
    }
    
    // Create a unique ID for this suggestion (combination of option and index)
    const suggestionId = `${typeof option === 'string' ? option : option.label}_${index}`;
    if(!removeMessageAndShowUserPromptOnClick){
      // Mark this suggestion as selected for this specific message
      updateMessageSuggestionState(messageId, suggestionId);
    }
    
    // If the option has a prompt, use it; otherwise use the label
    const promptToSend = option.prompt || option.label || option;
    
    if (promptCallBack) {
      promptCallBack(promptToSend);
    }
    if(removeMessageAndShowUserPromptOnClick){
      removeComponentByMessageId(messageId, componentId); // Remove the suggestion message
           addMessage(
                {
                    text: option.prompt,
                    content: option.label,
                    type: "text",
                    sender: "user",
                }
            );
    }
  };

  const isSelected = (option, index) => {
    const suggestionId = `${typeof option === 'string' ? option : option.label}_${index}`;
    return suggestionId === selectedSuggestionId;
  };

  return (
    <div className={styles.chatSuggestions}>
      {options?.map((option, i) => {
        // Handle both old format (strings) and new format (objects with label/prompt)
        const displayText = typeof option === 'string' ? option : option.label;
        const selected = isSelected(option, i);
        
        // Don't treat 'DISABLED_BY_NEWER_MESSAGE' as a real selection
        const hasRealSelection = selectedSuggestionId !== null && 
                                selectedSuggestionId !== undefined && 
                                selectedSuggestionId !== 'DISABLED_BY_NEWER_MESSAGE';
        
        const disabledByNewerMessage = isDisabledByNewerMessage(messageId, messages);
        const isDisabled = (hasRealSelection && !selected) || disabledByNewerMessage;
        
        return (
          <button 
            key={i} 
            className={`${styles.suggestionButton} ${
              selected ? styles.selected : ''
            } ${
              hasRealSelection && !selected ? styles.fadedOut : ''
            } ${
              disabledByNewerMessage && !hasRealSelection ? styles.fadedOut : ''
            } ${
              isDisabled ? styles.noHover : ''
            }`}
            onClick={() => !hasRealSelection && !disabledByNewerMessage ? handleSuggestionClick(option, i) : null}
            disabled={isDisabled}
          >
            {displayText}
          </button>
        );
      })}
    </div>
  );
};

export const Divider = () => <hr className={styles.chatDivider} />;

export const FileHandleBlock = ({ label, actions, onItemClick, imageS3Callback, promptCallBack, prompt, messageId }) => {

  const { updateFileHandleState, messages } = useCopilot();

  const currentMessage = messages.find(msg => msg.id === messageId);
  const fileHandleState = currentMessage?.fileHandleState;
  const isFileHandleUsed = fileHandleState?.isUsed;
  const disabledByNewerMessage = isDisabledByNewerMessage(messageId, messages);
  const isDisabled = isFileHandleUsed || disabledByNewerMessage;

  const acceptFile = (url) => {
    // Mark file handle as used
    updateFileHandleState(messageId, true);
    promptCallBack(`${prompt} ${url}`);
  }

  const handleActionClick = (action) => {
    if (isFileHandleUsed || isDisabledByNewerMessage(messageId, messages)) return; // Prevent click on disabled buttons
    
    // Call the passed callback if provided
    if (onItemClick) {
      onItemClick(action, acceptFile);
    }
    
    // Handle different action types here
    switch (action.type) {
      case 'upload':
        if (action.source === 'system') {
          // Handle system upload
        } else if (action.source === 'freeMedia') {
          // Handle free media upload
        } else if (action.source === 'library') {
          // Handle library upload
        }
        break;
      case 'generate':
        if (action.source === 'ai') {
          // Handle AI generation
          // console.log('Opening AI image generator...');
        }
        break;
      default:
        console.log('Unknown action type:', action.type);
    }
  };

  const getS3ImageFromCallback = async (data) => {
    if (isFileHandleUsed || isDisabledByNewerMessage(messageId, messages)) return; // Prevent action on disabled state
    
    if (imageS3Callback) {
      try {
        const s3Image = await imageS3Callback(data);
        if (s3Image) {
          // Mark file handle as used
          updateFileHandleState(messageId, true);
          promptCallBack(`${prompt} ${s3Image}`);
        }
      } catch (error) {
        console.error("Error getting S3 image:", error);
        promptCallBack && promptCallBack("Error uploading image. Please try again.");
      }
    } else {
      console.warn("No imageS3Callback provided, cannot handle S3 image selection.");
    }
  };

  // Don't render if file handle has been used
  if (isFileHandleUsed) {
    return null;
  }

  return (
    <div className={styles.chatFileHandle}>
      {label && <div className={styles.fileHandleLabel}>{label}</div>}
      <div className={styles.fileHandleActions} style={{ marginTop: '12px' }}>
        {actions?.map((action, index) => {
          const { source, label } = action;
          // Determine the icon based on action type and source
          let iconClass = 'icon_phoenix-ai'; // default
          if (source === 'library') {
            iconClass = 'icon_phoenix-art-track';
          } else if (source === 'freeMedia') {
            iconClass = 'icon_phoenix-frame-media';
          } else if (source === 'ai') {
            iconClass = 'icon_phoenix-ai';
          } else if (source === 'system') {
            iconClass = 'icon_phoenix-desktop-new';
          }

          if (source === 'system') {
            return (
              <FileUploader
                key={index}
                acceptFileTypes=".jpg,.jpeg,.png"
                customSelectElement={
                  <Button
                    label={label}
                    theme="secondary"
                    icon={iconClass}
                    disabled={isDisabled}
                    className={`${styles.actionButton} ${styles.mediaButton} ${styles.fileUploaderButton} ${
                      isFileHandleUsed ? styles.fadedOut : ''
                    } ${
                      disabledByNewerMessage ? styles.fadedOut : ''
                    } ${
                      isDisabled ? styles.noHover : ''
                    }`}
                  />
                }
                customselect
                onChange={getS3ImageFromCallback}
                onError={(error) => promptCallBack(error)}
                preview="off"
                disabled={isDisabled}
              />
            )
          }
          return (
            <button
              key={index}
              className={`${styles.actionButton} ${styles.mediaButton} ${
                isFileHandleUsed ? styles.fadedOut : ''
              } ${
                disabledByNewerMessage ? styles.fadedOut : ''
              } ${
                isDisabled ? styles.noHover : ''
              }`}
              onClick={() => !isDisabled ? handleActionClick(action) : null}
              disabled={isDisabled}
            >
              <i className={iconClass}></i>
              <span>{action.label}</span>
            </button>
          )})}
      </div>
    </div>
  );
};

export const ActionButtons = ({
  prompts,
  prompt,
  payload,
  onAccept,
  onReject,
  promptCallBack,
  messageId
}) => {
  const { updateActionableButtonState, messages, addMessage } = useCopilot();

  // Find the current message to get its action state
  const currentMessage = messages.find((msg) => msg.id === messageId);
  const actionState = currentMessage?.actionState;
  const selectedAction = actionState?.selectedAction; // 'accept' | 'reject' | undefined

  const handleAccept = () => {
    let LLMfeedback = true; // to avoid loading state issues
    if (selectedAction || isDisabledByNewerMessage(messageId, messages)) return; // Prevent double click or action on disabled buttons
    
    // Persist accept selection
    updateActionableButtonState(messageId, 'accept');
    
    // Add user message for "Accepted"
    addMessage({
      text: 'Accepted',
      content: 'Accepted',
      type: 'text',
      sender: 'user'
    }, LLMfeedback);
    
    // Previous approach using promptCallBack (commented for potential revert)
    // if (promptCallBack) {
    //   promptCallBack('Accepted', LLMfeedback);
    // }
    
    // Also call the original onAccept callback if provided
    if (onAccept) {
      let onParentUpdate = onAccept(payload);
      if (onParentUpdate) {
        // Send the accept prompt to the API via promptCallBack
        if ((prompts?.accept || prompt?.accept) && promptCallBack) {
          console.log("accepted!!");
          // promptCallBack(prompts.accept || prompt.accept, LLMfeedback);
        } else {
          console.log("No accept prompt provided, just sending payload");
        }
      } else {
        console.log(
          "UI update function returned false, not sending accept prompt"
        );
      }
    }
  };

  const handleReject = () => {
     let LLMfeedback = true; // to avoid loading state issues
    if (selectedAction || isDisabledByNewerMessage(messageId, messages)) return; // Prevent double click or action on disabled buttons
    
    // Persist reject selection
    updateActionableButtonState(messageId, 'reject');
    
    // Add user message for "Rejected"
    addMessage({
      text: 'Rejected',
      content: 'Rejected',
      type: 'text',
      sender: 'user'
    });
    
    // Previous approach using promptCallBack (commented for potential revert)
    // if (promptCallBack) {
    //   promptCallBack('Rejected', LLMfeedback);
    // }
    
    // Send the reject prompt to the API via promptCallBack
    if ((prompts?.reject || prompt?.reject) && promptCallBack) {
      promptCallBack(prompts?.reject || prompt?.reject, LLMfeedback);
    }

    // Also call the original onReject callback if provided
    if (onReject) {
      onReject(payload);
    }
  };

  // Hide the entire component when action is selected or disabled by newer message
  if (selectedAction || isDisabledByNewerMessage(messageId, messages)) {
    return null;
  }

  return (
    <div className={styles.chatActions}>
      <button
        className={`${styles.actionButton} ${styles.accept}`}
        onClick={handleAccept}
        data-tooltip="Accept"
      >
        <i className="icon_phoenix-checkmark"></i>
      </button>
      <button
        className={`${styles.actionButton} ${styles.reject}`}
        onClick={handleReject}
        data-tooltip="Reject"
      >
        <i className="icon_phoenix-enclose"></i>
      </button>
    </div>
  );
  
  /* Previous approach - show disabled buttons (commented for potential revert)
  return (
    <div className={styles.chatActions}>
      {selectedAction || isDisabledByNewerMessage(messageId, messages) ? (
        <button
          className={`${styles.actionButton} ${styles.accept} ${
            selectedAction === 'accept' ? styles.selected : ''
          } ${
            selectedAction === 'reject' || isDisabledByNewerMessage(messageId, messages) ? styles.fadedOut : ''
          }`}
          onClick={handleAccept}
          disabled
        >
          <i className="icon_phoenix-checkmark"></i>
        </button>
      ) : (
        <Tooltip text="Accept">
          <button
            className={`${styles.actionButton} ${styles.accept}`}
            onClick={handleAccept}
          >
            <i className="icon_phoenix-checkmark"></i>
          </button>
        </Tooltip>
      )}
      {selectedAction || isDisabledByNewerMessage(messageId, messages) ? (
        <button
          className={`${styles.actionButton} ${styles.reject} ${
            selectedAction === 'reject' ? styles.selected : ''
          } ${
            selectedAction === 'accept' || isDisabledByNewerMessage(messageId, messages) ? styles.fadedOut : ''
          }`}
          onClick={handleReject}
          disabled
        >
          <i className="icon_phoenix-enclose"></i>
        </button>
      ) : (
        <Tooltip text="Reject">
          <button
            className={`${styles.actionButton} ${styles.reject}`}
            onClick={handleReject}
          >
            <i className="icon_phoenix-enclose"></i>
          </button>
        </Tooltip>
      )}
    </div>
  );
  */
};

export const InputLabelBlock = ({ attributes, prompt, promptCallBack, messageId }) => {
  const { updateInputLabelState, messages } = useCopilot();
  const [inputValue, setInputValue] = useState(attributes.value || '');

  const currentMessage = messages.find(msg => msg.id === messageId);
  const inputLabelState = currentMessage?.inputLabelState;
  const isInputLabelUsed = inputLabelState?.isUsed;
  const disabledByNewerMessage = isDisabledByNewerMessage(messageId, messages);
  const isDisabled = isInputLabelUsed || disabledByNewerMessage;

  return (
    <div className={styles.chatApply}>
      <FormInput className="mb-8" name="input-label" type={attributes.inputType} value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={isDisabled} />
      <Button
        theme="primary"
        size="xl"
        disabled={isDisabled || inputValue.trim() === ''}
        className={styles.submitButton}
        label={attributes.submitCTA}
        onClick={() => {
          if (isDisabled) return; // Prevent action on disabled state
          // Mark input label as used
          updateInputLabelState(messageId, true);
          promptCallBack(`${prompt} ${inputValue}`);
        }} 
      />
    </div>
  )
};

export const SelectComponent = ({
  selectRenderer,
  promptCallBack,
  prompt = "",
  attributes = {},
  customType = "",
  options = [],
  messageId
}) => {
  const { updateSelectState, messages } = useCopilot();
  const currentMessage = messages.find(msg => msg.id === messageId);
  const selectState = currentMessage?.selectState;
  const isSelectUsed = selectState?.isUsed;
  const disabledByNewerMessage = isDisabledByNewerMessage(messageId, messages);
  const isDisabled = isSelectUsed || disabledByNewerMessage;

  // Memoize listItems to prevent unnecessary recalculations
  const listItems = useMemo(() => {
    return selectRenderer ? selectRenderer(options, customType) : options;
  }, [selectRenderer, options, customType]);

  // Add safety check to ensure listItems is an array and has items
  const safeListItems = useMemo(() => {
    return Array.isArray(listItems) ? listItems : [];
  }, [listItems]);
  
  // Memoize initial selection to prevent object recreation
  const initialSelection = useMemo(() => {
    return safeListItems.length > 0 ? safeListItems[0] : {};
  }, [safeListItems]);
  
  const [selectedOption, setSelectedOption] = useState(() => {
    // Initialize with the full option object instead of just the value
    return initialSelection || {};
  });
  
  const { label, submitCTA } = attributes;

  // Only update selectedOption if we don't have a valid selection and options are available
  useEffect(() => {
    if (safeListItems.length > 0 && (!selectedOption || !selectedOption.value)) {
      setSelectedOption(safeListItems[0] || {});
    }
  }, [safeListItems.length]); // Only depend on length, not the entire array

  // Don't render if no options are available
  if (safeListItems.length === 0) {
    return (
      <>
        <label className="form-label">{label || "No options available"}</label>
        <p>No options provided for selection.</p>
      </>
    );
  }

  return (
    <div className={styles.CustomFieldSelect}>
      <label className="form-label">{label}</label>
      <SingleSelect
        selected={selectedOption?.value || ""}
        options={safeListItems}
        displayLabel={selectedOption?.label || "Select an option"}
        onChange={(item) => {
          setSelectedOption(item || {});
        }}
        className="mt-5"
        top={true}
        disabled={isDisabled}
      />
      <Button
        theme="primary"
        size="xl"
        className={styles.submitButton}
        label={submitCTA || "submit"}
        disabled={isDisabled}
        onClick={() => {
          if (isDisabled) return; // Prevent action on disabled state
          // Mark select as used
          updateSelectState(messageId, true);
          if (promptCallBack) {
              const customContext = {
                  campaignSelectionSkipped: "not_applied",
                  locationSelectionSkipped: "applied",
                  productSelectionSkipped: "applied",
              };
            promptCallBack(`${prompt} ${selectedOption?.value || `Continue with ${selectedOption.label}`}`, false, customContext);
          }
        }} 
      />
    </div>
  );
};

export const CustomFieldSelectComponent = ({
  promptCallBack,
  onItemClick,
  attributes = {},
  options = [],
  prompt,
  messageId
}) => {
  const { updateCustomFieldSelectionState, messages } = useCopilot();
  const currentMessage = messages.find(msg => msg.id === messageId);
  const customFieldState = currentMessage?.customFieldSelectionState;
  const isCustomFieldUsed = customFieldState?.isUsed;
  const disabledByNewerMessage = isDisabledByNewerMessage(messageId, messages);
  const isDisabled = isCustomFieldUsed || disabledByNewerMessage;

  const listItems = options;
  const [selectedOption, setSelectedOption] = useState(listItems[0].value || {});
  const { label, submitCTA } = attributes;

  return (
    <div className={styles.CustomFieldSelect}>
      <label className="form-label">{label}</label>
      <SingleSelect
        selected={selectedOption}
        options={listItems}
        displayLabel={selectedOption?.label || "Select an option"}
        onChange={(item) => {
          setSelectedOption(item?.value || "");
        }}
        showSearch
        top={true}
        disabled={isDisabled}
        />
        {/* // customCTAJSX={<div className={styles.addCustomButton}  onClick={() => { onItemClick({ type: "createCustomField" }) }} ><i className="icon_phoenix-add_circle" />Add custom field</div>} */}
      <Button
        theme="primary"
        size="xl"
        className={styles.submitButton}
        label={submitCTA}
        disabled={isDisabled}
        onClick={() => {
          if (isDisabled) return; // Prevent action on disabled state
          // Mark custom field selection as used
          updateCustomFieldSelectionState(messageId, true);
          if (promptCallBack) {
            promptCallBack(`${prompt} ${selectedOption.value}`);
          }
        }} 
      />
    </div>
  );
};

export const FallbackBlock = ({ type, text, content }) => (
  <div className={styles.chatText}>
    {text || content || <em>Unsupported message type: <code>{type}</code></em>}
  </div>
);

export const StepperBlock = ({ stepperId, steps, messageId }) => {
  const { updateStepperState, messages } = useCopilot();

  // Find current message and its stepper state
  const currentMessage = messages.find(msg => msg.id === messageId);
  const stepperState = currentMessage?.stepperState || {};
  const currentSteps = stepperState[stepperId] || steps;

  // Check if this stepper should be rendered
  // Only render if this is the first message with this stepperId
  const currentMessageIndex = messages.findIndex(msg => msg.id === messageId);
  const isFirstStepperWithThisId = !messages.slice(0, currentMessageIndex).some(msg => 
    msg.blocks?.some(block => block.type === 'stepper' && block.stepperId === stepperId)
  );

  // Effect to handle stepper updates from new messages
  useEffect(() => {
    // Look for newer messages with the same stepperId to update our steps
    if (currentMessageIndex === -1) return;

    // Check messages after this one for stepper updates with the same stepperId
    const laterMessages = messages.slice(currentMessageIndex + 1);
    
    for (const laterMsg of laterMessages) {
      if (laterMsg.blocks) {
        const stepperBlock = laterMsg.blocks.find(
          block => block.type === 'stepper' && block.stepperId === stepperId
        );
        
        if (stepperBlock && stepperBlock.steps) {
          // Check if the steps are actually different before updating
          const currentStepsJson = JSON.stringify(currentSteps);
          const newStepsJson = JSON.stringify(stepperBlock.steps);
          
          if (currentStepsJson !== newStepsJson) {
            // Update this message's stepper state with the newer steps
            updateStepperState(messageId, stepperId, stepperBlock.steps);
          }
          break; // Use the most recent update
        }
      }
    }
  }, [messages.length, messageId, stepperId, updateStepperState, currentSteps]);

  // Don't render if this is not the first stepper with this ID
  // (Completion check is now handled in the parent component)
  if (!isFirstStepperWithThisId) {
    return null;
  }

  // Look for the latest stepper data in subsequent messages for rendering
  let latestSteps = currentSteps;
  const laterMessages = messages.slice(currentMessageIndex + 1);
  for (const laterMsg of laterMessages) {
    if (laterMsg.blocks) {
      const stepperBlock = laterMsg.blocks.find(
        block => block.type === 'stepper' && block.stepperId === stepperId
      );
      if (stepperBlock && stepperBlock.steps) {
        latestSteps = stepperBlock.steps;
      }
    }
  }

  return (
    <div className={styles.chatStepper}>
      {latestSteps.map((step, index) => (
        <div 
          key={step.id} 
          className={`${styles.stepperItem} ${step.processed ? styles.processed : styles.pending}`}
        >
          <div className={`${styles.stepperIcon} ${step.processed ? styles.processed : styles.pending}`}>
            {step.processed ? (
              <i className="icon_phoenix-success-fill"></i>
            ) : (
              <i className="icon_phoenix-success-fill"></i>
            )}
          </div>
            <div className={styles.stepperLabel}>
              {step.label}
              {/* {!step.processed && (
                <div className={styles.stepperLoader}>
                  <div className={styles.loadingDots}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        )
      )}
    </div>
  );
};

const VISUALIZATIONS_SHORT_CODES = {
  VERTICAL_BAR_CHART: "column",
  HORIZONTAL_BAR_CHART: "bar",
  LINE_CHART: "spline", // Coverted to Spline chart as per JIRA BIRD-17304
  PIE_CHART: "pie",
  DONUT_CHART: "donut",
  TABLE: "table",
  AREA_CHART: "areaspline",
  SPLINE: "spline",
  HEATMAP: "heatmap",
  STREAMGRAPH: "streamgraph",
  STACKED_AREA: "area",
  QUADRANT_CHART: "bubble",
  SANKEY_CHART: "sankey",
  VARIABLE_PIE_CHART: "variablepie",
  SINGLE_DATA_WIDGET: "SingleDataWidget",
  PROGRESS_BAR_WIDGET: "ProgressBarWidget",
  SPEEDOMETER: "gauge",
  TEXT: "text",
  PARAGRAPH: "paragraph",
};

export function parseApiResponseToBarConfig(apiResponse, baseConfig) {
  if (!Array.isArray(apiResponse) || !apiResponse.length) return baseConfig;

  const { chartCommonConfig, apiData } = apiResponse[0] || {};
  const {
    visualisationType,
  } = chartCommonConfig || {};


  // -------------------------------
  // 🧩 TABLE CASE HANDLING
  // -------------------------------
 if (visualisationType === "Table") {
  function deepFillDefaults(target, defaults) {
    // we reverse merge order so that API values take precedence
    return mergeWith({}, target, defaults, (objValue, srcValue) => {
      // if both are arrays → keep API’s version (target)
      if (isArray(objValue)) return objValue;
      // if both are functions → keep API’s version
      if (typeof objValue === "function") return objValue;
      // let mergeWith handle deep merge for nested objects
    });
  }

  const parsedData = apiResponse.map((item) => {
    const baseCopy = JSON.parse(JSON.stringify(tableReportData.reportData)); // avoid mutation

    // API wins, base fills missing
    const merged = deepFillDefaults(item, baseCopy);

    // Recombine in expected format
    return {
      ...merged.chartCommonConfig,
      apiData: merged.apiData,
    };
  });

  return parsedData || baseConfig;
}
 else {
      // -------------------------------
      // 🧩 CHART CASE HANDLING (Non-table)
      // -------------------------------
      const { dataPoints = [], dataPresent = false, groupByType, dateDiff } = apiData || {};
      const { graphId, parserConfig = {}, primaryChartStyle, doubleYaxis, stackedGraph } = chartCommonConfig || {};
      // Map backend chart type to frontend short code (bar, column, etc.)
      const resolvedChartType = VISUALIZATIONS_SHORT_CODES[primaryChartStyle?.toUpperCase?.()] || baseConfig.parserConfig.primaryChartStyle;

      const stackingValue = Object.values(parserConfig?.plotOptions || {}).find((opt) => opt && opt.stacking !== undefined)?.stacking;
      let axisLevelCount = 1;
      // --- update parserConfig dynamically ---
      const updatedParserConfig = {
          ...baseConfig.parserConfig,
          ...parserConfig,
          barGrouping: stackingValue ? true : false,
          graphTitle: parserConfig.graphTitle || baseConfig.parserConfig.graphTitle,
          doubleYaxis: !!doubleYaxis,
          dataPoints: parserConfig.dataPoints || baseConfig.parserConfig.dataPoints,
          dataFormat: parserConfig.dataFormat || baseConfig.parserConfig.dataFormat,
          categoryValueMap: parserConfig.categoryValueMap || baseConfig.parserConfig.categoryValueMap,
          isGroupedArrayWithoutCategoryKey: parserConfig.isGroupedArrayWithoutCategoryKey,
          primaryChartStyle: resolvedChartType,
          defaultChartStyle: resolvedChartType,
          stackedGraph: stackingValue ? true : false,
          seriesDetails:
              parserConfig.seriesDetails?.map((sd, index) => {
                  if (index !== 0 && stackingValue && (sd.type !== "LINE_CHART" || sd.type === "spline")) {
                      sd.hideDataLabels = true;
                  }
                  if (resolvedChartType === "bar" || resolvedChartType === "column") {
                      if (sd.type === "LINE_CHART" || sd.type === "spline") {
                          // Only set yAxis if it's not already defined in the source data
                          if (sd.yAxis === undefined || sd.yAxis === null) {
                              sd.axisLevel = axisLevelCount;
                              sd.yAxis = axisLevelCount;
                              // axisLevelCount += 1;
                          }
                      } else {
                          sd.axisLevel = 0;
                          sd.yAxis = 0;
                      }
                  }
                  if (sd.type === "LINE_CHART" && resolvedChartType !== "spline") {
                      sd.color = "#2C3E91";
                  }
                  return {
                      ...baseConfig.parserConfig.seriesDetails[0],
                      ...sd,
                      type: VISUALIZATIONS_SHORT_CODES[sd.type] || sd.type?.toLowerCase?.() || baseConfig.parserConfig.seriesDetails[0].type,
                  };
              }) || baseConfig.parserConfig.seriesDetails,
      };
      // --- derive additional visualization-specific props ---
      if (resolvedChartType === "pie") {
          updatedParserConfig.plotDataConfig = [...baseConfig.parserConfig.plotDataConfig[resolvedChartType]];
      } else {
          updatedParserConfig.plotDataConfig = {
              ...baseConfig.parserConfig.plotDataConfig[resolvedChartType],
          };
          if (chartCommonConfig?.parserConfig?.plotOptions) {
              updatedParserConfig.plotDataConfig = merge({}, updatedParserConfig.plotDataConfig, chartCommonConfig?.parserConfig?.plotOptions);
          }
      }


      // set axis label alignment dynamically if not defined
      if (!updatedParserConfig.xAxisLabelsAlignment) {
          updatedParserConfig.xAxisLabelsAlignment = {
              bar: "right",
              column: "center",
              spline: "center",
          };
      }

      // optional: xAxisLabelsWidth tweak based on chart style
      if (resolvedChartType === "bar") {
          updatedParserConfig.xAxisLabelsWidth = 120;
      } else if (resolvedChartType === "column") {
          updatedParserConfig.xAxisLabelsWidth = 80;
      } else {
          updatedParserConfig.xAxisLabelsWidth = 60;
      }


      // --- assemble final config ---
      const finalConfig = {
          ...baseConfig,
          graphId: graphId || baseConfig.graphId,
          heading: parserConfig.graphTitle || baseConfig.heading,
          mainHeading: parserConfig.graphTitle || baseConfig.mainHeading,
          parserConfig: updatedParserConfig,
          apiData: {
              dataPoints,
              dataPresent,
              groupByType,
              dateDiff,
          },
          isInsightsAvailable: !!dataPresent,
      };

      return finalConfig;
  }
}

export const GraphBlock = ({ reportConfig, chartConfigs, messageId, content, addToDashboardCallback }) => {
    return (
        <div className={styles.chatGraphTable}>
            <GraphTable addToDashboardCallback={addToDashboardCallback} copilotChart={"copilot-chart"} reportConfig={content} />
        </div>
    );
};



const generatePromptFromSelectedOptions = (selectedOptions, onSubmitCallback) => {
    let ids = selectedOptions.map(opt => opt.value);
    // Fix: Use name, label, or alias as fallback, and filter out undefined values
    let alias = Object.values(selectedOptions)
        .map(opt => opt.alias || opt.name || opt.label || opt.value)
        .filter(Boolean); // Remove any undefined/null values
    
    
    let promptText = `continue with values: ${ids.join(", ")}`;
    // if (onSubmitCallback) {
    //     promptText = onSubmitCallback(ids);
    // }
    
    // Handle case when isAllSelected is true
    // if (isAllSelected) {
    //     return { 
    //         promptText, 
    //         displayPrompt: `Continue with all locations selected` 
    //     };
    // }
    
    // Handle case with specific selections
    const displayText = alias.length > 0 
        ? (alias.length > 5 
            ? `${alias.slice(0, 5).join(", ")} and ${alias.length - 5} more...`
            : alias.join(", "))
        : "selected locations";
    
    return { 
        promptText, 
        displayPrompt: `Continue with these locations: ${displayText}` 
    };
};

  // const checkLastMessageIfMultiSelectDropDownFn = (messages) => {
  //   if (!messages || messages.length === 0) return false;
  //   let response = false;
  //   const lastMessage = messages[messages.length - 1];
  //   // Check if the last message is a multi-select dropdown
  //   response = lastMessage.type === "multiSelectDropDown" || false;
  //   if(lastMessage?.blocks && Array.isArray(lastMessage.blocks)){
  //       const multiSelectBlock = lastMessage.blocks.find(block => block.type === 'multiSelectDropDown');
  //     response = multiSelectBlock ? true : false;
  //   }
  //   return response;
  // }

export const MultiSelectDropdown = ({
  promptCallBack,
  prompt = "",
  attributes = {},
  customType = "",
  options = [],
  selectedOptions = [],
  messageId,
  componentId,
  dispatch,
  displayNotification,
  ...props
}) => {
  const {
    removeComponentByMessageId,
    addMessage,
    sendBotMessage,
    messages,
  } = useCopilot();

  const { label, submitCTA, placeholder } = attributes;

  // Check if component is disabled by newer message
  const disabledByNewerMessage = isDisabledByNewerMessage(messageId, messages);
  const isDisabled = disabledByNewerMessage;
  
  // Ref to directly control the MultiSelectWrapper component
  const multiSelectRef = React.useRef(null);
  const containerRef = React.useRef(null);
  
  /* ---------- LIVE selection (NO rerender) ---------- */
  const selectedRef = React.useRef(selectedOptions || []);
  const isOpenRef = React.useRef(false);

  /* ---------- Height management without re-renders ---------- */
  const updateContainerHeight = (isOpen) => {
    if (containerRef.current) {
      if (isOpen) {
        containerRef.current.style.height = '270px';
        containerRef.current.style.transition = 'height 0.2s ease-in-out';
      } else {
        containerRef.current.style.height = 'auto';
        containerRef.current.style.transition = 'height 0.2s ease-in-out';
        // Remove transition after animation completes
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.transition = '';
          }
        }, 200);
      }
    }
  };


  /* ---------- Reset dropdown when disabled ---------- */
  React.useEffect(() => {
    if (isDisabled && isOpenRef.current) {
      isOpenRef.current = false;
      updateContainerHeight(false);
      // Force close the dropdown via ref if available
      if (multiSelectRef.current && multiSelectRef.current.closeDropdown) {
        multiSelectRef.current.closeDropdown();
      }
    }
  }, [isDisabled]);

  const openCallback = (data) => {
    isOpenRef.current = true;
    updateContainerHeight(true);
  };

  const closeCallback = () => {
    isOpenRef.current = false;
    updateContainerHeight(false);
  };

  return (
    <div 
      ref={containerRef}
      className={`${styles.MultiSelectDropdown} ${
        isDisabled ? styles.fadedOut : ''
      }`}
      style={{ overflow: 'hidden' }} // Ensure smooth height transitions
    >
      <MultiSelectWrapper
        ref={multiSelectRef}
        isResetAllowed={false}
        label={label || "Select options"}
        placeholder={placeholder || "Select options"}
        options={options}
        openCallback={openCallback}
        closeCallback={closeCallback}
        selected={selectedRef.current} // 🔐 stable reference
        showSearch
        showSelecteAll
        className="mt-5"
        disabled={isDisabled}
        onBlur={(selectedOptions) => {
          if (isDisabled) return; // Prevent action on disabled state
          selectedRef.current = selectedOptions || [];
          // Using ref-based approach - no state changes needed here
        }}
      />

      <Button
        theme="primary"
        size="xl"
        className={`${styles.submitButton} ${
          isDisabled ? styles.noHover : ''
        }`}
        label={submitCTA || "Continue"}
        disabled={isDisabled}
        onClick={() => {
          if (isDisabled) return; // Prevent action on disabled state
          
          if (selectedRef.current.length === 0) {
                 dispatch(
                    displayNotification({
                        type: "error",
                        message: "Please select at least one option to continue.",
                    }),
                );
          
            return
          };
          const committedSelection = selectedRef.current;

          let promptText = "";
          let displayPrompt = "";

          if (props.onSubmitCallback) {
            ({ promptText, displayPrompt } =
              generatePromptFromSelectedOptions(
                committedSelection,
                props.onSubmitCallback
              ));
          } else {
            console.log("No onSubmitCallback provided");
            return;
          }

          // 🔒 lock dropdown for this message
          // updateMultiSelectDropdownState(messageId, true);

             const customContext = {
                  campaignSelectionSkipped: "not_applied",
                  locationSelectionSkipped: "applied",
              };

              const rootLvlContext = {
                  display_prompt: displayPrompt,
              };


          addMessage(
            {
              text: promptText,
              content: displayPrompt,
              type: "text",
              sender: "user",
            },
            false,
            customContext,
            rootLvlContext
          );

          sendBotMessage(promptText);

          removeComponentByMessageId(messageId, componentId);
        }}
      />
    </div>
  );
};


export const MultiSelectPaginatedDropdown = ({ messageId, componentId, promptCallBack, ...props }) => {
    const { removeComponentByMessageId, updateMultiSelectDropdownState, messages, addMessage, sendBotMessage } = useCopilot();
    const [isDropdownUsed, setIsDropdownUsed] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState(props?.options?.selectedOptions || {});

    // Find the current message to get its dropdown state
    const currentMessage = messages.find(msg => msg.id === messageId);
    
    // Handle both formats: direct state or state within blocks
    let dropdownState = currentMessage?.multiSelectDropdownState;
    
    // If not found at root level, check if it's in blocks array
    if (!dropdownState && currentMessage?.blocks && Array.isArray(currentMessage.blocks)) {
        const multiSelectBlock = currentMessage.blocks.find(block => block.type === 'multiSelectPaginatedDropDown');
        if (multiSelectBlock) {
            dropdownState = multiSelectBlock.multiSelectDropdownState;
        }
    }
    
    const isDropdownDisabled = dropdownState?.isUsed;
    const disabledByNewerMessage = isDisabledByNewerMessage(messageId, messages);

    const handleOnBlur = (selectedOptionsFromChild, areOptionsStateDeselected, isClearClicked, totalCount) => {
        // Check if user selected ALL items
        // When Select All is clicked, areOptionsStateDeselected becomes true and selectedOptionsFromChild becomes empty
        // So we detect Select All by checking if deselection mode is ON and options are empty
        const isAllSelected = areOptionsStateDeselected === true && Object.keys(selectedOptionsFromChild).length === 0;
        const isSelectAllClicked = isAllSelected;
        
        // Save the selected options in parent state
        setSelectedOptions(selectedOptionsFromChild);
        if(isClearClicked) return; // Do not proceed if clear was clicked
        
        let promptText = "";
        let displayPrompt = "";
        if (props.onSubmitCallback) {
           ({promptText, displayPrompt} = generatePromptFromSelectedOptions(selectedOptionsFromChild, props.onSubmitCallback, isAllSelected || isSelectAllClicked, props.options))
        } else {
            console.log(`No onSubmitCallback provided for MultiSelectPaginatedDropdown`);
        }
        if (Object.keys(selectedOptionsFromChild).length > 0 || isAllSelected) {
            // Mark dropdown as used after selection
            setIsDropdownUsed(true);
            // Update IndexedDB state
            updateMultiSelectDropdownState(messageId, true);
            const rootLvlContext = {
                display_prompt: displayPrompt,
            };
            addMessage(
                {
                    text: promptText,
                    content: displayPrompt,
                    type: "text",
                    sender: "user",
                },
                false,
                null,
                rootLvlContext
            );
            sendBotMessage(promptText);

            // if (promptCallBack) {
            //     promptCallBack(promptText, false, displayPrompt);
            // }
            removeComponentByMessageId(messageId, componentId);
        }
    };

    const handleOnOutsideClick = (values) => {
      setSelectedOptions(values)
        // Preserve the selected options in state when clicking outside
        // Do nothing - selections remain in the selectedOptions state
    };


    // Create a data function that uses options if available, otherwise falls back to API
    const getDataFunction = props.options
        ? async (page, query) => {
              // Ensure we return the correct format with list and count
              return {
                  list: Array.isArray(props.options.list) ? props.options.list : [],
                  count: props.options.count || 0,
              };
          }
        : props.getDataFromApi || (() => Promise.resolve({ list: [], count: 0 }));

    // Use both local state, persisted state, and newer message check to determine if dropdown is disabled
    const finalDropdownUsedState = isDropdownUsed || isDropdownDisabled || disabledByNewerMessage;

    return (
        <div className={`${styles.multiSelectDropDown} multiSelectDropDown-parent`}>
            <MultiSelectPaginatedDropdownComponent
                {...props}
                apiEndpoint={""}
                isDataFromAPI={!props.options} // Use API mode only when no static options provided
                parentAreOptionsStateDeselected={false}
                parentSelectedOptions={selectedOptions}
                onBlur={handleOnBlur}
                disableDeselectionLogic={true}
                openFromRight={true}
                parentTotalCount={props.options?.count || null}
                onOutsideClick={handleOnOutsideClick}
                placeHolderText={props.placeHolderText || "Business Locations"}
                primaryLabelKey={"name"} // Key for primary label display
                getDataFromApi={getDataFunction}
                messageId={messageId}
                showSearch={true}
                savedState={finalDropdownUsedState}
                pluralSuffixName={props.pluralSuffixName || "items"}
                checkerString={props.checkerString || "id"}
                secondaryLabelKey={props.secondaryLabelKey || "id"}
                defaultState={finalDropdownUsedState}
                // When using static data, pass the list as parentOptions instead of options
                parentOptions={props.options ? props.options.list : undefined}
            />
        </div>
    );
};

// Memoize the GraphTableBlock component to prevent unnecessary re-renders
export const GraphTableBlock = React.memo(({ messageId, content }) => {
    // Use the content prop if provided, otherwise fall back to empty array
    let apiResponse = [];

    content.map((item, index) => {
        apiResponse.push({
            chartCommonConfig: item.chartCommonConfig,
            apiData: item.apiData,
        });
    });

    const configToParseList = parseApiResponseToBarConfig(apiResponse, columnBaseConfig);
    return configToParseList?.map(configToParse=>{
      return (
              <GraphTable key={configToParse.graphId} reportConfig={{...configToParse,visualisationType: "copilot-table"}} />
      );
    })
});

// === Component Registry Factory ===
export const getComponentRegistry = ({ onAccept, onReject, onItemClick, selectRenderer, imageS3Callback, messageId, onSubmit, promptCallBack, addToDashboardCallback, onSubmitCallback, dispatch, displayNotification }) => ({
  heading: HeadingBlock,
  text: TextBlock,
  image: ImageBlock,
  error: ErrorBlock,
  collapsible: (props) => (
    <CollapsibleBlock 
      {...props} 
      promptCallBack={promptCallBack} 
      messageId={messageId} 
    />
  ),
  card: (props) => (
    <CardBlock 
      {...props} 
      onAccept={onAccept} 
      onReject={onReject} 
      promptCallBack={promptCallBack} 
      messageId={messageId} 
    />
  ),
  suggestions: (props) => (
    <SuggestionButtons 
      {...props} 
      promptCallBack={promptCallBack} 
      messageId={messageId} 
    />
  ),
  divider: Divider,
  fileHandle: (props) => (
    <FileHandleBlock 
      {...props} 
      onItemClick={onItemClick} 
      imageS3Callback={imageS3Callback} 
      promptCallBack={promptCallBack} 
      messageId={messageId} />
  ),
  actions: (props) => (
    <ActionButtons
      {...props}
      onAccept={onAccept}
      onReject={onReject}
      promptCallBack={promptCallBack}
      messageId={messageId}
    />
  ),
  inputLabel: (props) => (
    <InputLabelBlock 
      {...props} 
      promptCallBack={promptCallBack} 
      messageId={messageId}
    />
  ),
  select: (props) => (
    <SelectComponent
      {...props}
      selectRenderer={selectRenderer}
      promptCallBack={promptCallBack}
      messageId={messageId}
    />
  ),
  "custom-field-mapping": (props) => (
    <CustomFieldSelectComponent 
      {...props}
      onItemClick={onItemClick}
      promptCallBack={promptCallBack}
      messageId={messageId}
      />
    ),
    stepper: (props) => (
      <StepperBlock 
      {...props}
      messageId={messageId}
      />
    ),
    chart: (props) => {
      return (
        /**
         * using directly GraphTableBlock
        */
       <GraphBlock {...props}
       messageId={messageId} 
       addToDashboardCallback={addToDashboardCallback}
       />
       // <GraphTableBlock
       //   {...props}
       //   messageId={messageId}
       // />
      );},
      table: (props) => {
        return (
          <GraphTableBlock 
          {...props}
          messageId={messageId}
          />
        )},
        multiSelectDropDown: (props) => {
          return (
            <MultiSelectDropdown 
            {...props}
            messageId={messageId}
            onSubmitCallback={onSubmitCallback}
            promptCallBack={promptCallBack}
            dispatch={dispatch}
            displayNotification={displayNotification}
            />
          )},
          multiSelectPaginatedDropDown: (props) => {
            return (
              <MultiSelectPaginatedDropdown 
              {...props}
              messageId={messageId}
              onSubmitCallback={onSubmitCallback}
              promptCallBack={promptCallBack}
      // You can set default props here if needed
      // apiEndpoint={props.apiEndpoint || '/api/default-endpoint'}
    />
  )},
});
