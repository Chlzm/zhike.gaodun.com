// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface OutlineStreamProps {
  topic: string;
  onConfirm: (outline: string) => void;
  onBack: () => void;
}

const OutlineStream = ({ topic, onConfirm, onBack }: OutlineStreamProps) => {
  const [outline, setOutline] = useState(``);
  const [isStreaming, setIsStreaming] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // 真实API流式调用
  useEffect(() => {
    callRealStreamingAPI();
  }, [topic]);


  // 真实API流式调用
  const callRealStreamingAPI = async () => {
    try {
      setIsStreaming(true);
      setOutline('');

      const response = await fetch('https://api.coze.cn/v1/workflow/stream_run', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer pat_Ixb05xOh3D8wmdKr8ehv1PDohbtpmLFD8LJgJI3s5aMb1vGGBxhb77jfDje6QyDg',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflow_id: '7563227177929637903',
          parameters: {
            keyword: topic,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('ReadableStream not supported');
      }

      const decoder = new TextDecoder('utf-8');
      let accumulated = ''; // 累积的 Markdown 内容
      let buffer = '';      // SSE 数据缓冲区
      let lastUpdateTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('Stream complete');
          console.log('Final markdown:', accumulated);
          setIsStreaming(false);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // 按行处理 SSE 数据
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留最后一行（可能不完整）

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.substring(6); // 去掉 "data: " 前缀
              const data = JSON.parse(jsonStr);

              // 提取 content 字段并累积
              if (data.content) {
                accumulated += data.content;
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', line);
            }
          }
        }

        // 限制更新频率，避免过度渲染
        const now = Date.now();
        if (now - lastUpdateTime > 100) {  // 每100ms更新一次界面
          setOutline(accumulated);
          lastUpdateTime = now;
          // 自动滚动到底部
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.scrollTop = contentRef.current.scrollHeight;
            }
          }, 10);
        }
      }

      // 确保最后一次更新
      setOutline(accumulated);
      // 最终滚动到底部
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      }, 10);
    } catch (error) {
      console.error('API调用失败:', error);
      setIsStreaming(false);
      setOutline('生成大纲失败，请重试');
    }
  };


  return (
    <div className="outline-stream">

      <div className="outline-stream__container">
        <div className="outline-stream__header">
          {isStreaming ? '内容生成中...' : '大纲'}
        </div>

        <div className="outline-stream__content" ref={contentRef}>
          <ReactMarkdown>{outline}</ReactMarkdown>
          {isStreaming && (
            <span className="outline-stream__cursor" />
          )}
        </div>

        <div className="outline-stream__actions">

          <div
            onClick={onBack}
            style={{ 
              opacity: isStreaming ? 0.4 : 1,
              pointerEvents: isStreaming ? 'none' : 'auto',
              cursor: isStreaming ? 'default' : 'pointer'
            }}
          >
            返回修改
          </div>
          <div
            style={{ 
              opacity: isStreaming ? 0.4 : 1,
              pointerEvents: isStreaming ? 'none' : 'auto',
              cursor: isStreaming ? 'default' : 'pointer'
            }}
            onClick={() => onConfirm(outline)}
          >
            确认生成幻灯片
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutlineStream;