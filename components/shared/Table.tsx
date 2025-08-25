import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table as BaseTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDateReadable, formatTimestamp } from "@/lib/utils/format";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  onRowClick?: (row: T, index: number) => void;
  onActionClick?: (row: T, index: number) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Table<T extends Record<string, any>>({
  data,
  onRowClick,
  globalFilter = "",
  onGlobalFilterChange,
  onActionClick,
}: DataTableProps<T>) {
  const columns = useMemo<ColumnDef<T>[]>(() => {
    if (data.length === 0) return [];

    return Object.keys(data[0])
      .filter(
        (key) => key.toLowerCase() !== "id" && key.toLowerCase() !== "user_id"
      ) // Hide id and user_id columns
      .map((key) => ({
        accessorKey: key,
        header: key
          .replace(/([A-Z])/g, " $1")
          .replace(/created_at/i, "Created")
          .replace(/updated_at/i, "Updated")
          .trim(),
        cell: ({ getValue }) => {
          const value = getValue();

          // Special styling for action column
          if (key.toLowerCase() === "action") {
            const action = String(value ?? "");
            if (action.toLowerCase() === "entry") {
              return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Entry
                </span>
              );
            } else if (action.toLowerCase() === "exit") {
              return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Exit
                </span>
              );
            }
            return action;
          }

          // Format date fields with specific format for created_at
          if (key.includes("created_at")) {
            return value ? formatTimestamp(String(value)) : "";
          }
          // Format other date fields
          if (key.includes("updated_at") || key.includes("date")) {
            return value ? formatDateReadable(String(value)) : "";
          }
          return String(value ?? "");
        },
      }));
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange,
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <BaseTable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="capitalize cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getIsSorted() && (
                        <span className="text-xs">
                          {header.column.getIsSorted() === "desc" ? "↓" : "↑"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                  }
                  onClick={() => onRowClick?.(row.original, row.index)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {onActionClick && (
                    <TableCell key={"action"}>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onActionClick?.(row.original, row.index);
                          // You can keep the console log if needed
                          // console.log("Action clicked");
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </BaseTable>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} of{" "}
          {table.getPreFilteredRowModel().rows.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="flex items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
