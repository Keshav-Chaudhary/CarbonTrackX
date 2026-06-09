export function EmptyLogState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-fg-muted">
      <p>No activities recorded yet.</p>
      <p className="text-sm">Log an activity to see your history.</p>
    </div>
  );
}
