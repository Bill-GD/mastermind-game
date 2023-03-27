import { useState } from 'react';
import './App.css';

const colorDefault = ['White', 'Black', 'Red', 'Yellow', 'Green', 'Blue'];
let chosenColors = [];
const getPattern = () => {
  chosenColors = [];
  for (let i = 0; i < 4; i++)
    chosenColors.push(colorDefault[Math.trunc(Math.random() * 6)]);
};

const Title = () => {
  return (
    <div className='title'>
      <p> MASTERMIND GAME </p>
    </div>
  );
}


const ColorRows = ({ guessHistory }) => {
  return (
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
}

const Pins = ({ guessHistory }) => {

}

const GameBoard = ({ guessHistory }) => {
  return (
    <div className='gameBoard'>
      <div className='decodingBoard'>
        <ColorRows guessHistory={guessHistory} />
      </div>
      <div className='pinBoard'>
        <Pins guessHistory={guessHistory} />
      </div>
    </div>
  );
}


const Form = ({ guessHistory, setGuessHistory, currentGuess, setCurrentGuess }) => {
  const handleInputForm = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    let array = [];
    for (let i = 1; i < 5; i++) {
      if (formJson[`color${i}`] === '' || !formJson[`color${i}`]) return;
      array = [...array, formJson[`color${i}`]];
    }
    setGuessHistory([...guessHistory, array]);
  }

  const handleInputChange = (value, name) => {
    let index = parseInt(name.charAt(name.length - 1)) - 1;
    let array = [];
    for (let i = 0; i < currentGuess.length; i++) {
      if (i === index) array[i] = value;
      else array[i] = currentGuess[i];
    }
    // console.log(array);
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

const PlayerInput = ({ guessHistory, setGuessHistory, currentGuess, setCurrentGuess }) => {
  return (
    <div className='playerInput'>
      <div className='colorRow'>
        {currentGuess.map((color) => (
          <div className={`colorCircle ${color}`} ></div>
        ))}
      </div>
      <Form guessHistory={guessHistory} setGuessHistory={setGuessHistory} currentGuess={currentGuess} setCurrentGuess={setCurrentGuess} />
    </div>
  );
}

const Board = ({ guessHistory, setGuessHistory, currentGuess, setCurrentGuess }) => {
  return (
    <div className='board'>
      <Title />
      <GameBoard guessHistory={guessHistory} />
      <PlayerInput guessHistory={guessHistory} setGuessHistory={setGuessHistory} currentGuess={currentGuess} setCurrentGuess={setCurrentGuess} />
    </div>
  );
}

let gameOver = true;
let timeStart = 0;

const convertTime = (time) => {
  let timeString = '';
  const hour = Math.round(time / 3.6e6); time -= (3.6e6 * hour);
  const minute = Math.trunc(time / 6e4); time -= (6e4 * minute);
  const second = Math.trunc(time / 1e3);
  timeString += (hour < 10 ? ('0' + hour) : hour) + ':'
    + (minute < 10 ? ('0' + minute) : minute) + ':'
    + (second < 10 ? ('0' + second) : second);
  return timeString;
}

const Game = () => {
  // state of component only change if <setState> function is used
  const [currentGuess, setCurrentGuess] = useState(Array(4).fill(null));
  const [guessHistory, setGuessHistory] = useState([]);

  const buttonRestart_Click = () => {
    getPattern();
    setGuessHistory([]);
    setCurrentGuess(Array(4).fill('White'));
    // gameOver = !gameOver;
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
        {gameOver ?
          (<>
              <p>Game Over</p>
              <button className='buttonRestart' onClick={buttonRestart_Click}>
                New Game
              </button>
            </>)
          : (<></>)
        }
      </div>
      <Board guessHistory={guessHistory} setGuessHistory={setGuessHistory} currentGuess={currentGuess} setCurrentGuess={setCurrentGuess} />
      <div className='timer'>
        {gameOver ?
          (<><p>Time:</p><p id='timeDisplay'>00:00:00</p></>)
          : (<></>)
        }
      </div>
    </div>
  );
}

const App = () => (<div className="App"> <Game /> </div>);
export default App;
