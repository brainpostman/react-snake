import React, {useState, useEffect, useRef} from "react";
import Snake from "./Snake.js";
import "./App.css";

function App() {
  const [errorMessage, setErrorMessage] = useState(false);
  const [gridWidth, setGridWidth] = useState("30");
  const [gridHeight, setGridHeight] = useState("30");
  const [gameStart, setGameStart] = useState(false);
  const [initialSnakeHead, setInitialSnakeHead] = useState(null);
  const [initialSnakePath, setInitialSnakePath] = useState(null);
  const [initialFood, setInitialFood] = useState(null);
  const [initialGrid, setInitialGrid] = useState([[]]);

  const errorRef = useRef(null)

  const handleGameStart = () => {
    const width = Number.parseInt(gridWidth);
    const height = Number.parseInt(gridHeight);
    if (width < 12 || height < 9) {
      setErrorMessage(true);
      errorRef.current = setTimeout(() => setErrorMessage(false), 1000);
      return;
    }
    clearTimeout(errorRef.current);
    const gridArray = [];
    for (let i = 0; i < height + 2; i++) {
      gridArray.push([]);
      for (let j = 0; j < width + 2; j++) {
        if ( i <= 1 || i >= height || j <= 1 || j >= width) {
          gridArray[i].push(3);
        } else {
          gridArray[i].push(0);
        }
      }
    }
    let startObj = setStartingPositions(gridArray);
    setInitialSnakeHead(startObj.initialSnakeHead);
    setInitialSnakePath(startObj.initialSnakePath);
    setInitialFood(startObj.initialFood);
    setInitialGrid(startObj.initialGrid);
    setGameStart(true);
  }

  const handleWidthChange = (event) => {
      setGridWidth(event.target.value);
  }

  const handleHeightChange = (event) => {
      setGridHeight(event.target.value);
  }

  const setStartingPositions = (arr) => {
    let width = arr[0].length;
    let height = arr.length;
    let initialGrid = arr.slice();
    let initialSnakeHead = [Math.floor(Math.round(height / 2) - 2), Math.floor(Math.round(width / 3) - 1)];
    initialGrid[initialSnakeHead[0]][initialSnakeHead[1]] = 1;
    let initialSnakePath = [];
    for (let i = 1; i < 3; i++) {
      let snakePathCell = [initialSnakeHead[0] + i, initialSnakeHead[1]];
      initialSnakePath.push(snakePathCell);
    }
    for (let pathCell of initialSnakePath) {
      initialGrid[pathCell[0]][pathCell[1]] = 1;
    }
    let initialFood = [];
    while (true) {
      let y = 1 + Math.floor((Math.random() * (height - 1)));
      let x = 1 + Math.floor((Math.random() * (width - 1)));
      if (initialGrid[y][x] === 0) {
        initialGrid[y][x] = 2;
        initialFood = [y, x];
      } else {
        continue;
      }
      break;
    }
    return {
      initialSnakeHead,
      initialSnakePath,
      initialFood,
      initialGrid
    };
  }

  return (
    <div className="App">
      {!gameStart ?
        <div className="menu">
          <p>Enter grid size (at least 12*9):</p>
          <p>Width:</p>
          <input type="number" value={gridWidth} onChange={handleWidthChange}/>
          <p>Height:</p>
          <input type="number" value={gridHeight} onChange={handleHeightChange}/>
          <button onClick={handleGameStart}>Continue</button>
          {errorMessage && <p style={ { color: "red" } }>Insufficient grid size!</p>}
        </div> :
        <Snake grid={initialGrid}
               head={initialSnakeHead}
               path={initialSnakePath}
               food={initialFood}
               gridWidth={Number.parseInt(gridWidth) + 2}
               gridHeight={Number.parseInt(gridHeight) + 2}
               gameRestart={setGameStart}/>}
    </div>
  );
}

export default App;
