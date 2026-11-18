import React, { useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { api } from '../../../context/AuthContext';

const ExcelUploadStudents = ({ onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // Columns that must exist in the uploaded sheet and that the backend understands.
    // NOTE: No DOB / Address — the Student model does not have those columns.
    const REQUIRED_COLUMNS = [
        'SequenceNo',
        'FullName',
        'FatherName',
        'Email',
        'Phone',
        'CNIC',
        'DepartmentName',
        'ProgramCode',
        'BatchName',
        'Section',
    ];

    const OPTIONAL_COLUMNS = ['CNIC'];

    // Force every value to a trimmed string.
    // Excel gives us numbers for things like "001" or phone numbers, and ASP.NET
    // refuses to bind a JSON number to a C# string. Doing this here is the fix.
    const toRowObject = (rawRow) => {
        const out = {};
        REQUIRED_COLUMNS.forEach((col) => {
            const v = rawRow[col];
            out[col] = v === null || v === undefined ? '' : String(v).trim();
        });
        return out;
    };

    const handleDownloadTemplate = () => {
        const template = [{
            SequenceNo: '001',
            FullName: 'Ali Khan',
            FatherName: 'Ahmed Khan',
            Email: 'ali.khan@example.com',
            Phone: '03001234567',
            CNIC: '35201-1234567-1',
            DepartmentName: 'Computer Science',
            ProgramCode: 'BSCS',
            BatchName: '2024-2028',
            Section: 'A',
        }];

        const ws = XLSX.utils.json_to_sheet(template);
        ws['!cols'] = [
            { wch: 12 }, // SequenceNo
            { wch: 20 }, // FullName
            { wch: 20 }, // FatherName
            { wch: 25 }, // Email
            { wch: 15 }, // Phone
            { wch: 18 }, // CNIC
            { wch: 20 }, // DepartmentName
            { wch: 12 }, // ProgramCode
            { wch: 15 }, // BatchName
            { wch: 10 }, // Section
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students');
        XLSX.writeFile(wb, 'Student_Upload_Template.xlsx');
    };

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        setError('');
        setResult(null);
        setFile(selected);
        parsePreview(selected);
    };

    const parsePreview = (f) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const wb = XLSX.read(evt.target.result, { type: 'binary' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

                if (!data.length) {
                    setError('The Excel file is empty.');
                    setPreview([]);
                    return;
                }

                const headers = Object.keys(data[0]);

                // Columns that must actually exist in the file (Optional ones excluded)
                const strictlyRequired = REQUIRED_COLUMNS.filter(
                    (c) => !OPTIONAL_COLUMNS.includes(c)
                );
                const missing = strictlyRequired.filter((c) => !headers.includes(c));
                if (missing.length > 0) {
                    setError(`Missing required columns: ${missing.join(', ')}`);
                    setPreview([]);
                    return;
                }

                const validated = data.map((raw, idx) => {
                    const row = toRowObject(raw);
                    const rowErrors = [];

                    if (!row.SequenceNo) rowErrors.push('SequenceNo required');
                    if (!row.FullName) rowErrors.push('FullName required');
                    if (!row.FatherName) rowErrors.push('FatherName required');
                    if (!row.Email) rowErrors.push('Email required');
                    if (!row.Phone) rowErrors.push('Phone required');
                    if (!row.DepartmentName) rowErrors.push('DepartmentName required');
                    if (!row.ProgramCode) rowErrors.push('ProgramCode required');
                    if (!row.BatchName) rowErrors.push('BatchName required');
                    if (!row.Section) rowErrors.push('Section required');

                    if (row.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.Email)) {
                        rowErrors.push('Invalid email');
                    }

                    // SequenceNo must be numeric-looking so the roll-no suffix is sane
                    if (row.SequenceNo && !/^\d+$/.test(row.SequenceNo)) {
                        rowErrors.push('SequenceNo must be a number');
                    }

                    return { ...row, _rowNum: idx + 2, _errors: rowErrors };
                });

                setPreview(validated);
            } catch (err) {
                console.error('[BULK UPLOAD] parse error:', err);
                setError('Failed to parse Excel file. Please ensure it is a valid .xlsx file.');
                setPreview([]);
            }
        };
        reader.readAsBinaryString(f);
    };

    const handleSubmit = async () => {
        if (!preview.length) return;

        const invalid = preview.filter((r) => r._errors.length > 0);
        if (invalid.length > 0) {
            setError(`Please fix ${invalid.length} row(s) with errors before submitting.`);
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            // Strip helper fields; everything left is a trimmed string.
            const students = preview.map(({ _rowNum, _errors, ...row }) => row);
            const payload = { students };

            if (import.meta?.env?.DEV) {
                console.log('[BULK UPLOAD] payload:', JSON.stringify(payload, null, 2));
                console.log(
                    '[BULK UPLOAD] SequenceNo type of row 0:',
                    typeof students[0]?.SequenceNo,
                    '| value:',
                    JSON.stringify(students[0]?.SequenceNo)
                );
            }

            const res = await api.post('/students/bulk-register', payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            setResult(res.data);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('[BULK UPLOAD] response:', JSON.stringify(err.response?.data, null, 2));

            const data = err.response?.data;

            // ASP.NET automatic model validation:
            // { type, title, status, errors: { "Field": ["msg", ...] }, traceId }
            if (data?.errors) {
                const lines = Object.entries(data.errors)
                    .map(([field, messages]) =>
                        `${field}: ${Array.isArray(messages) ? messages.join('; ') : messages}`
                    )
                    .join('\n');
                setError(`Backend validation failed:\n${lines}`);
                return;
            }

            // Custom error from our endpoint:
            // { message, details, errors: [{row, message}] }
            if (data?.details) {
                setError(`${data.message || 'Bulk upload failed'}: ${JSON.stringify(data.details)}`);
                return;
            }
            if (data?.message) {
                setError(data.message);
                return;
            }
            setError(err.message || 'Bulk upload failed.');
        } finally {
            setIsUploading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPreview([]);
        setResult(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const openPicker = () => {
        // Reset value so selecting the SAME file again re-triggers onChange
        if (fileInputRef.current) fileInputRef.current.value = '';
        fileInputRef.current?.click();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-slate-800 p-5 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Bulk Upload Students</h2>
                            <p className="text-slate-300 text-xs mt-0.5">
                                Upload an Excel file to register multiple students at once.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {/* Step 1: Download Template */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Download className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-blue-900">Step 1: Download the helper format</h3>
                            <p className="text-xs text-blue-700 mt-1">
                                Required columns: {REQUIRED_COLUMNS.filter((c) => !OPTIONAL_COLUMNS.includes(c)).join(', ')}.
                                Optional: {OPTIONAL_COLUMNS.join(', ')}.
                            </p>
                            <button
                                type="button"
                                onClick={handleDownloadTemplate}
                                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Download className="w-4 h-4" /> Download Template
                            </button>
                        </div>
                    </div>

                    {/* Step 2: Upload File */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-700 mb-2">Step 2: Upload filled Excel file</h3>
                        <div
                            onClick={openPicker}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-colors"
                        >
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-700">
                                {file ? file.name : 'Click to select a .xlsx file'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Only .xlsx and .xls files are supported</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Error display */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
                        </div>
                    )}

                    {/* Step 3: Preview */}
                    {preview.length > 0 && !result && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-gray-700">
                                    Step 3: Preview ({preview.length} student{preview.length > 1 ? 's' : ''})
                                </h3>
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="text-xs text-red-600 hover:underline"
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="border border-gray-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-bold text-gray-600">#</th>
                                            <th className="px-3 py-2 text-left font-bold text-gray-600">Seq</th>
                                            <th className="px-3 py-2 text-left font-bold text-gray-600">Name</th>
                                            <th className="px-3 py-2 text-left font-bold text-gray-600">Email</th>
                                            <th className="px-3 py-2 text-left font-bold text-gray-600">Program</th>
                                            <th className="px-3 py-2 text-left font-bold text-gray-600">Batch</th>
                                            <th className="px-3 py-2 text-left font-bold text-gray-600">Section</th>
                                            <th className="px-3 py-2 text-left font-bold text-gray-600">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {preview.map((row, i) => (
                                            <tr
                                                key={i}
                                                className={`border-t border-gray-100 ${row._errors.length ? 'bg-red-50' : ''}`}
                                            >
                                                <td className="px-3 py-2 text-gray-500">{row._rowNum}</td>
                                                <td className="px-3 py-2 text-gray-700 font-mono">{row.SequenceNo}</td>
                                                <td className="px-3 py-2 font-semibold text-gray-800">{row.FullName}</td>
                                                <td className="px-3 py-2 text-gray-600">{row.Email}</td>
                                                <td className="px-3 py-2 text-gray-600">{row.ProgramCode}</td>
                                                <td className="px-3 py-2 text-gray-600">{row.BatchName}</td>
                                                <td className="px-3 py-2 text-gray-600">{row.Section}</td>
                                                <td className="px-3 py-2">
                                                    {row._errors.length === 0 ? (
                                                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                                                            <CheckCircle className="w-3 h-3" /> Valid
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="text-red-600"
                                                            title={row._errors.join('; ')}
                                                        >
                                                            ❌ {row._errors.length} error(s)
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                                <h3 className="text-base font-bold text-emerald-900">Upload Complete</h3>
                            </div>
                            <p className="text-sm text-emerald-800">{result.message}</p>
                            {result.errors && result.errors.length > 0 && (
                                <div className="mt-3 p-3 bg-white rounded-lg border border-red-200 max-h-40 overflow-y-auto">
                                    <p className="text-xs font-bold text-red-700 mb-1">Failed rows:</p>
                                    {result.errors.map((e, i) => (
                                        <p key={i} className="text-xs text-red-600">
                                            Row {e.row}: {e.message}
                                        </p>
                                    ))}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    reset();
                                    onClose();
                                }}
                                className="mt-4 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!result && (
                    <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!preview.length || isUploading || preview.some((r) => r._errors.length > 0)}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {isUploading ? 'Uploading...' : `Register ${preview.length} Student(s)`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExcelUploadStudents;