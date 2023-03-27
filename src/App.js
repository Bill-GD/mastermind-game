import { useState } from 'react';

import './App.css';

const colorDefault = ['White', 'Black', 'Red', 'Yellow', 'Green', 'Blue'];
// let guessHistory = [];
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
      if (formJson[`color${i}`] === '') return;
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

  return (
    <form className='colorInputForm' onSubmit={handleInputForm} method='post' >
      <select className='colorSelect' name='color1' key={`color-1`} onChange={e => handleInputChange(e.target.value, e.target.name)} >
        {colorDefault.map(e => (<option value={e}>{e}</option>))}
      </select>
      <select className='colorSelect' name='color2' key={`color-2`} onChange={e => handleInputChange(e.target.value, e.target.name)} >
        {colorDefault.map(e => (<option value={e}>{e}</option>))}
      </select>
      <select className='colorSelect' name='color3' key={`color-3`} onChange={e => handleInputChange(e.target.value, e.target.name)} >
        {colorDefault.map(e => (<option value={e}>{e}</option>))}
      </select>
      <select className='colorSelect' name='color4' key={`color-4`} onChange={e => handleInputChange(e.target.value, e.target.name)} >
        {colorDefault.map(e => (<option value={e}>{e}</option>))}
      </select>
      <button className='submit' type='submit'>Submit</button>
    </form >
  )
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

const Game = ({ colorList }) => {
  // state of component only change if <setState> function is used
  const [currentGuess, setCurrentGuess] = useState(Array(4).fill('White'));
  const [guessHistory, setGuessHistory] = useState([]);

  const buttonRestart_Click = () => {
    getPattern();
    setGuessHistory([]);
    setCurrentGuess(Array(4).fill('White'));
    // gameOver = !gameOver;
    for (let element of document.getElementsByClassName('colorSelect'))
      element.value = 'White';
  };

  return (
    <div className='game'>
      <div className='gameOver'>
        {gameOver ?
          (
            <>
              <p>Game Over</p>
              <button className='buttonRestart' onClick={buttonRestart_Click}>
                Restart
              </button>
            </>)
          : (<></>)
        }
      </div>
      <Board guessHistory={guessHistory} setGuessHistory={setGuessHistory} currentGuess={currentGuess} setCurrentGuess={setCurrentGuess} />
      <div className='timer'>
        {gameOver ?
          (<><p>Time: 00:12:43</p></>)
          : (<></>)
        }
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}
