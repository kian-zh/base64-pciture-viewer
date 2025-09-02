# Base64 图片预览器

一个现代化的 Base64 图片预览工具，支持 PNG、JPG、SVG 等多种图片格式。

## 功能特性

- **多格式支持**：支持 PNG、JPG、JPEG、SVG、GIF、WebP 等主流图片格式
- **Base64 输入**：支持直接粘贴 Base64 编码的图片数据
- **文件上传**：支持拖拽或选择本地图片文件
- **实时预览**：即时显示图片预览和详细信息
- **响应式设计**：完美适配桌面和移动设备
- **现代界面**：美观的渐变背景和毛玻璃效果
- **下载功能**：支持将图片下载到本地
- **复制功能**：一键复制 Base64 数据到剪贴板
- **真正全屏**：使用浏览器全屏 API 实现真正的全屏查看
- **智能检测**：自动检测图片格式和文件大小

## 在线体验

访问：[https://your-username.github.io/base64-picture-viewer](https://your-username.github.io/base64-picture-viewer)

## 技术栈

- **React 18** - 现代化的前端框架
- **HTML5 File API** - 文件处理
- **CSS3** - 现代样式和动画
- **GitHub Actions** - 自动化部署
- **GitHub Pages** - 静态网站托管

## 本地开发

### 环境要求

- Node.js 16.0+
- npm 7.0+

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
# 启动开发服务器（不自动打开浏览器）
npm start

# 启动开发服务器并自动打开浏览器
npm run start:open
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。手动打开浏览器访问该地址即可。

### 构建生产版本

```bash
npm run build
```

## 部署到 GitHub Pages

1. **配置 package.json**：
   ```json
   {
     "homepage": "https://your-username.github.io/base64-picture-viewer"
   }
   ```

2. **推送代码到 GitHub**：
   ```bash
   git add .
   git commit -m "初始提交"
   git push origin main
   ```

3. **启用 GitHub Pages**：
   - 进入仓库的 Settings 页面
   - 滚动到 Pages 部分
   - 在 Source 下选择 "GitHub Actions"

4. **自动部署**：
   - 每次推送到 main 分支都会自动触发部署
   - 查看 Actions 页面了解部署状态

## 使用方法

### 方法一：粘贴 Base64 数据

1. 将 Base64 编码的图片数据粘贴到输入框中
2. 系统会自动检测格式并显示预览
3. 支持带 `data:image/` 前缀和纯 Base64 数据

### 方法二：上传图片文件

1. 点击"选择图片文件"按钮或拖拽文件到上传区域
2. 系统会自动将图片转换为 Base64 格式
3. 同时显示预览和 Base64 数据

### 功能操作

- **复制 Base64**：点击"复制"按钮将数据复制到剪贴板
- **下载图片**：点击"下载图片"保存到本地
- **真正全屏**：点击"全屏查看"按钮进入浏览器全屏模式，按 ESC 或点击关闭按钮退出
- **清空数据**：点击"清空"按钮重置所有内容

## 支持的格式

| 格式 | 扩展名 | 支持状态 |
|------|--------|----------|
| PNG | .png | 完全支持 |
| JPEG | .jpg, .jpeg | 完全支持 |
| SVG | .svg | 完全支持 |
| GIF | .gif | 完全支持 |
| WebP | .webp | 完全支持 |
| BMP | .bmp | 基础支持 |

## 自定义配置

### 修改主题色

编辑 `src/styles/index.css`：

```css
body {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### 修改应用标题

编辑 `public/index.html`：

```html
<title>您的应用标题</title>
```

## 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 创建 Pull Request

## 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 致谢

- React 团队提供的出色框架
- GitHub Pages 提供的免费托管服务
- 开源社区的支持和贡献

## 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/your-username/base64-picture-viewer/issues)
- 发送邮件至：your-email@example.com

---

如果这个项目对您有帮助，请给我们一个星标！