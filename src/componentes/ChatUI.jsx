import React, { useRef, useEffect } from 'react';
import RagResponse from './RagResponse';
import './ChatUI.css';

const extractRagData = (msg) => {
    if (!msg) return null;
    if (msg.data && typeof msg.data === 'object' && ('answer' in msg.data || 'context' in msg.data || 'evaluation' in msg.data)) {
        return msg.data;
    }
    if (typeof msg.content === 'object' && msg.content !== null && ('answer' in msg.content || 'context' in msg.content || 'evaluation' in msg.content)) {
        return msg.content;
    }
    if (typeof msg.content === 'string') {
        const trimmed = msg.content.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            try {
                const parsed = JSON.parse(trimmed);
                if (parsed && typeof parsed === 'object' && ('answer' in parsed || 'context' in parsed || 'evaluation' in parsed)) {
                    return parsed;
                }
            } catch {
                // Conteudo nao e JSON RAG valido
            }
        }
    }
    return null;
};

const ChatUI = ({ 
    messages, 
    input, 
    setInput, 
    onSendMessage, 
    isLoading,
    onLoadSample,
    onClearChat 
}) => {
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
                    <div className="header-identity">
                        <div className="icon-bot">
                            <span className="material-symbols-outlined">psychology</span>
                        </div>
                        <div>
                            <h3>Assistente RAG</h3>
                            <p>Consulta semântica aos seus documentos indexados</p>
                        </div>
                    </div>

                    {messages.length > 0 && onClearChat && (
                        <button 
                            type="button" 
                            className="btn-clear-chat" 
                            onClick={onClearChat}
                            title="Limpar histórico de mensagens"
                        >
                            <span className="material-symbols-outlined">delete_sweep</span>
                            <span>Limpar Chat</span>
                        </button>
                    )}
                </header>

                <div className="messages-container">
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <span className="material-symbols-outlined empty-icon">forum</span>
                            <h3>Comece uma conversa</h3>
                            <p>Faça perguntas sobre os documentos que você enviou para o sistema.</p>
                            
                            {onLoadSample && (
                                <div className="sample-action-wrapper">
                                    <button 
                                        type="button" 
                                        className="btn-sample-rag"
                                        onClick={onLoadSample}
                                    >
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                        <span>Carregar exemplo de consulta RAG</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const ragData = msg.role === 'bot' ? extractRagData(msg) : null;

                            if (ragData) {
                                return (
                                    <div key={index} className="message-bubble bot rag-bubble">
                                        <RagResponse data={ragData} />
                                    </div>
                                );
                            }

                            return (
                                <div key={index} className={`message-bubble ${msg.role}`}>
                                    {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
                                </div>
                            );
                        })
                    )}
                    
                    {isLoading && (
                        <div className="message-bubble bot loading-bubble">
                            <div className="typing-header">
                                <span className="material-symbols-outlined rotating">progress_activity</span>
                                <span>Consultando base de conhecimento e gerando resposta...</span>
                            </div>
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
                            placeholder="Digite sua dúvida sobre os documentos..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            className="btn-send"
                            disabled={!input.trim() || isLoading}
                            title="Enviar pergunta"
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
