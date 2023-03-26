import { useState } from 'react';

import './App.css';

const colorDefault = ['White', 'Black', 'Red', 'Yellow', 'Green', 'Blue'];
let guessHistory = [];
let chosenColors = [];
const getPattern = () => {
  chosenColors = [];
  for (let i = 0; i < 4; i++)
    chosenColors.push(colorDefault[Math.trunc(Math.random() * 6)]);
};

const Title = () => {
  return (
    <div className='title'>
      <p>
        MASTERMIND GAME
      </p>
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

const GameBoard = ({ guessHistory }) => {
  return (
    <div className='gameBoard'>
      <div className='decodingBoard'>
        <ColorRows guessHistory={guessHistory} />
      </div>
      <div className='pinBoard'>
        Pin Board
      </div>
    </div>
  );
}


const Form = ({ handleSubmit }) => {
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
    guessHistory = [...guessHistory, array];
    handleSubmit(array);
  }

  return (
    <form className='colorInputForm' onSubmit={handleInputForm} method='post' >
      <select name='color1' key={`color-1`} >
        {/* onChange={e => handleInput(e.target.value, e.target.name)} > */}
        {colorDefault.map(e => (<option value={e}>{e}</option>))}
      </select>
      <select name='color2' key={`color-2`} >
        {/* onChange={e => handleInput(e.target.value, e.target.name)} > */}
        {colorDefault.map(e => (<option value={e}>{e}</option>))}
      </select>
      <select name='color3' key={`color-3`} >
        {/* onChange={e => handleInput(e.target.value, e.target.name)} > */}
        {colorDefault.map(e => (<option value={e}>{e}</option>))}
      </select>
      <select name='color4' key={`color-4`} >
        {/* onChange={e => handleInput(e.target.value, e.target.name)} > */}
        {colorDefault.map(e => (<option value={e}>{e}</option>))}
      </select>
      <button className='submit' type='submit'>Submit</button>
    </form >
  )
}

const PlayerInput = ({ handleSubmit }) => {
  return (
    <div className='playerInput'>
      <div className='colorInput'>
        <Form handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}

const Board = ({ guessHistory, handleSubmit }) => {
  return (
    <div className='board'>
      <Title />
      <GameBoard guessHistory={guessHistory} />
      <PlayerInput handleSubmit={handleSubmit} />
    </div>
  );
}

const Game = ({ colorList }) => {
  // state of component only change if <setState> function is used
  const [currentGuess, setCurrentGuess] = useState([]);
  const handleSubmit = (current) => {
    if (guessHistory.length > 10) return;
    setCurrentGuess(current);
    // /\ used here, if change state directly -> doesn't work
    // \/ but when use setState, it 1 state behind
    console.log(currentGuess);
  }
  let gameOver = true;

  const buttonRestart_Click = () => {
    getPattern();
    guessHistory = [];
    setCurrentGuess([]);
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
          :
          (<></>)
        }
      </div>
      <Board guessHistory={guessHistory} handleSubmit={handleSubmit} />
      <div className='timer'>
        {gameOver ?
          (<><p>Time: 00:12:43</p></>)
          :
          (<></>)
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
