// @ts-nocheck
import { useState, useEffect } from "react";
import SalesPage from './SalesPage';


interface OutlineInputProps {
  onNext: (topic: string, tags: string[]) => void;
}

const OutlineInput = ({ onNext }: OutlineInputProps) => {
  const [topic, setTopic] = useState("职业综合能力提升");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleNext = () => {
    if (topic.trim()) {
      onNext(topic, selectedTags);
    }
  };

  // 添加Enter键监听
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [topic, selectedTags]);

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
          placeholder="请输入"
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

      <SalesPage />
    </div>
  );
};

export default OutlineInput;
