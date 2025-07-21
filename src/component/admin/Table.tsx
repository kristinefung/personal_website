import React from "react";

export interface TableColumn<T> {
    key: string;
    header: string;
    render?: (row: T) => React.ReactNode;
    className?: string;
}

export interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    rowKey: (row: T) => string | number;
    emptyState?: React.ReactNode;
}

function Table<T>({ columns, data, rowKey, emptyState }: TableProps<T>) {
    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={
                                        col.className ||
                                        "text-left py-4 px-6 font-medium text-gray-700 uppercase tracking-wider text-sm"
                                    }
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.length > 0 ? (
                            data.map((row) => (
                                <tr key={rowKey(row)} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((col) => (
                                        <td key={col.key} className="py-4 px-6">
                                            {col.render ? col.render(row) : (row as any)[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-12">
                                    {emptyState || <span className="text-gray-500">No data available</span>}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table; 