import React, { useState } from 'react';
import OutlineInput from './components/OutlineInput';
import OutlineStream from './components/OutlineStream';
import SlideShow from './components/SlideShow';
import './app.scss';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [topic, setTopic] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [outline, setOutline] = useState('');

  const handleInputNext = (newTopic: string, newTags: string[]) => {
    setTopic(newTopic);
    setTags(newTags);
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
      {currentStep === 3 && <SlideShow outline={outline} />}
    </div>
  );
}

export default App;
