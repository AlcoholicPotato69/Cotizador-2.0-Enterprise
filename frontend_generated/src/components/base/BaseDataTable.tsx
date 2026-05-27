import React from 'react';
import { cn } from '../../utils';

interface Column<T> {
  header?: string;
  label?: string;
  accessorKey?: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  key?: string;
}

interface Base<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onRowClick?: (item: T) => void;
}

export function BaseDataTable<T>({ data, columns, className, onRowClick }: Base<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-border-base bg-bg-surface", className)}>
      <table className="w-full text-left text-sm text-text-secondary">
        <thead className="bg-bg-surface-hover text-xs uppercase text-text-tertiary border-b border-border-base">
          <tr>
            {columns.map((col, i) => (
              <th key={col.key || i} className="px-6 py-4 font-semibold tracking-wider">
                {col.header || col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-base">
          {data.map((row, i) => (
            <tr 
              key={i} 
              onClick={() => onRowClick?.(row)}
              className={cn(
                "group transition-colors hover:bg-bg-surface-hover/50",
                onRowClick && "cursor-pointer"
              )}
            >
              {columns.map((col, j) => (
                <td key={j} className="px-6 py-4 text-text-primary whitespace-nowrap">
                  {col.cell ? col.cell(row) : (row as any)[col.accessorKey || col.key || '']}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-text-tertiary">
                No hay registros disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
