// @ts-nocheck
import { useState } from "react";

interface OutlineInputProps {
  onNext: (topic: string, tags: string[]) => void;
}

const OutlineInput = ({ onNext }: OutlineInputProps) => {
  const [topic, setTopic] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleNext = () => {
    if (topic.trim()) {
      onNext(topic, selectedTags);
    }
  };

  return (
    <div className="outline-input__container">
      <h1 className="outline-input__title">AI洞察先机, 发掘热点背后的价值</h1>
      <p className="outline-input__subtitle">
        每日自动追踪全网热点,智能分析潜在商机与危机,一键生成高价值决策PPT
      </p>
      <div className="outline-input__input-container">
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例如:人工智能在教育领域的应用"
          className="outline-input__input"
        />

        <div className="outline-input__box">
          <img
            style={{
              opacity: !topic.trim() ? 0.4 : 1,
              cursor: !topic.trim() ? "not-allowed" : "pointer",
            }}
            onClick={handleNext}
            src={require("../submit.png")}
          />
        </div>
      </div>

      {/* 底部箭头按钮 */}
      {!isPanelOpen && (
        <div 
          className="outline-input__arrow-button"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        >
          <img 
            src={require("../arrow-down 1.png")} 
            alt="arrow" 
            className="arrow-icon"
          />
        </div>
      )}

      {/* 滑动面板 */}
      <div className={`outline-input__slide-panel ${isPanelOpen ? 'open' : ''}`}>
        <div className="slide-panel__header">
          <button 
            className="slide-panel__close-button"
            onClick={() => setIsPanelOpen(false)}
          >
            <img 
              src={require("../arrow-down 1.png")} 
              alt="arrow" 
              className="arrow-icon rotated"
            />
          </button>
        </div>
        <iframe 
          // src="https://fub647skqd.skywork.website/"
          src="https://www.baidu.com"
          className="slide-panel__iframe"
          title="External Content"
        />
      </div>
    </div>
  );
};

export default OutlineInput;
