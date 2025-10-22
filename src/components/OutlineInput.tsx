// @ts-nocheck
import { useState } from 'react';

interface OutlineInputProps {
  onNext: (topic: string, tags: string[]) => void;
}

const OutlineInput = ({ onNext }: OutlineInputProps) => {
  const [topic, setTopic] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = [
    '技术教程',
    '产品介绍',
    '市场分析',
    '案例研究',
    '行业趋势',
    '最佳实践'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleNext = () => {
    if (topic.trim()) {
      onNext(topic, selectedTags);
    }
  };

  return (
    <div className="outline-input">
      <div className="outline-input__container">
        <h1 className="outline-input__title">
          创建演示大纲
        </h1>
        <p className="outline-input__subtitle">
          输入主题并选择标签,我们将为您生成专业的演示大纲
        </p>

        <div className="outline-input__field">
          <label className="outline-input__label">
            演示主题
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如:人工智能在教育领域的应用"
            className="outline-input__input"
          />
        </div>

        <div className="outline-input__tags">
          <label className="outline-input__label">
            选择标签 (可多选)
          </label>
          <div className="outline-input__tags-container">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`outline-input__tag ${
                  selectedTags.includes(tag) ? 'outline-input__tag--active' : ''
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!topic.trim()}
          className="outline-input__button"
        >
          生成大纲
        </button>
      </div>
    </div>
  );
};

export default OutlineInput;