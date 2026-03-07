import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Background from './components/Background';
import WelcomeScreen from './components/screens/WelcomeScreen';
import VibeScannerScreen from './components/screens/VibeScannerScreen';
import ComplimentScreen from './components/screens/ComplimentScreen';
import MiniGameScreen from './components/screens/MiniGameScreen';
import TrollScreen from './components/screens/TrollScreen';
import FinalScreen from './components/screens/FinalScreen';
import './index.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState(1);

  const nextScreen = () => setCurrentScreen(prev => prev + 1);

  const renderScreen = () => {
    switch (currentScreen) {
      case 1: return <WelcomeScreen onNext={nextScreen} />;
      case 2: return <VibeScannerScreen onNext={nextScreen} />;
      case 3: return <ComplimentScreen onNext={nextScreen} />;
      case 4: return <MiniGameScreen onNext={nextScreen} />;
      case 5: return <TrollScreen onNext={nextScreen} />;
      case 6: return <FinalScreen />;
      default: return <WelcomeScreen onNext={nextScreen} />;
    }
  };

  return (
    <div className="app-container">
      <Background />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{ position: 'absolute', zIndex: 20, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
