'use client';

import { Edit2, Trash2, Plus, GripVertical } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T, index: number) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T, index: number) => void;
  onDelete?: (item: T, index: number) => void;
  onAdd?: () => void;
  addLabel?: string;
  emptyMessage?: string;
  showIndex?: boolean;
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  addLabel = 'Ajouter',
  emptyMessage = 'Aucune donnée',
  showIndex = false,
}: DataTableProps<T>) {
  const getValue = (item: T, key: string): unknown => {
    const keys = key.split('.');
    let value: unknown = item;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[k];
      } else {
        return undefined;
      }
    }
    return value;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header with Add button */}
      {onAdd && (
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span className="text-sm text-gray-500">
            {data.length} élément{data.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {addLabel}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {showIndex && (
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 w-12">
                  #
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500 w-24">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showIndex ? 1 : 0) + (onEdit || onDelete ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {showIndex && (
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-300" />
                        {index + 1}
                      </div>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-4 py-3 text-sm text-gray-700"
                    >
                      {column.render
                        ? column.render(item, index)
                        : String(getValue(item, String(column.key)) ?? '-')}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item, index)}
                            className="rounded p-1 text-blue-600 hover:bg-blue-50"
                            title="Modifier"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item, index)}
                            className="rounded p-1 text-red-600 hover:bg-red-50"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
