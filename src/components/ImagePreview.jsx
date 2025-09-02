import React, { useState, useRef, useEffect } from 'react';
import './ImagePreview.css';

const ImagePreview = ({ imageData }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fullscreenRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFormatDisplayName = (format) => {
    const formatMap = {
      'png': 'PNG',
      'jpg': 'JPEG',
      'jpeg': 'JPEG',
      'svg': 'SVG',
      'gif': 'GIF',
      'webp': 'WebP'
    };
    return formatMap[format?.toLowerCase()] || format?.toUpperCase() || '未知';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // 检查浏览器是否支持全屏 API
  const isFullscreenSupported = () => {
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled ||
      // 检查元素是否有全屏方法
      (document.documentElement && (
        document.documentElement.requestFullscreen ||
        document.documentElement.webkitRequestFullscreen ||
        document.documentElement.mozRequestFullScreen ||
        document.documentElement.msRequestFullscreen
      ))
    );
  };

  // 进入全屏
  const enterFullscreen = async () => {
    // 先显示模态框
    setIsFullscreen(true);
    
    // 等待下一帧后再尝试全屏，确保模态框已经渲染
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    if (!fullscreenRef.current) return;

    try {
      if (fullscreenRef.current.requestFullscreen) {
        await fullscreenRef.current.requestFullscreen();
      } else if (fullscreenRef.current.webkitRequestFullscreen) {
        await fullscreenRef.current.webkitRequestFullscreen();
      } else if (fullscreenRef.current.mozRequestFullScreen) {
        await fullscreenRef.current.mozRequestFullScreen();
      } else if (fullscreenRef.current.msRequestFullscreen) {
        await fullscreenRef.current.msRequestFullscreen();
      }
    } catch (error) {
      console.warn('无法进入全屏模式:', error);
      // 如果全屏失败，继续显示模态框
    }
  };

  // 退出全屏
  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (error) {
      console.warn('退出全屏时发生错误:', error);
    }
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const closeFullscreen = (e) => {
    if (e.target === e.currentTarget) {
      exitFullscreen();
    }
  };

  // 监听全屏状态变化和键盘事件
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      if (!isCurrentlyFullscreen && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    // 添加各种浏览器的全屏事件监听
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  if (imageError) {
    return (
      <div className="image-preview error">
        <div className="error-content">
          <div className="error-icon">!</div>
          <h3>图片加载失败</h3>
          <p>无法显示此图片，可能是格式不受支持或数据损坏</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="image-preview">
        <div className="image-info">
          <div className="info-row">
            <span className="label">格式：</span>
            <span className="value format-badge">{getFormatDisplayName(imageData.format)}</span>
          </div>
          <div className="info-row">
            <span className="label">大小：</span>
            <span className="value">{formatFileSize(imageData.size)}</span>
          </div>
        </div>

        <div className="image-container">
          <img
            src={imageData.src}
            alt="Base64 图片预览"
            className="preview-image"
            onError={handleImageError}
            onClick={toggleFullscreen}
            loading="lazy"
          />
        </div>

        <div className="image-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => {
              const link = document.createElement('a');
              link.href = imageData.src;
              link.download = `image.${imageData.format}`;
              link.click();
            }}
          >
            下载图片
          </button>
          <button 
            className="btn btn-primary"
            onClick={toggleFullscreen}
            disabled={!isFullscreenSupported()}
            title={isFullscreenSupported() ? (isFullscreen ? '退出全屏' : '全屏查看') : '您的浏览器不支持全屏功能'}
          >
            {isFullscreen ? '退出全屏' : '全屏查看'}
          </button>
        </div>
      </div>

      {isFullscreen && (
        <div 
          className="fullscreen-overlay" 
          onClick={closeFullscreen}
          ref={fullscreenRef}
        >
          <div className="fullscreen-container">
            <button 
              className="close-fullscreen"
              onClick={exitFullscreen}
              title="退出全屏 (ESC)"
            >
              ×
            </button>
            <img
              src={imageData.src}
              alt="全屏图片预览"
              className="fullscreen-image"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="fullscreen-info">
              <span className="fullscreen-format">{getFormatDisplayName(imageData.format)}</span>
              <span className="fullscreen-size">{formatFileSize(imageData.size)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview;
