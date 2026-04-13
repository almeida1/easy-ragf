import React, { useState } from 'react';
import './App.css'
import UploadContainer from './componentes/UploadContainer'
import ChatContainer from './componentes/ChatContainer'

function App() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="app-container">
      <nav className="app-nav">
        <div className="nav-brand">
          <span className="material-symbols-outlined">dataset</span>
          <h1>SIGVS - Assistente de Consulta</h1>
        </div>
        <div className="nav-links">
          <button
            className={`nav-item ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <span className="material-symbols-outlined">cloud_upload</span>
            Upload
          </button>
          <button
            className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <span className="material-symbols-outlined">forum</span>
            Chat
          </button>
        </div>
      </nav>

      <main className="content-area">
        {activeTab === 'upload' ? (
          <UploadContainer />
        ) : (
          <ChatContainer />
        )}
      </main>
    </div>
  )
}

export default App
