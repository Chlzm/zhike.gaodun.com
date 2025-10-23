// @ts-nocheck
import { useState } from "react";

interface OutlineInputProps {
  onNext: (topic: string, tags: string[]) => void;
}

const OutlineInput = ({ onNext }: OutlineInputProps) => {
  const [topic, setTopic] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleNext = () => {
    if (topic.trim()) {
      onNext(topic, selectedTags);
    }
  };

  return (
    <div className="outline-input__container">
      <h1 className="outline-input__title">创建演示大纲</h1>
      <p className="outline-input__subtitle">
        输入主题并选择标签,我们将为您生成专业的演示大纲
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
    </div>
  );
};

export default OutlineInput;
