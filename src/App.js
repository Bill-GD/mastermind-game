import { useState } from 'react';
import './App.css';

const colorDefault = ['White', 'Black', 'Red', 'Yellow', 'Green', 'Blue'];
let chosenColors = [];
const getPattern = () => {
  chosenColors = [];
  for (let i = 0; i < 4; i++)
    chosenColors.push(colorDefault[Math.trunc(Math.random() * 6)]);
};
let timeStart = 0;

const Title = () => (<div className='title'> MASTERMIND GAME </div>);

const ColorRows = ({ guessHistory }) => (
  <div className='colorBoard'>
    {guessHistory.map((colors, move) => (
      <div className='colorRow' key={`row-${move}`}>
        {colors.map((color) => (
          <div className={`colorCircle ${color}`} ></div>
        ))}
      </div>
    ))}
  </div>
);

const Pins = ({ checkColorHistory }) => {
  if (checkColorHistory[0][0] === -1) return;
  return (<>
    {checkColorHistory.map((set) => (
      <div className='pinRow'>
        <div className='correct'>
          <p className='correctText'>Correct</p>
          <p className='correctText'>{set[0]}</p>
        </div>
        <div className='misplaced'>
          <p className='misplacedText'>Misplaced</p>
          <p className='misplacedText'>{set[1]}</p>
        </div>
      </div>
    ))}
  </>
  );
}

const GameBoard = ({ guessHistory, checkColorHistory }) => (
  <div className='gameBoard'>
    <div className='decodingBoard'>
      <ColorRows guessHistory={guessHistory} />
    </div>
    <div className='pinBoard'>
      <Pins checkColorHistory={checkColorHistory} />
    </div>
  </div>
);

const checkOtherColors = (pattern, color, index) => {
  for (let i = 0; i < pattern.length; i++) {
    if (i === index) continue;
    if (color.toLowerCase() === pattern[i].toLowerCase())
      return true;
  }
  return false;
}

const Form = ({ guessHistory, setGuessHistory, currentGuess, setCurrentGuess, checkColorHistory, setCheckColorHistory, gameOver, setGameOver }) => {
  const handleInputForm = (e) => {
    e.preventDefault();
    if (gameOver) return;
    if (guessHistory.length >= 10) {
      alert('You Lose');
      setGameOver(true);
      document.getElementById('timeDisplay').innerHTML = convertTime(Date.now() - timeStart);
      timeStart = 0;
      return;
    }
    if (timeStart === 0) {
      alert('Start a new game first');
      return;
    }
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    let array = [];
    for (let i = 1; i < 5; i++) {
      if (formJson[`color${i}`] === '' || !formJson[`color${i}`]) return;
      array = [...array, formJson[`color${i}`]];
    }
    let correct = 0, misplaced = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === chosenColors[i])
        correct++;
      else if (checkOtherColors(chosenColors, array[i], i))
        misplaced++;
    }

    checkColorHistory[0][0] === -1 ?
      setCheckColorHistory([[correct, misplaced]]) :
      setCheckColorHistory([...checkColorHistory, [correct, misplaced]]);

    setGuessHistory([...guessHistory, array]);
    if (correct === 4) {
      setGameOver(true);
      document.getElementById('timeDisplay').innerHTML = convertTime(Date.now() - timeStart);
      timeStart = 0;
      return;
    }
  }

  const handleInputChange = (value, name) => {
    let index = parseInt(name.charAt(name.length - 1)) - 1;
    let array = [];
    for (let i = 0; i < currentGuess.length; i++) {
      if (i === index) array[i] = value;
      else array[i] = currentGuess[i];
    }
    setCurrentGuess(array);
  }

  const renderSelects = () => {
    let array = [];
    for (let i = 1; i <= 4; i++)
      array.push(
        <select className='colorSelect' name={`color${i}`} key={`color-${i}`} onChange={e => handleInputChange(e.target.value, e.target.name)} >
          <option disabled selected hidden>Color</option>
          {colorDefault.map(e => (<option id={e} value={e}>{e}</option>))}
        </select>
      );
    return array;
  }

  return (
    <form className='colorInputForm' onSubmit={handleInputForm} method='post' >
      {renderSelects()}
      <button className='submit' type='submit'>Submit</button>
    </form >
  );
}

const PlayerInput = ({ guessHistory, setGuessHistory, currentGuess, checkColorHistory, setCurrentGuess, setCheckColorHistory, gameOver, setGameOver }) => (
  <div className='playerInput'>
    <div className='colorRow'>
      {currentGuess.map((color) => (
        <div className={`colorCircle ${color}`} ></div>
      ))}
    </div>
    <Form guessHistory={guessHistory} setGuessHistory={setGuessHistory} currentGuess={currentGuess} setCurrentGuess={setCurrentGuess} checkColorHistory={checkColorHistory} setCheckColorHistory={setCheckColorHistory} gameOver={gameOver} setGameOver={setGameOver} />
  </div>
);

const Board = ({ guessHistory, setGuessHistory, currentGuess, setCurrentGuess, checkColorHistory, setCheckColorHistory, gameOver, setGameOver }) => {
  return (
    <div className='board'>
      <Title />
      <GameBoard guessHistory={guessHistory} checkColorHistory={checkColorHistory} />
      <PlayerInput guessHistory={guessHistory} setGuessHistory={setGuessHistory} currentGuess={currentGuess} setCurrentGuess={setCurrentGuess} checkColorHistory={checkColorHistory} setCheckColorHistory={setCheckColorHistory} gameOver={gameOver} setGameOver={setGameOver} />
    </div>
  );
}

const convertTime = (time) => {
  let timeString = '';
  const hour = Math.round(time / 3.6e6); time -= (3.6e6 * hour);
  const minute = Math.trunc(time / 6e4); time -= (6e4 * minute);
  const second = Math.trunc(time / 1e3); time -= (1e3 * second);
  timeString += (hour < 10 ? ('0' + hour) : hour) + ':'
    + (minute < 10 ? ('0' + minute) : minute) + ':'
    + (second < 10 ? ('0' + second) : second) + '.'
    + time;
  return timeString;
}

const Game = () => {
  // state of component only change if <setState> function is used
  const [currentGuess, setCurrentGuess] = useState(Array(4).fill(null));
  const [guessHistory, setGuessHistory] = useState([]);
  const [checkColorHistory, setCheckColorHistory] = useState([[-1, -1]]);
  const [gameOver, setGameOver] = useState(false);

  const buttonRestart_Click = () => {
    getPattern();
    setGuessHistory([]);
    setCurrentGuess(Array(4).fill(null));
    setCheckColorHistory([[-1, -1]]);
    setGameOver(false);
    const buttonRestart = document.getElementsByClassName('buttonRestart')[0];
    if (buttonRestart.innerHTML === 'New Game' || timeStart === 0)
      timeStart = Date.now();
    else {
      document.getElementById('timeDisplay').innerHTML = convertTime(Date.now() - timeStart);
      timeStart = Date.now();
    }
    buttonRestart.innerHTML = 'Restart';
    for (let element of document.getElementsByClassName('colorSelect'))
      element.value = 'Color';
  };

  return (
    <div className='game'>
      <div className='gameOver'>
        {gameOver ? (<p>Game Over</p>) : (<></>)}
        <button className='buttonRestart' onClick={buttonRestart_Click}>
          New Game
        </button>
      </div>
      <Board guessHistory={guessHistory} setGuessHistory={setGuessHistory} currentGuess={currentGuess} setCurrentGuess={setCurrentGuess} checkColorHistory={checkColorHistory} setCheckColorHistory={setCheckColorHistory} gameOver={gameOver} setGameOver={setGameOver} />
      <div className='timer'>
        <p>Time:</p>
        <p id='timeDisplay'>00:00:00.000</p>
      </div>
    </div>
  );
}

const App = () => (<div className="App"> <Game /> </div>);
export default App;
