// @ts-nocheck
import { useState, useEffect } from 'react';

interface OutlineStreamProps {
  topic: string;
  tags: string[];
  onConfirm: (outline: string) => void;
  onBack: () => void;
}

const OutlineStream = ({ topic, tags, onConfirm, onBack }: OutlineStreamProps) => {
  const [outline, setOutline] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);

  // 模拟流式生成大纲
  useEffect(() => {
    const mockOutline = `# ${topic}

## 第一部分:引言
- 背景介绍
- 问题陈述
- 目标概述

## 第二部分:核心内容
- 关键概念解析
- 实际应用场景
- 技术实现方案

## 第三部分:案例分析
- 成功案例展示
- 经验总结
- 最佳实践

## 第四部分:未来展望
- 发展趋势
- 机遇与挑战
- 行动建议

## 第五部分:总结
- 核心要点回顾
- 关键收获
- Q&A环节`;

    let index = 0;
    const interval = setInterval(() => {
      if (index < mockOutline.length) {
        setOutline(prev => prev + mockOutline[index]);
        index++;
      } else {
        setIsStreaming(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [topic]);

  return (
    <div className="outline-stream">
      <div className="outline-stream__container">
        <div className="outline-stream__header">
          <h1 className="outline-stream__title">
            演示大纲生成中...
          </h1>
          {tags.length > 0 && (
            <div className="outline-stream__tags">
              {tags.map(tag => (
                <span key={tag} className="outline-stream__tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="outline-stream__content">
          {outline}
          {isStreaming && (
            <span className="outline-stream__cursor" />
          )}
        </div>

        <div className="outline-stream__actions">
          <button
            onClick={onBack}
            className="outline-stream__button outline-stream__button--back"
          >
            返回修改
          </button>
          <button
            onClick={() => onConfirm(outline)}
            disabled={isStreaming}
            className="outline-stream__button outline-stream__button--confirm"
          >
            {isStreaming ? '生成中...' : '确认并生成幻灯片'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutlineStream;