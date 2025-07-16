// evaluation.ts  

export interface EvaluationEntry {
  algorithm: string;
  depth: number | string;
  nodes: number;
  timeMs: number;
  winner: string;
  player?: number;
  durationMs: number;
}

const evaluationLog: EvaluationEntry[] = [];

export function logEvaluation(entry: EvaluationEntry): void {
  evaluationLog.push(entry);
  console.log(" Evaluation Logged:", entry);
}

export function getEvaluationLog(): EvaluationEntry[] {
  return evaluationLog;
}

export function clearEvaluationLog(): void {
  evaluationLog.length = 0;
}

export function downloadEvaluationCSV(): void {
  if (evaluationLog.length === 0) return;

  const headers = Object.keys(evaluationLog[0]);
  const rows = evaluationLog.map(entry =>
    headers.map(h => (entry as any)[h]).join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'evaluation_log.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

 