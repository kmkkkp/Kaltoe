import React, { useEffect } from 'react';
import StarConstellation from './StarConstellation';
import SpaceBackground from './SpaceBackground';
import './styles.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <SpaceBackground />
      <div className="splash-content">
        <h1 className="app-title">주식 별자리 챌린지</h1>
        <p className="app-subtitle">당신의 성공적인 투자 여정을 함께 빛내드릴게요</p>
        <StarConstellation />
      </div>
    </div>
  );
};

export default SplashScreen;