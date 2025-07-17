// Board.tsx
import React from "react";
import type { Board as BoardType, Player } from "../game/connect4";

interface BoardProps {
  board: BoardType;
  onColumnClick: (col: number) => void;
  winner: Player | "draw";
  algorithm: string;
  difficulty: number | string;
  onAlgorithmChange: (algo: string) => void;
  onDifficultyChange: (depth: number | string) => void;
  rows: number;
  cols: number;
}

export const Board: React.FC<BoardProps> = ({
  board,
  onColumnClick,
  winner,
  algorithm,
  difficulty,
  onAlgorithmChange,
  onDifficultyChange,
  rows,
  cols,
}) => {
  const isGeminiAI = algorithm === "gemini";

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          marginBottom: 16,
        }}
      >
        <label style={{ color: "white", fontWeight: 500 }}>
          Algorithm:
          <select
            value={algorithm}
            onChange={(e) => onAlgorithmChange(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="minimax">Minimax</option>
            <option value="alphabeta">Alpha-Beta</option>
            <option value="expectiminimax">Expectiminimax</option>
            <option value="gemini">Gemini AI</option>
          </select>
        </label>
        <label style={{ color: "white", fontWeight: 500 }}>
          Difficulty:
          <select
            value={difficulty}
            onChange={(e) => {
              if (isGeminiAI) {
                onDifficultyChange(e.target.value);
              } else {
                onDifficultyChange(parseInt(e.target.value));
              }
            }}
            style={{ marginLeft: 8 }}
          >
            {isGeminiAI ? (
              <>
                <option value="easy">Easy</option>
                <option value="hard">Hard</option>
              </>
            ) : (
              <>
                <option value={2}>Easy (2)</option>
                <option value={4}>Medium (4)</option>
                <option value={6}>Hard (6)</option>
              </>
            )}
          </select>
        </label>
      </div>

      <div
        style={{
          background: "#1877c9",
          padding: 16,
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isGeminiAI && (
          <div style={{ marginBottom: 8, textAlign: "center", width: "100%" }}>
            <span style={{ color: "white", fontSize: 14, fontStyle: "italic" }}>
              Playing against Gemini AI ({difficulty} mode)
            </span>
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 40px)`,
            gap: 4,
            marginBottom: 8,
          }}
        >
          {Array.from({ length: cols }).map((_, col) => (
            <button
              key={col}
              onClick={() => onColumnClick(col)}
              disabled={!!winner}
              style={{
                width: 40,
                height: 32,
                fontSize: 16,
                fontWeight: "bold",
                background: "#e3eaf2",
                border: "none",
                borderRadius: 6,
                margin: 0,
                cursor: winner ? "not-allowed" : "pointer",
              }}
              aria-label={`Drop in column ${col + 1}`}
            >
              {col + 1}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 40px)`,
            gap: 4,
          }}
        >
          {board.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <div
                key={rowIdx + "-" + colIdx}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background:
                    cell === 0 ? "#fff" : cell === 1 ? "#f00" : "#ff0",
                  border: "2px solid #1877c9",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
                aria-label={
                  cell === 0 ? "Empty" : cell === 1 ? "Red" : "Yellow"
                }
              >
                {cell === 0 ? "" : "●"}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
