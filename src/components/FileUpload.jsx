import React, { useCallback, useState } from 'react';
import './FileUpload.css';

const FileUpload = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onFileUpload(imageFile);
    } else {
      alert('请选择图片文件（PNG、JPG、SVG 等格式）');
    }
  }, [onFileUpload]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        onFileUpload(file);
      } else {
        alert('请选择图片文件（PNG、JPG、SVG 等格式）');
      }
    }
    // 清空 input 值，允许重复选择同一文件
    e.target.value = '';
  }, [onFileUpload]);

  return (
    <div className="file-upload">
      <div className="upload-divider">
        <span>或者</span>
      </div>
      
      <div 
        className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <div className="upload-icon">文件</div>
          <h3>拖拽图片文件到此处</h3>
          <p>或者点击下方按钮选择文件</p>
          <small>支持 PNG、JPG、JPEG、SVG、GIF、WebP 格式</small>
        </div>
        
        <label className="upload-button">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <span className="btn btn-outline">选择图片文件</span>
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
