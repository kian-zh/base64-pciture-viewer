/**
 * 验证 Base64 图片数据
 * @param {string} base64String - Base64 字符串
 * @returns {object} 验证结果
 */
export const validateBase64Image = (base64String) => {
  if (!base64String || typeof base64String !== 'string') {
    return {
      isValid: false,
      error: '请输入有效的 Base64 字符串'
    };
  }

  // 移除空白字符
  const cleanBase64 = base64String.trim();
  
  // 检查是否为空
  if (!cleanBase64) {
    return {
      isValid: false,
      error: 'Base64 字符串不能为空'
    };
  }

  // 检查是否包含 data URL 前缀
  const dataUrlRegex = /^data:image\/(png|jpe?g|gif|svg\+xml|webp|bmp|tiff?);base64,/i;
  let base64Data;
  let dataUrl;

  if (dataUrlRegex.test(cleanBase64)) {
    // 已经包含 data URL 前缀
    dataUrl = cleanBase64;
    base64Data = cleanBase64.split(',')[1];
  } else {
    // 纯 Base64 数据，需要检测格式并添加前缀
    base64Data = cleanBase64;
    
    // 尝试检测图片格式
    const format = detectImageFormat(base64Data);
    if (!format) {
      return {
        isValid: false,
        error: '无法识别图片格式，请确保是有效的图片 Base64 数据'
      };
    }
    
    const mimeType = getMimeType(format);
    dataUrl = `data:${mimeType};base64,${base64Data}`;
  }

  // 验证 Base64 格式
  if (!isValidBase64(base64Data)) {
    return {
      isValid: false,
      error: '无效的 Base64 格式'
    };
  }

  return {
    isValid: true,
    dataUrl: dataUrl,
    base64Data: base64Data
  };
};

/**
 * 检测图片格式
 * @param {string} base64Data - 纯 Base64 数据
 * @returns {string|null} 图片格式
 */
const detectImageFormat = (base64Data) => {
  try {
    // 解码前几个字节来检测文件头
    const binary = atob(base64Data.substring(0, 50));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // PNG: 89 50 4E 47
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
      return 'png';
    }
    
    // JPEG: FF D8 FF
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
      return 'jpg';
    }
    
    // GIF: 47 49 46 38
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
      return 'gif';
    }
    
    // WebP: 52 49 46 46 ... 57 45 42 50
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
      return 'webp';
    }
    
    // SVG: 检查是否包含 SVG 标识
    const text = new TextDecoder().decode(bytes);
    if (text.includes('<svg') || text.includes('<?xml')) {
      return 'svg';
    }
    
  } catch (error) {
    console.warn('检测图片格式时出错:', error);
  }
  
  return null;
};

/**
 * 获取 MIME 类型
 * @param {string} format - 图片格式
 * @returns {string} MIME 类型
 */
const getMimeType = (format) => {
  const mimeMap = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff',
    'tif': 'image/tiff'
  };
  
  return mimeMap[format.toLowerCase()] || 'image/png';
};

/**
 * 从 data URL 或 Base64 字符串中获取图片格式
 * @param {string} input - 输入字符串
 * @returns {string|null} 图片格式
 */
export const getImageFormat = (input) => {
  if (!input) return null;
  
  // 检查是否为 data URL
  const dataUrlMatch = input.match(/^data:image\/([\w+]+);base64,/i);
  if (dataUrlMatch) {
    let format = dataUrlMatch[1].toLowerCase();
    // 处理特殊格式
    if (format === 'svg+xml') {
      format = 'svg';
    } else if (format === 'jpeg') {
      format = 'jpg';
    }
    return format;
  }
  
  // 尝试从纯 Base64 数据检测
  return detectImageFormat(input);
};

/**
 * 验证 Base64 字符串格式
 * @param {string} str - 要验证的字符串
 * @returns {boolean} 是否有效
 */
const isValidBase64 = (str) => {
  try {
    // Base64 字符串只能包含 A-Z, a-z, 0-9, +, /, = 字符
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    
    if (!base64Regex.test(str)) {
      return false;
    }
    
    // 尝试解码
    atob(str);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
