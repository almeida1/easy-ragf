// UploadUI.jsx - interface do usuario
import React from 'react';
import './UploadUI.css';

const FileItem = ({ file, onRemove }) => {
    return (
        <div className="file-item">
            <div className="file-info">
                <div className={`file-icon ${file.status === 'error' ? 'red' : 'blue'}`}>
                    <span className="material-symbols-outlined">description</span>
                </div>
                <div className="file-details">
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
            </div>

            <div className="file-actions">
                {file.status === 'uploading' && (
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${file.progress}%` }} />
                    </div>
                )}

                {file.status === 'success' && <span className="material-symbols-outlined" style={{ color: '#40c057' }}>check_circle</span>}
                {file.status === 'error' && <span className="material-symbols-outlined" style={{ color: '#fa5252' }}>error</span>}

                <button onClick={() => onRemove(file.id)} className="btn-remove">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
};

const UploadUI = ({ files, onFileSelect, onUpload, onClear, uploadStatus }) => {
    return (
        <div className="upload-wrapper">
            {/* Header Simples */}
            <header className="upload-header">
                <div className="brand">
                    <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>cloud_upload</span>
                    <h2>DocUploader</h2>
                </div>
            </header>

            <main className="upload-main">
                <div className="container">
                    <div className="title-section">
                        <h3>Upload de Documentos</h3>
                        <p>Selecione arquivos do tipo TXT.</p>
                    </div>

                    <div className="upload-card">
                        {/* Dropzone */}
                        <div className="dropzone-container">
                            <label className="dropzone-label">
                                <input type="file" multiple className="file-input" onChange={onFileSelect} accept=".pdf,.docx,.txt" />
                                <div className="icon-circle">
                                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#adb5bd' }}>upload_file</span>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ margin: 0, fontWeight: '700', fontSize: '1.125rem' }}>Arraste e solte arquivos aqui</p>
                                    <p style={{ margin: '0.25rem 0 0', color: '#adb5bd', fontSize: '0.875rem' }}>Suporta: PDF, DOCX, TXT (Max 10MB)</p>
                                </div>
                                <div className="btn-select">Selecionar Arquivos</div>
                            </label>
                        </div>

                        {/* Listagem */}
                        {files.length > 0 && (
                            <div className="file-list">
                                <div className="list-header">
                                    <h3>Arquivos Selecionados</h3>
                                    <span>{files.length} arquivos</span>
                                </div>
                                <div className="file-items-wrapper">
                                    {files.map(f => <FileItem key={f.id} file={f} onRemove={onClear} />)}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="card-footer">
                            <button onClick={() => onClear()} className="btn-clear">
                                Limpar Lista
                            </button>
                            <button
                                onClick={onUpload}
                                disabled={files.length === 0 || (uploadStatus !== 'done' && files.every(f => f.status === 'success'))}
                                className="btn-upload"
                            >
                                <span>{uploadStatus === 'done' ? 'Novo Upload' : 'Enviar Documentos'}</span>
                                <span className="material-symbols-outlined">{uploadStatus === 'done' ? 'add_circle' : 'send'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Feedback Success */}
                    {uploadStatus === 'done' && (
                        <div className="status-message">
                            <span className="material-symbols-outlined" style={{ color: '#2b8a3e', fontSize: '1.5rem' }}>check_circle</span>
                            <div className="success-text">
                                <h3>Upload realizado com sucesso!</h3>
                                <p>Seus documentos foram enviados para processamento.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UploadUI;