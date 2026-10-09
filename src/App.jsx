import { useState } from "react";
import "./App.css";

function Square({ value, onSquareClick, winCheck }) {
  return (
    <button
      className={winCheck ? "square winning-square" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
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

  const winner = calculateWinner(squares);

  let fullCheck = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      fullCheck = false;
    }
  }

  let status;
  if (winner) {
    status = "Winner: " + squares[winner[0]];
  } else if (fullCheck) {
    status = "Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const board = [];

  for (let row = 0; row < 3; row++) {
    const boardRow = [];
    for (let col = 0; col < 3; col++) {
      const squareNumber = row * 3 + col;

      let winCheck = false;

      if (winner) {
        if (
          winner[0] === squareNumber ||
          winner[1] === squareNumber ||
          winner[2] === squareNumber
        ) {
          winCheck = true;
        }
      }

      boardRow.push(
        <Square
          key={squareNumber}
          value={squares[squareNumber]}
          onSquareClick={() => handleClick(squareNumber)}
          winCheck={winCheck}
        />,
      );
    }

    board.push(
      <div className="board-row" key={row}>
        {boardRow}
      </div>,
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }

  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const [ascending, setAscending] = useState(true);
  function toggleSort() {
    setAscending(!ascending);
  }

  const moves = history.map((squares, move) => {
    let location = "";

    if (move > 0) {
      const previousSquares = history[move - 1];

      let index = 0;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] !== previousSquares[i]) {
          index = i;
        }
      }

      let row;

      if (index < 3) {
        row = 1;
      } else if (index < 6) {
        row = 2;
      } else {
        row = 3;
      }

      const col = (index % 3) + 1;
      location = " (" + row + ", " + col + ")";
    }

    let description;

    if (move === currentMove) {
      description = "You are at move #" + move + location;

      return <li key={move}>{description}</li>;
    }

    if (move > 0) {
      description = "Go to move #" + move + location;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const orderHold = [];

  if (ascending) {
    for (let i = 0; i < moves.length; i++) {
      orderHold.push(moves[i]);
    }
  } else {
    for (let i = moves.length - 1; i >= 0; i--) {
      orderHold.push(moves[i]);
    }
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className="game-info">
        <button className="sort-button" onClick={toggleSort}>
          {ascending ? "Sort descending" : "Sort ascending"}
        </button>

        <ol>{orderHold}</ol>
      </div>
    </div>
  );
}
