import { tasks, taskStatuses } from "@/app/schema";
import { ClassValue, clsx } from "clsx"
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { twMerge } from 'tailwind-merge';

export const BACKLOGID = 'backlogid';
export const BACKLOGNAME = 'Backlog';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getContrastColor(hexColor: string) {
  if (!hexColor) return "#000"; // fallback

  // Remove # if present
  const c = hexColor.startsWith("#") ? hexColor.substring(1) : hexColor;

  // Convert 3-digit hex to 6-digit
  const hex = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance (0 = dark, 255 = light)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

  return luminance > 186 ? "#000000" : "#ffffff"; // dark text for light bg, white text for dark bg
}

// Create default statuses for that board
export const defaultStatuses: Array<InferInsertModel<typeof taskStatuses>> = [
  {
    name: "To Do",
    boardId: '',
    color: "#3B82F6", // blue-500
    position: 1,
  },
  {
    name: "In Progress",
    boardId: '',
    color: "#F59E0B", // amber-500
    position: 2,
  },
  {
    name: "Done",
    boardId: '',
    color: "#10B981", // emerald-500
    position: 3,
  },
];

export interface DraggableData {
  type: "Status" | "Task",
  status: InferSelectModel<typeof taskStatuses> | null,
  task: InferSelectModel<typeof tasks> | null,
}


// src/db/helpers.ts
import { sql } from "drizzle-orm"
import { PgUpdateSetSource, PgTable } from "drizzle-orm/pg-core"
import { getTableColumns } from "drizzle-orm"
import { getTableConfig } from "drizzle-orm/pg-core"

export function conflictUpdateSetAllColumns<
  T extends PgTable,
  E extends (keyof T["$inferInsert"])[],
>(table: T, except?: E): PgUpdateSetSource<T> {
  const columns = getTableColumns(table)
  const config = getTableConfig(table)
  const { name: tableName } = config
  const conflictUpdateSet = Object.entries(columns).reduce(
    (acc, [columnName, columnInfo]) => {
      if (except && except.includes(columnName as E[number])) {
        return acc
      }
      if (!columnInfo.default) {
        // @ts-ignore
        acc[columnName] = sql.raw(
          `COALESCE("excluded"."${columnInfo.name}", "${tableName}"."${columnInfo.name}")`,
        )
      }
      return acc
    },
    {},
  ) as PgUpdateSetSource<T>
  return conflictUpdateSet
}
