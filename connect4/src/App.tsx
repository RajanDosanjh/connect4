// App.tsx
import { useState, useEffect } from "react";
import { Connect4 } from "./game/connect4";
import { Board } from "./components/Board";
import {
  getBestMoveMinimax,
  getBestMoveAlphaBeta,
  getBestMoveExpectiminimax,
} from "./algorithms/algorithms";
import { geminiAI } from "./game/geminiAI";
import "./App.css";
import { downloadEvaluationCSV } from "./evaluation";

function App() {
  const [boardSize, setBoardSize] = useState({ rows: 6, cols: 7 });
  const [game, setGame] = useState(
    () => new Connect4(boardSize.rows, boardSize.cols)
  );
  const [algorithm, setAlgorithm] = useState("alphabeta");
  const [difficulty, setDifficulty] = useState<number | string>(4);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const getBoardSizeLabel = (rows: number, cols: number): string => {
    if (rows === 5 && cols === 4) return "small";
    if (rows === 6 && cols === 7) return "default";
    if (rows === 7 && cols === 9) return "large";
    return `${rows}x${cols}`;
  };

  const handleBoardSizeChange = (size: string) => {
    const [rows, cols] = size.split("x").map(Number);
    const newGame = new Connect4(rows, cols);
    setBoardSize({ rows, cols });
    setGame(newGame);
  };

  const handleColumnClick = async (col: number) => {
    if (game.winner || game.currentPlayer !== 1 || isAIThinking) return;

    const newGame = game.clone();
    if (newGame.makeMove(col)) {
      setGame(newGame);

      if (newGame.winner) return;

      setIsAIThinking(true);
      setTimeout(async () => {
        const aiGame = newGame.clone();
        if (!aiGame.winner && aiGame.currentPlayer === 2) {
          const { move: aiMove } = await getAIMove(aiGame);
          aiGame.makeMove(aiMove);
          setGame(aiGame);
        }
        setIsAIThinking(false);
      }, 300);
    }
  };

  const handleReset = () => {
    const newGame = new Connect4(boardSize.rows, boardSize.cols);
    setGame(newGame);
  };

  const getAIMove = async (
    state: Connect4
  ): Promise<{ move: number; nodes: number }> => {
    if (algorithm === "gemini") {
      const aiDifficulty = difficulty as "easy" | "hard";
      const move = await geminiAI.getBestMove(state, aiDifficulty);
      return { move, nodes: 0 };
    }

    const numericDifficulty = difficulty as number;
    switch (algorithm) {
      case "minimax": {
        const result = getBestMoveMinimax(state, numericDifficulty);
        return typeof result === "object" ? result : { move: result, nodes: 0 };
      }
      case "alphabeta": {
        const result = getBestMoveAlphaBeta(state, numericDifficulty);
        return typeof result === "object" ? result : { move: result, nodes: 0 };
      }
      case "expectiminimax": {
        const result = getBestMoveExpectiminimax(state, numericDifficulty);
        return typeof result === "object" ? result : { move: result, nodes: 0 };
      }
      default: {
        const result = getBestMoveAlphaBeta(state, numericDifficulty);
        return typeof result === "object" ? result : { move: result, nodes: 0 };
      }
    }
  };

  let status = "";
  if (game.winner === "draw") {
    status = "It's a draw!";
  } else if (game.winner) {
    status = `Player ${game.winner} wins!`;
  } else if (isAIThinking && game.currentPlayer === 2) {
    status = "AI is thinking...";
  } else {
    status = `Player ${game.currentPlayer}'s turn`;
  }

  useEffect(() => {
    if (algorithm === "gemini" && typeof difficulty === "number") {
      setDifficulty("easy");
    } else if (algorithm !== "gemini" && typeof difficulty === "string") {
      setDifficulty(4);
    }
  }, [algorithm]);

  return (
    <div className="App" style={{ textAlign: "center", marginTop: 40 }}>
      <h1>Connect 4</h1>

      <div style={{ marginBottom: 16 }}>
        <label style={{ color: "white", fontWeight: 500 }}>
          Board Size:
          <select
            value={`${boardSize.rows}x${boardSize.cols}`}
            onChange={(e) => handleBoardSizeChange(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="5x4">Small (5x4)</option>
            <option value="6x7">Default (6x7)</option>
            <option value="7x9">Large (7x9)</option>
          </select>
        </label>
      </div>

      <Board
        board={game.board}
        onColumnClick={handleColumnClick}
        winner={game.winner}
        algorithm={algorithm}
        difficulty={difficulty}
        onAlgorithmChange={setAlgorithm}
        onDifficultyChange={setDifficulty}
        rows={boardSize.rows}
        cols={boardSize.cols}
      />

      <div style={{ margin: "16px 0", fontSize: 20 }}>{status}</div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        <button
          onClick={handleReset}
          style={{ padding: "8px 16px", fontSize: 16 }}
        >
          Reset
        </button>
        <button
          onClick={downloadEvaluationCSV}
          style={{ padding: "8px 16px", fontSize: 16 }}
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}

export default App;
