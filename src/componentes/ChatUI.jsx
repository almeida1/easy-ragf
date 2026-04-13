import React, { useRef, useEffect } from 'react';
import './ChatUI.css';

const ChatUI = ({ messages, input, setInput, onSendMessage, isLoading }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSendMessage();
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-card">
                <header className="chat-header">
                    <div className="icon-bot">
                        <span className="material-symbols-outlined">psychology</span>
                    </div>
                    <div>
                        <h3>Faça perguntas considerando a documentação fornecida</h3>
                        <p>O histórico da conversa será perdido ao fechar a página  </p>
                    </div>
                </header>

                <div className="messages-container">
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <span className="material-symbols-outlined">forum</span>
                            <h3>Inicie uma conversa</h3>
                            <p>As perguntas sobre os documentos serão respondidas aqui.</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`message-bubble ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))
                    )}

                    {isLoading && (
                        <div className="message-bubble bot">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="input-area" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Digite sua dúvida aqui..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="btn-send"
                            disabled={!input.trim() || isLoading}
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatUI;
