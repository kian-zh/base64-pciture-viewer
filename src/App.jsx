import React from 'react';
import './styles/App.css';
import Base64ImageViewer from './components/Base64ImageViewer.jsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Base64 图片预览器</h1>
        <p>支持 PNG、JPG、SVG 格式的 Base64 图片预览</p>
      </header>
      <main className="App-main">
        <Base64ImageViewer />
      </main>
      <footer className="App-footer">
        <p>© 2024 Base64 图片预览器 - 由 React 驱动</p>
      </footer>
    </div>
  );
}

export default App;
