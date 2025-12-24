import React, { useState } from 'react';
import axios from 'axios'; // Opcional, mas comum. Usarei XHR para progresso nativo se preferir, ou Axios.
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

    const uploadSingleFile = (fileObj) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', fileObj.file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', API_URL, true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    updateFileState(fileObj.id, { progress: percent, status: 'uploading' });
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200 || xhr.status === 201) {
                    updateFileState(fileObj.id, { status: 'success', progress: 100 });
                    resolve();
                } else {
                    updateFileState(fileObj.id, { status: 'error' });
                    reject();
                }
            };

            xhr.onerror = () => {
                updateFileState(fileObj.id, { status: 'error' });
                reject();
            };

            xhr.send(formData);
        });
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