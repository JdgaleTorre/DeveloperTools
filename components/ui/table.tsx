

export default function CustomTable({ rows, mapNull, onHandleDelete }: { rows: any[], mapNull: { [key: string]: any }, onHandleDelete?: (index: number) => void }) {
    const keys = rows.length > 0 ? Object.keys(rows[0]) : [];
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        {keys.map((key) => (
                            <th key={key} className="border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </th>
                        ))}
                        <th className="border-b border-gray-200 px-4 py-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((field, index) => (
                        <tr
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            {keys.map((key) => (
                                <td key={key} className="border-b border-gray-200 px-4 py-2 text-sm text-black dark:text-gray-100">
                                    {field[key] || mapNull[key] || 'N/A'}
                                </td>
                            ))}
                            <td className="border-b border-gray-200 px-4 py-2 text-center">
                                <button
                                    onClick={() => { }}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}