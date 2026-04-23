/**
 * Downloads prediction history as CSV (opens in Excel / Sheets).
 */
export function downloadPredictionsCsv(rows, filename = 'studentai-predictions') {
  if (!rows?.length) return;

  const headers = [
    'Date (ISO)',
    'Attendance %',
    'Marks',
    'Study hours',
    'Previous performance %',
    'Result',
    'Pass probability %',
  ];

  const escape = (val) => {
    const s = val === undefined || val === null ? '' : String(val);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [
    headers.join(','),
    ...rows.map((p) =>
      [
        new Date(p.createdAt).toISOString(),
        p.attendance,
        p.marks,
        p.studyHours,
        p.previousPerformance,
        p.result,
        p.probability,
      ]
        .map(escape)
        .join(','),
    ),
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
