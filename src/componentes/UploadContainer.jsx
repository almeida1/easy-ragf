import React, { useState } from 'react';

import UploadUI from './UploadUI';

const API_URL = "http://localhost:8080/documents/upload";

const UploadContainer = () => {
    const [files, setFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, done

    const handleFileSelect = (e) => {
        const selected = Array.from(e.target.files).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            name: file.name,
            size: file.size,
            progress: 0,
            status: 'pending' // pending, uploading, success, error
        }));
        setFiles(prev => [...prev, ...selected]);
        setUploadStatus('idle');
    };

    const uploadSingleFile = async (fileObj) => {
        const formData = new FormData();
        formData.append('file', fileObj.file);

        updateFileState(fileObj.id, { status: 'uploading', progress: 0 });

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                updateFileState(fileObj.id, { status: 'success', progress: 100 });
            } else {
                updateFileState(fileObj.id, { status: 'error' });
                throw new Error('Upload failed');
            }
        } catch (error) {
            updateFileState(fileObj.id, { status: 'error' });
            throw error;
        }
    };

    const updateFileState = (id, updates) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const handleUpload = async () => {
        if (uploadStatus === 'done') {
            setFiles([]);
            setUploadStatus('idle');
            return;
        }

        setUploadStatus('uploading');
        const pendingFiles = files.filter(f => f.status !== 'success');

        try {
            await Promise.all(pendingFiles.map(f => uploadSingleFile(f)));
            setUploadStatus('done');
        } catch (error) {
            console.error("Erro no upload de alguns arquivos");
            setUploadStatus('idle');
        }
    };

    const handleClear = (id) => {
        if (id) {
            setFiles(prev => prev.filter(f => f.id !== id));
        } else {
            setFiles([]);
            setUploadStatus('idle');
        }
    };

    return (
        <UploadUI
            files={files}
            onFileSelect={handleFileSelect}
            onUpload={handleUpload}
            onClear={handleClear}
            uploadStatus={uploadStatus}
        />
    );
};

export default UploadContainer;