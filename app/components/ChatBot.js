"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ChatBot.module.css";
import { useSelector } from "react-redux";

export default function ChatBot() {
  const user = useSelector((state) => state.auth.user);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I'm your Luxe Salon assistant. How can I help you with your enquiries today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
 
//  http://127.0.0.1:5001/chat
    try {
      const response = await fetch("https://saloon-ai-hnjc.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage.content })
      });

      if (!response.ok) throw new Error("Failed to get response");
      
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "I'm sorry, I'm having trouble connecting to the server. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className={styles.chatContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <h3>Luxe Assistant</h3>
              <p>Online | Customer Support</p>
            </div>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className={styles.messagesArea}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${msg.role === "user" ? styles.userMessage : styles.botMessage}`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className={styles.typingIndicator}>
                Assistant is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className={styles.inputArea} onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className={styles.sendButton} disabled={isLoading || !message.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        className={styles.chatButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Chat"
      >
        {isOpen ? (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        ) : (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
    </div>
  );
}
