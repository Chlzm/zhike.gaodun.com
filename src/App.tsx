import { useState } from 'react';
import OutlineInput from './components/OutlineInput';
import OutlineStream from './components/OutlineStream';
import SlideShow from './components/SlideShow';
import './app.scss';

const defaultMarkdown = `# 人工智能在教育领域的应用

---

## 目录

- AI技术概述
- 教育领域的应用场景
- 具体案例分析
- 未来发展趋势
- 挑战与机遇

---

## AI技术概述

### 什么是人工智能？

人工智能(AI)是计算机科学的一个分支，致力于创建能够执行通常需要人类智能的任务的系统。

---

## 教育领域的应用场景

### 个性化学习

- 学习行为数据分析
- 学习效果评估
- 预测学习风险

---

### Coursera的AI课程推荐

- 基于学习历史的课程推荐
- 智能学习路径规划
- 个性化学习计划

---

## 未来发展趋势

1. **2025年**: AI教育工具普及率达到60%
2. **2030年**: 完全个性化的学习系统
3. **2035年**: AI教师成为现实

---

## 挑战与机遇

### 面临的挑战

- **隐私保护**: 学生数据安全
- **技术门槛**: 师资培训需求
- **教育公平**: 数字鸿沟问题
- **伦理考量**: AI决策的透明度

### 发展机遇

- **效率提升**: 减轻教师工作负担
- **质量改善**: 提高教学效果
- **资源优化**: 教育资源合理分配
- **创新驱动**: 推动教育模式变革

---

## 总结

人工智能在教育领域的应用前景广阔，但需要：

1. 重视数据安全和隐私保护
2. 加强师资培训和技术支持
3. 确保教育公平和包容性
4. 建立完善的伦理规范

**让AI成为教育的助力，而非替代**

---

## 谢谢观看！

### 问答环节

欢迎提问和讨论`

function App() {
  const [currentStep, setCurrentStep] = useState(3); // 直接显示SlideShow
  const [topic, setTopic] = useState('');
  // 提供默认的markdown数据
  const [outline, setOutline] = useState('');

  const handleInputNext = (newTopic: string) => {
    setTopic(newTopic);
    setCurrentStep(2);
  };

  const handleStreamConfirm = (generatedOutline: string) => {
    setOutline(generatedOutline);
    setCurrentStep(3);
  };

  const handleStreamBack = () => {
    setCurrentStep(1);
  };

  return (
    <div id='app'>
      {currentStep === 1 && <OutlineInput onNext={handleInputNext} />}
      {currentStep === 2 && (
        <OutlineStream
          topic={topic}
          onConfirm={handleStreamConfirm}
          onBack={handleStreamBack}
        />
      )}
      {currentStep === 3 && <SlideShow outline={outline} onBack={() => setCurrentStep(1)} />}
    </div>
  );
}

export default App;
