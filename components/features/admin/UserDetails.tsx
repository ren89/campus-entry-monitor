import { Table } from "@/components/shared";
import { EntryRecordService } from "@/lib/services";
import { EntryRecord, User } from "@/lib/types";
import { useEffect, useState } from "react";

export function UserDetails({ user }: { user?: Partial<User> }) {
  const [entryLogs, setEntryLogs] = useState<Partial<EntryRecord>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log("UserDetails entryLogs:", entryLogs);
  useEffect(() => {
    if (!user?.id) {
      setEntryLogs([]);
      return;
    }
    setLoading(true);
    setError(null);
    EntryRecordService.getById(user.id)
      .then(setEntryLogs)
      .catch(() => setError("Failed to load entry logs."))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div>
      <h2>
        {user?.firstName} {user?.lastName}
      </h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Email:</strong> {user?.email || "N/A"}
      </div>
      {loading && <div>Loading entry logs...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading &&
        !error &&
        (entryLogs.length > 0 ? (
          <Table
            data={entryLogs.map((log) => ({
              created_at: log.created_at,
              action: log.action,
              location: log.location,
            }))}
          />
        ) : (
          <div>No entry logs found for this user.</div>
        ))}
    </div>
  );
}
