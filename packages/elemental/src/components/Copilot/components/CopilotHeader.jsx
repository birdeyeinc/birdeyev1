import React from 'react'
import styles from '../styles/copilot.module.scss'
import aiImg from "../assets/icons/aiImg.svg";


const CopilotHeader = ({ 
  title = "Chat Assistant", 
  onClose, 
  onNewChat, 
  onViewHistory,
  maintainHistory = false,
  showCloseIcon = true,
  showNewChat = true,
  jsxTitle
}) => {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.headerContent}>
        <div className={styles.leftHeader}>
          {jsxTitle ? (
            jsxTitle
          ) : (
            <>
              <span className={styles.aiIcon}>
                <img src={aiImg} alt="empty" />
              </span>
              <h3 className={styles.title}>{title}</h3>
            </>
          )}
        </div>
        <div className={styles.headerActions}>
          {onNewChat && showNewChat && (
            <button
              className={styles.newChatButton}
              onClick={onNewChat}
              title="New chat"
            >
              <i className='icon_phoenix-plus-circle'></i>
            </button>
          )}
          {onViewHistory && maintainHistory && (
            <button
              className={styles.historyButton}
              onClick={onViewHistory}
              title="View chat history"
            >
              <i className='icon_phoenix-list_bullet'></i>
            </button>
          )}
          {onClose && showCloseIcon && (
            <button
              className={styles.closeButton}
              onClick={onClose}
              title="Close chat"
            >
              <i className="icon_phoenix-enclose"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CopilotHeader
