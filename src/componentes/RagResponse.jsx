import React, { useState } from 'react';
import './RagResponse.css';

const RagResponse = ({ data }) => {
    const [showContext, setShowContext] = useState(false);
    const [showEvaluation, setShowEvaluation] = useState(true);
    const [showRawJson, setShowRawJson] = useState(false);
    const [copiedSection, setCopiedSection] = useState(null);

    if (!data) return null;

    const { answer, context, evaluation } = data;

    const handleCopy = (text, key) => {
        if (!text) return;
        const textToCopy = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
        navigator.clipboard.writeText(textToCopy);
        setCopiedSection(key);
        setTimeout(() => {
            setCopiedSection(null);
        }, 2000);
    };

    const hasEvaluation = evaluation && (
        evaluation.isAccurate !== undefined || 
        evaluation.score !== undefined || 
        evaluation.rationale || 
        evaluation.evidence
    );

    const hasContext = Array.isArray(context) && context.length > 0;

    const getScoreColorClass = (score) => {
        if (score >= 8) return 'score-high';
        if (score >= 5) return 'score-mid';
        return 'score-low';
    };

    return (
        <div className="rag-response-container">
            {/* Header com badges e metadados rápidos */}
            <div className="rag-header-bar">
                <div className="rag-badge-identity">
                    <span className="material-symbols-outlined rag-spark-icon">auto_awesome</span>
                    <span className="rag-title">Resposta Inteligente RAG</span>
                </div>

                <div className="rag-pills-row">
                    {evaluation?.isAccurate !== undefined && (
                        <div 
                            className={`rag-pill ${evaluation.isAccurate ? 'pill-accurate' : 'pill-warning'}`}
                            title="Avaliação de precisão da resposta com base nos documentos"
                        >
                            <span className="material-symbols-outlined">
                                {evaluation.isAccurate ? 'check_circle' : 'warning'}
                            </span>
                            <span>{evaluation.isAccurate ? 'Alta Precisão' : 'Possível Imprecisão'}</span>
                        </div>
                    )}

                    {evaluation?.score !== undefined && (
                        <div 
                            className={`rag-pill pill-score ${getScoreColorClass(evaluation.score)}`}
                            title="Nota atribuída à resposta"
                        >
                            <span className="material-symbols-outlined">verified</span>
                            <span>Score: {Number(evaluation.score).toFixed(1)}/10</span>
                        </div>
                    )}

                    {hasContext && (
                        <button 
                            type="button"
                            className="rag-pill pill-context-btn" 
                            onClick={() => setShowContext(prev => !prev)}
                            title="Clique para alternar a visualização dos trechos consultados"
                        >
                            <span className="material-symbols-outlined">menu_book</span>
                            <span>{context.length} {context.length === 1 ? 'fonte consultada' : 'fontes consultadas'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Conteúdo Principal da Resposta */}
            <div className="rag-answer-section">
                <div className="rag-answer-text">
                    {answer || 'Nenhuma resposta foi gerada pelo modelo.'}
                </div>

                <div className="rag-action-bar">
                    <button 
                        type="button"
                        className={`rag-copy-btn ${copiedSection === 'answer' ? 'copied' : ''}`}
                        onClick={() => handleCopy(answer, 'answer')}
                        title="Copiar resposta para a área de transferência"
                    >
                        <span className="material-symbols-outlined">
                            {copiedSection === 'answer' ? 'check' : 'content_copy'}
                        </span>
                        <span>{copiedSection === 'answer' ? 'Copiado!' : 'Copiar resposta'}</span>
                    </button>
                </div>
            </div>

            {/* Card de Avaliação (Evaluation) */}
            {hasEvaluation && (
                <div className="rag-collapsible-card rag-evaluation-card">
                    <div 
                        className="rag-card-header"
                        onClick={() => setShowEvaluation(prev => !prev)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowEvaluation(prev => !prev); }}
                    >
                        <div className="rag-card-title">
                            <span className="material-symbols-outlined eval-icon">fact_check</span>
                            <span>Avaliação de Qualidade & Confiabilidade</span>
                        </div>
                        <span className="material-symbols-outlined toggle-chevron">
                            {showEvaluation ? 'expand_less' : 'expand_more'}
                        </span>
                    </div>

                    {showEvaluation && (
                        <div className="rag-card-body">
                            <div className="eval-metrics-grid">
                                {evaluation.isAccurate !== undefined && (
                                    <div className="eval-metric-box">
                                        <span className="metric-box-label">Confiabilidade & Precisão</span>
                                        <div className={`metric-status ${evaluation.isAccurate ? 'status-true' : 'status-false'}`}>
                                            <span className="material-symbols-outlined">
                                                {evaluation.isAccurate ? 'verified_user' : 'report'}
                                            </span>
                                            <span>{evaluation.isAccurate ? 'Resposta precisa e fiel' : 'Conteúdo requer atenção'}</span>
                                        </div>
                                    </div>
                                )}

                                {evaluation.score !== undefined && (
                                    <div className="eval-metric-box">
                                        <span className="metric-box-label">Pontuação do Modelo</span>
                                        <div className="metric-score-group">
                                            <div className="score-display">
                                                <span className="score-val">{Number(evaluation.score).toFixed(1)}</span>
                                                <span className="score-max">/ 10</span>
                                            </div>
                                            <div className="score-bar-track">
                                                <div 
                                                    className={`score-bar-fill ${getScoreColorClass(evaluation.score)}`} 
                                                    style={{ width: `${Math.min(100, Math.max(0, (evaluation.score / 10) * 100))}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {evaluation.rationale && (
                                <div className="eval-field-block">
                                    <div className="field-header">
                                        <span className="material-symbols-outlined">psychology</span>
                                        <span className="field-label">Justificativa da Avaliação</span>
                                    </div>
                                    <p className="field-text">{evaluation.rationale}</p>
                                </div>
                            )}

                            {evaluation.evidence && (
                                <div className="eval-field-block evidence-block">
                                    <div className="field-header">
                                        <span className="material-symbols-outlined">format_quote</span>
                                        <span className="field-label">Evidência no Contexto</span>
                                    </div>
                                    <blockquote className="evidence-quote">
                                        "{evaluation.evidence}"
                                    </blockquote>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Card de Contexto e Documentos Recuperados (Context) */}
            {hasContext && (
                <div className="rag-collapsible-card rag-context-card">
                    <div 
                        className="rag-card-header"
                        onClick={() => setShowContext(prev => !prev)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowContext(prev => !prev); }}
                    >
                        <div className="rag-card-title">
                            <span className="material-symbols-outlined context-icon">menu_book</span>
                            <span>Fontes & Trechos Recuperados dos Documentos</span>
                            <span className="context-counter-badge">{context.length}</span>
                        </div>
                        <span className="material-symbols-outlined toggle-chevron">
                            {showContext ? 'expand_less' : 'expand_more'}
                        </span>
                    </div>

                    {showContext && (
                        <div className="rag-card-body">
                            <p className="context-intro-text">
                                Fragmentos extraídos da base vetorial utilizados para contextualizar a resposta do modelo:
                            </p>
                            <div className="context-chunks-grid">
                                {context.map((chunk, idx) => (
                                    <div key={idx} className="context-chunk-item">
                                        <div className="chunk-header">
                                            <div className="chunk-title">
                                                <span className="material-symbols-outlined">description</span>
                                                <span>Trecho {idx + 1}</span>
                                            </div>
                                            <button 
                                                type="button"
                                                className={`chunk-copy-btn ${copiedSection === `chunk-${idx}` ? 'copied' : ''}`}
                                                onClick={() => handleCopy(chunk, `chunk-${idx}`)}
                                                title="Copiar este trecho"
                                            >
                                                <span className="material-symbols-outlined">
                                                    {copiedSection === `chunk-${idx}` ? 'check' : 'content_copy'}
                                                </span>
                                                <span>{copiedSection === `chunk-${idx}` ? 'Copiado!' : 'Copiar'}</span>
                                            </button>
                                        </div>
                                        <div className="chunk-content">
                                            {chunk}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Visualizador de JSON Original para Inspeção Técnica */}
            <div className="rag-raw-json-section">
                <button 
                    type="button"
                    className="btn-toggle-json"
                    onClick={() => setShowRawJson(prev => !prev)}
                >
                    <span className="material-symbols-outlined">code</span>
                    <span>{showRawJson ? 'Ocultar JSON da Resposta' : 'Ver JSON da Resposta (Dados Brutos)'}</span>
                    <span className="material-symbols-outlined chevron-inline">
                        {showRawJson ? 'expand_less' : 'expand_more'}
                    </span>
                </button>

                {showRawJson && (
                    <div className="raw-json-container">
                        <div className="raw-json-toolbar">
                            <span className="raw-json-label">Formato JSON original retornado pelo backend:</span>
                            <button 
                                type="button"
                                className={`chunk-copy-btn ${copiedSection === 'raw-json' ? 'copied' : ''}`}
                                onClick={() => handleCopy(data, 'raw-json')}
                            >
                                <span className="material-symbols-outlined">
                                    {copiedSection === 'raw-json' ? 'check' : 'content_copy'}
                                </span>
                                <span>{copiedSection === 'raw-json' ? 'Copiado!' : 'Copiar JSON'}</span>
                            </button>
                        </div>
                        <pre className="raw-json-code">
                            <code>{JSON.stringify(data, null, 2)}</code>
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RagResponse;
