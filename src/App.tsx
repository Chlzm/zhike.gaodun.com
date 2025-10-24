import { useState } from 'react';
import OutlineInput from './components/OutlineInput';
import OutlineStream from './components/OutlineStream';
import SlideShow from './components/SlideShow';
import './app.scss';


function App() {
  const [currentStep, setCurrentStep] = useState(1); // 设置为4来直接显示销售页面
  const [topic, setTopic] = useState('');
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
      {/* {currentStep === 2 && (
        <OutlineStream
          topic={topic}
          onConfirm={handleStreamConfirm}
          onBack={handleStreamBack}
        />
      )} */}
      <div style={{ height: '100vh', display: currentStep === 2 ? 'flex' : 'none', justifyContent: 'center', alignItems:'center' }}>
         <OutlineStream
          topic={topic}
          onConfirm={handleStreamConfirm}
          onBack={handleStreamBack}
        />
      </div>
      <div style={{ display: currentStep === 3 ? 'flex' : 'none' }}>
        <SlideShow currentStep={currentStep} outline={outline} onBack={() => setCurrentStep(2)} />
      </div>
      {/* {currentStep === 3 && <SlideShow outline={outline} onBack={() => window.location.reload()} />} */}
      {/* {currentStep === 3 && <SlideShow key={Math.random()} outline={outline} onBack={() => setCurrentStep(2)} />} */}
    </div>
  );
}

export default App;
