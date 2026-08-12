import { useState } from 'react';

function Square({ value, onSquareClick, isHighlighted }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{backgroundColor : isHighlighted ? 'yellow' : 'white'}}
    >
      {value}
    </button>);
}

function Board({ xIsNext, squares, onPlay }) {
  const winnerSquares = showWinner(squares);

  function handleClick(i) {
    if (squares[i]||winnerSquares) {
      return;
    }

    const nextSquares = squares.slice();
    
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }  
    onPlay(nextSquares);
  }

  let status;
  if (winnerSquares) {
    status = "Winner: " + (squares[winnerSquares[0]]);
  } else if (!squares.includes(null)) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  
  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    for (let square = 0; square < 3; square++) {
      const square_index = row * 3 + square;
      rowSquares.push(<Square 
        value={squares[square_index]}
        onSquareClick={() => handleClick(square_index)}
        isHighlighted={winnerSquares?.includes(square_index)}/>)
    }
    
    boardRows.push(<div className="board-row">{rowSquares}</div>)
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
};

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(false);
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function reverseSort() {
    setIsAscending(!isAscending);
  }

  let sortedHistory;
  if (isAscending) {
    sortedHistory = history.slice().reverse()
  } else {
    sortedHistory = history.slice()
  }
  const moves = sortedHistory.map((squares, index) => {
    let description;
    let move;
    if (isAscending) {
      move = history.length - index - 1
    } else {
      move = index
    }
    if (move === currentMove) {
      description = "You are at move #" + move;
      return (<li>{description}</li>);
    } else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  }

  )

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => reverseSort()}>Sort</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

function showWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}