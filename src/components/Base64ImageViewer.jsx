import React, { useState, useCallback } from 'react';
import './Base64ImageViewer.css';
import { validateBase64Image, getImageFormat } from '../utils/imageUtils';
import ImagePreview from './ImagePreview.jsx';
import FileUpload from './FileUpload.jsx';

const Base64ImageViewer = () => {
  const [base64Input, setBase64Input] = useState('');
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBase64Change = useCallback((value) => {
    setBase64Input(value);
    setError('');
    
    if (!value.trim()) {
      setImageData(null);
      return;
    }

    setLoading(true);
    
    // 使用 setTimeout 避免阻塞 UI
    setTimeout(() => {
      try {
        const validation = validateBase64Image(value);
        
        if (!validation.isValid) {
          setError(validation.error);
          setImageData(null);
        } else {
          const format = getImageFormat(value);
          setImageData({
            src: validation.dataUrl,
            format: format,
            size: value.length
          });
          setError('');
        }
      } catch (err) {
        setError('解析 Base64 数据时发生错误');
        setImageData(null);
      } finally {
        setLoading(false);
      }
    }, 100);
  }, []);

  const handleFileUpload = useCallback((file) => {
    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const base64 = e.target.result;
      setBase64Input(base64);
      handleBase64Change(base64);
    };
    
    reader.onerror = () => {
      setError('读取文件时发生错误');
      setLoading(false);
    };
    
    reader.readAsDataURL(file);
  }, [handleBase64Change]);

  const handleClear = useCallback(() => {
    setBase64Input('');
    setImageData(null);
    setError('');
  }, []);

  const handleCopy = useCallback(() => {
    if (imageData) {
      navigator.clipboard.writeText(base64Input).then(() => {
        alert('Base64 数据已复制到剪贴板');
      }).catch(() => {
        alert('复制失败，请手动选择文本复制');
      });
    }
  }, [base64Input, imageData]);

  return (
    <div className="base64-image-viewer">
      <div className="viewer-section">
        <h2>输入 Base64 数据</h2>
        <div className="input-section">
          <textarea
            className="base64-input"
            placeholder="请粘贴 Base64 编码的图片数据..."
            value={base64Input}
            onChange={(e) => handleBase64Change(e.target.value)}
            rows={6}
          />
          <div className="input-actions">
            <button 
              className="btn btn-secondary" 
              onClick={handleClear}
              disabled={!base64Input}
            >
              清空
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleCopy}
              disabled={!imageData}
            >
              复制
            </button>
          </div>
        </div>
        
        <FileUpload onFileUpload={handleFileUpload} />
        
        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>正在处理...</span>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <strong>错误：</strong>{error}
          </div>
        )}
      </div>

      <div className="preview-section">
        <h2>图片预览</h2>
        {imageData ? (
          <ImagePreview imageData={imageData} />
        ) : (
          <div className="empty-preview">
            <div className="empty-icon">图片</div>
            <p>请输入有效的 Base64 图片数据或上传图片文件</p>
            <small>支持 PNG、JPG、JPEG、SVG 格式</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default Base64ImageViewer;
