import { useEffect } from 'react';
import { useGameStore } from './store';
import MainMenu from './components/MainMenu';
import SetupScreen from './components/SetupScreen';
import TycoonUI from './components/TycoonUI';

function App() {
  const { gameStage, tick, simulationSpeed, setSimulationSpeed, togglePause } = useGameStore();

  // Keyboard Hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger hotkeys if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch(e.key) {
        case ' ':
          e.preventDefault();
          togglePause();
          break;
        case '1':
          setSimulationSpeed(1);
          break;
        case '2':
          setSimulationSpeed(2);
          break;
        case '3':
          setSimulationSpeed(3);
          break;
        case '4':
          setSimulationSpeed(4);
          break;
        case '5':
          setSimulationSpeed(5);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePause, setSimulationSpeed]);

  // Game Engine Loop
  useEffect(() => {
    if (gameStage !== 'playing' || simulationSpeed === 0) return;

    // Base tick rate is 1000ms. Speed multipliers reduce this time.
    const tickInterval = 1000 / simulationSpeed;
    
    const interval = setInterval(() => {
      tick();
    }, tickInterval);

    return () => clearInterval(interval);
  }, [gameStage, simulationSpeed, tick]);

  return (
    <>
      {gameStage === 'menu' && <MainMenu />}
      {gameStage === 'newGameSetup' && <SetupScreen />}
      {gameStage === 'playing' && <TycoonUI />}
    </>
  );
}

export default App;
