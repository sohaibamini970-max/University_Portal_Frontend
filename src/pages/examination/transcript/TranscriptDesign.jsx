import React, { useState } from 'react';
import TranscriptPaper from '../../../components/common/TranscriptPaper';
import { Download, LayoutTemplate, Printer } from 'lucide-react';

const TranscriptDesign = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start justify-between gap-4 print:hidden">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <LayoutTemplate className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Transcript Template Design</h2>
                        <p className="text-sm text-gray-500 mt-1">This is the official template layout. All generated transcripts will follow this exact structure.</p>
                    </div>
                </div>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors whitespace-nowrap">
                    <Printer className="w-4 h-4" /> Print Preview
                </button>
            </div>

            {/* The Actual Transcript Component */}
            <div className="bg-gray-200 p-4 md:p-8 rounded-2xl overflow-x-auto print:p-0 print:bg-white">
                <TranscriptPaper />
            </div>
        </div>
    );
};

export default TranscriptDesign;