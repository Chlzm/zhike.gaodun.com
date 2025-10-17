import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  apiUrl?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  apiUrl = '/example.md' 
}) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>(apiUrl);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamSpeed, setStreamSpeed] = useState<number>(30); // 每次添加的字符数

  // 流式渲染内容
  const streamContent = (fullContent: string) => {
    setIsStreaming(true);
    setMarkdownContent('');
    
    let currentIndex = 0;
    const totalLength = fullContent.length;
    
    const interval = setInterval(() => {
      if (currentIndex < totalLength) {
        // 每次添加一定数量的字符
        const nextIndex = Math.min(currentIndex + streamSpeed, totalLength);
        setMarkdownContent(fullContent.substring(0, nextIndex));
        currentIndex = nextIndex;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 50); // 每50ms更新一次
  };

  // 获取 markdown 数据
  const fetchMarkdown = async (enableStream: boolean = true) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(customUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.text();
      
      if (enableStream) {
        // 流式渲染
        streamContent(data);
      } else {
        // 直接渲染
        setMarkdownContent(data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取数据失败';
      setError(errorMessage);
      console.error('Error fetching markdown:', err);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时自动获取数据
  useEffect(() => {
    fetchMarkdown();
  }, []);

  // 手动刷新
  const handleRefresh = () => {
    fetchMarkdown(true);
  };

  // 直接加载（无流式效果）
  const handleDirectLoad = () => {
    fetchMarkdown(false);
  };

  // 调整流式速度
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreamSpeed(Number(e.target.value));
  };

  // 处理自定义 URL 输入
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(e.target.value);
  };

  return (
    <div className="markdown-renderer-container">
      <div className="control-panel">
        <h1>Markdown 实时渲染器</h1>
        
        <div className="url-input-group">
          <label htmlFor="api-url">API 地址:</label>
          <input
            id="api-url"
            type="text"
            value={customUrl}
            onChange={handleUrlChange}
            placeholder="请输入 API 地址"
            className="url-input"
          />
          <button 
            onClick={handleRefresh} 
            disabled={loading || isStreaming}
            className="refresh-button"
          >
            {loading ? '加载中...' : isStreaming ? '渲染中...' : '流式渲染'}
          </button>
          <button 
            onClick={handleDirectLoad} 
            disabled={loading || isStreaming}
            className="refresh-button secondary-button"
          >
            直接加载
          </button>
        </div>

        <div className="speed-control-group">
          <label htmlFor="stream-speed">流式速度:</label>
          <input
            id="stream-speed"
            type="range"
            min="5"
            max="100"
            value={streamSpeed}
            onChange={handleSpeedChange}
            className="speed-slider"
            disabled={isStreaming}
          />
          <span className="speed-value">{streamSpeed} 字符/次</span>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ 错误: {error}
          </div>
        )}
      </div>

      <div className={`markdown-content ${isStreaming ? 'streaming' : ''}`}>
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>正在加载 Markdown 内容...</p>
          </div>
        ) : markdownContent ? (
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        ) : (
          <div className="placeholder">
            <p>暂无内容，请输入 API 地址并点击"获取数据"按钮</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownRenderer;
