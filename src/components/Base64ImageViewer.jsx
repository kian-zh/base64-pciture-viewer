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
    <main className="base64-image-viewer" role="main">

      <section className="viewer-section" aria-labelledby="input-heading">
        <h2 id="input-heading">输入 Base64 数据</h2>
        <div className="input-section">
          <label htmlFor="base64-textarea" className="visually-hidden">
            Base64 图片数据输入框
          </label>
          <textarea
            id="base64-textarea"
            className="base64-input"
            placeholder="请粘贴 Base64 编码的图片数据..."
            value={base64Input}
            onChange={(e) => handleBase64Change(e.target.value)}
            rows={6}
            aria-describedby="input-help"
          />
          <div id="input-help" className="input-help">
            <small>支持完整的 data:image/... 格式或纯 Base64 字符串</small>
          </div>
          <div className="input-actions">
            <button 
              className="btn btn-secondary" 
              onClick={handleClear}
              disabled={!base64Input}
              aria-label="清空输入内容"
            >
              清空
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleCopy}
              disabled={!imageData}
              aria-label="复制图片数据"
            >
              复制
            </button>
          </div>
        </div>
        
        <FileUpload onFileUpload={handleFileUpload} />
        
        {loading && (
          <div className="loading" role="status" aria-live="polite">
            <div className="loading-spinner"></div>
            <span>正在处理图片...</span>
          </div>
        )}
        
        {error && (
          <div className="error-message" role="alert" aria-live="assertive">
            <strong>错误：</strong>{error}
          </div>
        )}
      </section>

      <section className="preview-section" aria-labelledby="preview-heading">
        <h2 id="preview-heading">图片预览</h2>
        {imageData ? (
          <ImagePreview imageData={imageData} />
        ) : (
          <div className="empty-preview">
            <div className="empty-icon" aria-hidden="true">🖼️</div>
            <p>请输入有效的 Base64 图片数据或上传图片文件</p>
            <div className="supported-formats">
              <strong>支持格式：</strong>
              <ul>
                <li>PNG - 便携式网络图形</li>
                <li>JPG/JPEG - 联合图像专家组</li>
                <li>SVG - 可缩放矢量图形</li>
              </ul>
            </div>
          </div>
        )}
      </section>

    </main>
  );
};

export default Base64ImageViewer;
