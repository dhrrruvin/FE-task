import { useState, useEffect } from "react";
import "./styles.css";

const createGrid = (n) => {
  const grid = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      row.push(0);
    }
    grid.push(row);
  }
  return grid;
};

const findShortestPath = (grid, startObj, endObj) => {
  const visitedNodes = createGrid(GRID_SIZE);
  const queue = [];

  queue.push({ row: startObj.x, col: startObj.y, dis: 0 });
  visitedNodes[startObj.x][startObj.y] = 1;

  while (queue.length) {
    const coordinates = queue.shift();
    const x = coordinates.row,
      y = coordinates.col,
      distance = coordinates.dis;
    if (x === endObj.x && y === endObj.y) {
      return distance;
    }
    // move to up
    if (y > 0 && visitedNodes[x][y - 1] !== 1) {
      queue.push({ row: x, col: y - 1, dis: distance + 1 });
      visitedNodes[x][y - 1] = 1;
    }
    // move to down
    if (y < grid.length && visitedNodes[x][y + 1] !== 1) {
      queue.push({ row: x, col: y + 1, dis: distance + 1 });
      visitedNodes[x][y + 1] = 1;
    }
    // move to left
    if (x > 0 && visitedNodes[x - 1][y] !== 1) {
      queue.push({ row: x - 1, col: y, dis: distance + 1 });
      visitedNodes[x - 1][y] = 1;
    }
    // move to right
    if (x < grid[0].length - 1 && visitedNodes[x + 1][y] !== 1) {
      queue.push({ row: x + 1, col: y, dis: distance + 1 });
      visitedNodes[x + 1][y] = 1;
    }
  }

  // return -1 if not found
  return -1;
};

const GRID_SIZE = 5
export default function App() {
  const [grid, setGrid] = useState(createGrid(GRID_SIZE));
  const [selectedSourceAndDestination, setSelectedSourceAndDestination] =
    useState({ source: null, destination: null });

  const [shortestPath, setShortestPath] = useState(null);

  useEffect(() => {
    if (
      selectedSourceAndDestination.source &&
      selectedSourceAndDestination.destination
    ) {
      const startObj = {
        x: selectedSourceAndDestination.source.row,
        y: selectedSourceAndDestination.source.col,
      };
      const endObj = {
        x: selectedSourceAndDestination.destination.row,
        y: selectedSourceAndDestination.destination.col,
      };
      setShortestPath(findShortestPath(grid, startObj, endObj));
    }
  }, [selectedSourceAndDestination, grid]);

  const handleCellClick = (i, j) => {
    // if source and destination already selected then don't do anything
    if (
      selectedSourceAndDestination.source &&
      selectedSourceAndDestination.destination
    ) {
      return;
    }
    if (!selectedSourceAndDestination.source) {
      const selectedObj = {};
      const newGrid = grid.map((row, rowIndex) =>
        row.map((col, colIndex) => {
          // if cell is selected then don't do anything
          // if source is not selected then select source first
          // if source is selected then select destination
          if (rowIndex === i && colIndex === j) {
            setSelectedSourceAndDestination((prev) => ({
              ...prev,
              source: {
                row: rowIndex,
                col: colIndex,
              },
            }));
            return "S";
          } else {
            return col;
          }
        })
      );
      setGrid(newGrid);
      return;
    }
    if (!selectedSourceAndDestination.destination) {
      const selectedObj = {};
      const newGrid = grid.map((row, rowIndex) =>
        row.map((col, colIndex) => {
          // if cell is selected then don't do anything
          // if source is not selected then select source first
          // if source is selected then select destination
          if (rowIndex === i && colIndex === j) {
            setSelectedSourceAndDestination((prev) => ({
              ...prev,
              destination: {
                row: rowIndex,
                col: colIndex,
              },
            }));
            return "D";
          } else {
            return col;
          }
        })
      );
      setGrid(newGrid);
      return;
    }
  };

  const handleResetClick = () => {
    setGrid(createGrid(GRID_SIZE));
    setSelectedSourceAndDestination({ source: null, target: null });
  };

  return (
    <div className="App">
      {grid.map((row, i) => (
        <div style={{ display: "flex" }} key={i}>
          {row.map((box, j) => (
            <div
              onClick={() => handleCellClick(i, j)}
              key={`${i}-${j}`}
              style={{
                height: "50px",
                width: "50px",
                border: "1px solid black",
                background:
                  box === "S" ? "#B82132" : box === "D" ? "#A4B465" : "white",
                color: box === "S" || box === "D" ? "white" : "black",
              }}
            >
              {box}
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleResetClick}>Reset</button>
      {shortestPath ? <p>shortest path is {shortestPath}</p> : ""}
    </div>
  );
}