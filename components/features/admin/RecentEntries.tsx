export default function RecentEntries() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        {/* TODO: Add recent activity chart */}
        Recent Activity
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-card-foreground">
            Student A entered
          </span>
          <span className="text-xs text-muted-foreground">2 min ago</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-card-foreground">Student B exited</span>
          <span className="text-xs text-muted-foreground">5 min ago</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-card-foreground">
            Student C entered
          </span>
          <span className="text-xs text-muted-foreground">8 min ago</span>
        </div>
      </div>
    </div>
  );
}
