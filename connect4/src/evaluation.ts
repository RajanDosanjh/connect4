// evaluation.ts

export interface EvaluationEntry {
  algorithm: string;
  depth: number | string;
  nodes: number;
  timeMs: number;
  durationMs: number;
  winner: string;
  boardSize: string;
}

const evaluationLog: EvaluationEntry[] = [];

export function logEvaluation(entry: EvaluationEntry): void {
  evaluationLog.push(entry);
  console.log("Evaluation Logged:", entry);
}

export function getEvaluationLog(): EvaluationEntry[] {
  return evaluationLog;
}

export function clearEvaluationLog(): void {
  evaluationLog.length = 0;
}

export function downloadEvaluationCSV(): void {
  if (evaluationLog.length === 0) return;

  const headers = Array.from(
    new Set(evaluationLog.flatMap(entry => Object.keys(entry)))
  );

  const rows = evaluationLog.map(entry =>
    headers.map(h => (entry as any)[h] ?? '').join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'evaluation_log.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function determineBoardSize(rows: number, cols: number): string {
  if (rows <= 4 || cols <= 4) return "small";
  if (rows >= 8 || cols >= 8) return "large";
  return "default";
}