import React, { useState } from 'react';
import ChatUI from './ChatUI';

const API_URL = "http://localhost:8080/api/retrieval/consultar";

const SAMPLE_RAG_RESPONSE = {
    answer: "Infelizmente, não há informações suficientes no texto para determinar o que é teste baseado em risco segundo Felderer. O texto não menciona o autor Felderer, nem explica o que é teste baseado em risco.",
    context: [
        "Portanto, o TA executa as mesmas atividades para\ncada incremento (ou seja, análise de testes, design de testes, implementação de testes, execução de testes e suporte ao gerenciamento de testes). No entanto, o trabalho do TA pode ser organizado de forma diferente para cada incremento. Os testes se concentram\nnos recursos novos ou modificados. Além disso, devido ao risco aumentado de regressão, o TA deve prestar\natenção especial à refatoração e à montagem de suítes de testes de regressão.",
        "1. Introdução às Tarefas do Analista de Teste no Processo de Teste",
        "fase anterior é concluída. Normalmente, há pouca sobreposição entre essas atividades. Portanto,\nas tarefas do TA geralmente mudam ao longo do tempo. Nas fases iniciais do SDLC, o TA se concentra em apoiar\no planejamento de testes. O TA inicia a análise de testes quando a base de testes está sendo produzida. O design e a implementação\ndos testes seguem em paralelo com o design e a implementação do software. Por fim, o TA executa os"
    ],
    evaluation: {
        "isAccurate": true,
        "rationale": "A resposta afirmou claramente e unicamente que não possui a informação no contexto, sem tentar deduzir ou inventar hipóteses em seguida.",
        "score": 10.0,
        "evidence": "O texto não menciona o autor Felderer, nem explica o que é teste baseado em risco."
    }
};

const ChatContainer = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = {
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: currentInput }),
            });

            if (!response.ok) {
                throw new Error('Erro ao consultar o servidor');
            }

            let ragData = null;
            let rawContent = '';

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                ragData = await response.json();
            } else {
                rawContent = await response.text();
                try {
                    ragData = JSON.parse(rawContent);
                } catch {
                    ragData = null;
                }
            }

            const isRagPayload = ragData && typeof ragData === 'object' && ('answer' in ragData || 'context' in ragData || 'evaluation' in ragData);

            const botMessage = {
                role: 'bot',
                content: isRagPayload ? (ragData.answer || '') : (rawContent || (typeof ragData === 'string' ? ragData : 'Desculpe, não consegui encontrar uma resposta.')),
                data: isRagPayload ? ragData : null
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Erro no RAG:", error);
            const errorMessage = {
                role: 'bot',
                content: "Ocorreu um erro ao processar sua pergunta. Verifique se o servidor backend está rodando em http://localhost:8080."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadSample = () => {
        setMessages([
            {
                role: 'user',
                content: 'O que é teste baseado em risco segundo Felderer?'
            },
            {
                role: 'bot',
                content: SAMPLE_RAG_RESPONSE.answer,
                data: SAMPLE_RAG_RESPONSE
            }
        ]);
    };

    const handleClearChat = () => {
        setMessages([]);
    };

    return (
        <ChatUI
            messages={messages}
            input={input}
            setInput={setInput}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onLoadSample={handleLoadSample}
            onClearChat={handleClearChat}
        />
    );
};

export default ChatContainer;
