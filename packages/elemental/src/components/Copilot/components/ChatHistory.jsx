import React, { useState } from "react";
import { useCopilot } from "../context/CopilotContext";
import styles from "../styles/copilot.module.scss";
import LoaderBox from "atoms/LoaderBox";

const ChatHistory = ({ chatHistory, onChatSelect, onBack, historyLoading, showHistory, onNewChat, displayNotification, dispatch }) => {
    const { deleteChatSession, updateSessionTitle } = useCopilot();
    const [deletingSessionId, setDeletingSessionId] = useState(null);
    const [editingSessionId, setEditingSessionId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [updatingSessionId, setUpdatingSessionId] = useState(null);

    const handleDeleteSession = async (e, sessionId, index) => {
        e.stopPropagation(); // Prevent triggering onChatSelect

        const isActiveSession = index === 0;
        const confirmMessage = isActiveSession ? "Are you sure you want to delete the active chat session? This will start a new chat." : "Are you sure you want to delete this chat session? This action cannot be undone.";

        // if (window.confirm(confirmMessage)) {
        if (true) {
            // Bypass confirmation for demo purposes later replace by a pop hover
            setDeletingSessionId(sessionId);

            try {
                const success = await deleteChatSession(sessionId);
                if (success) {

                    // If we deleted the active session (index 0), trigger new chat
                    if (isActiveSession && onNewChat) {
                        onNewChat();
                    }
                } else {
                    console.error("Failed to delete session");
                    // You could add a toast notification here
                }
            } catch (error) {
                console.error("Error deleting session:", error);
                // You could add a toast notification here
            } finally {
                setDeletingSessionId(null);
            }
        }
    };

    const handleEditSession = (e, sessionId, currentTitle) => {
        e.stopPropagation(); // Prevent triggering onChatSelect
        setEditingSessionId(sessionId);
        setEditingTitle(currentTitle);
    };

    const handleSaveTitle = async (e, sessionId) => {
        e.stopPropagation(); // Prevent triggering onChatSelect

        if (!editingTitle.trim()) {
                dispatch(
                    displayNotification({
                        type: "error",
                        message: "Title cannot be empty",
                    }),
                );
            // alert("Title cannot be empty");
            return;
        }

        setUpdatingSessionId(sessionId);

        try {
            const success = await updateSessionTitle(sessionId, editingTitle.trim());
            if (success) {
                setEditingSessionId(null);
                setEditingTitle("");
            } else {
                console.error("Failed to update session title");
                dispatch(
                    displayNotification({
                        type: "error",
                        message: "Failed to update session title. Please try again",
                    }),
                );
                // alert("Failed to update session title. Please try again.");
            }
        } catch (error) {
            dispatch(displayNotification({
                type: "error",
                message: "Error updating session title:",
            }));
            console.error("Error updating session title:", error);
            // alert("An error occurred while updating the title. Please try again.");
        } finally {
            setUpdatingSessionId(null);
        }
    };

    const handleCancelEdit = (e) => {
        e.stopPropagation(); // Prevent triggering onChatSelect
        setEditingSessionId(null);
        setEditingTitle("");
    };

    const handleTitleChange = (e) => {
        setEditingTitle(e.target.value);
    };

    const handleTitleKeyDown = (e, sessionId) => {
        if (e.key === "Enter") {
            handleSaveTitle(e, sessionId);
        } else if (e.key === "Escape") {
            handleCancelEdit(e);
        }
    };
    return (
        <div className={historyLoading || showHistory ? styles.chatHistory : styles.chatHistoryHidden}>
            {/* <div className={styles.historyHeader}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Chat
        </button>
        <h3 className={styles.historyTitle}>Chat History</h3>
      </div> */}
            {!historyLoading ? (
                <div className={styles.historyList}>
                    {chatHistory.length === 0 ? (
                        <div className={styles.emptyHistory}>
                            <div className={styles.emptyHistoryIcon}>📝</div>
                            <p className={styles.emptyHistoryText}>No chat history yet</p>
                        </div>
                    ) : (
                        chatHistory.map((chat, index) => (
                            <React.Fragment key={chat.id}>
                                <div className={styles.historyItem} onClick={() => onChatSelect(chat.id)}>
                                    <div className={styles.historyItemContent}>
                                        {editingSessionId === chat.id ? (
                                            <div className={styles.editTitleContainer}>
                                                <input type="text" value={editingTitle} onChange={handleTitleChange} onKeyDown={(e) => handleTitleKeyDown(e, chat.id)} className={styles.editTitleInput} autoFocus onClick={(e) => e.stopPropagation()} />
                                                <div className={styles.editTitleActions}>
                                                    <button onClick={(e) => handleSaveTitle(e, chat.id)} disabled={updatingSessionId === chat.id} className={styles.chatHistorySaveButton} title="Save title">
                                                        {updatingSessionId === chat.id ? <i className="icon_phoenix-loader"></i> : "✓"}
                                                    </button>
                                                    <button onClick={handleCancelEdit} className={styles.chatHistoryCancelButton} title="Cancel edit">
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h4 className={styles.historyItemTitle}>{chat.title || chat.messages?.[0]?.text || chat.messages?.[0]?.content || "No messages"}</h4>
                                                <p className={styles.historyItemDate}>{chat.dateFormatted}</p>
                                            </>
                                        )}
                                    </div>
                                    <div className={styles.historyItemActions}>
                                        {editingSessionId !== chat.id && (
                                            <div className={`${styles.historyItemArrow} ${styles.editAction}`} onClick={(e) => handleEditSession(e, chat.id, chat.title || chat.messages?.[0]?.text || chat.messages?.[0]?.content || "No messages")} title="Edit chat title">
                                                <i className="icon_phoenix-pencil"></i>
                                            </div>
                                        )}
                                        <div className={`${styles.historyItemArrow} ${styles.deleteAction}`} onClick={(e) => handleDeleteSession(e, chat.id, index)} style={deletingSessionId === chat.id ? { pointerEvents: "none", opacity: 0.5 } : {}} title="Delete chat session">
                                            {deletingSessionId === chat.id ? <i className="icon_phoenix-loader"></i> : <i className="icon_phoenix-trash"></i>}
                                        </div>
                                        <div className={styles.historyItemArrow}>
                                            <i className="icon_phoenix-cheveron_close"></i>
                                        </div>
                                    </div>
                                </div>
                                {index < chatHistory.length - 1 && <div className={styles.historyDivider}></div>}
                            </React.Fragment>
                        ))
                    )}
                </div>
            ) : (
                <div className={styles.historyLoading}>
                    <LoaderBox />
                </div>
            )}
        </div>
    );
};

export default ChatHistory;
