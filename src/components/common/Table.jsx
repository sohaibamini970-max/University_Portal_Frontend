import React from 'react';

const Table = ({ columns, data, emptyMessage = 'No data available' }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="text-left py-3 px-4 text-sm font-semibold text-gray-600 bg-gray-50 first:rounded-tl-lg last:rounded-tr-lg"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, idx) => (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                {columns.map((col) => (
                                    <td key={col.key} className="py-3 px-4 text-sm text-gray-700">
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;