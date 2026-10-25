import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Code, Cpu, Database, ChevronRight } from 'lucide-react';

const DomainSelection = () => {
    const navigate = useNavigate();

    const domains = [
        { id: 'cs', name: 'Computer Science', code: 'CS', icon: Code, color: 'bg-blue-50 text-blue-600 border-blue-200', hover: 'hover:border-blue-400 hover:shadow-blue-100' },
        { id: 'it', name: 'Information Technology', code: 'IT', icon: Database, color: 'bg-indigo-50 text-indigo-600 border-indigo-200', hover: 'hover:border-indigo-400 hover:shadow-indigo-100' },
        { id: 'se', name: 'Software Engineering', code: 'SE', icon: GraduationCap, color: 'bg-purple-50 text-purple-600 border-purple-200', hover: 'hover:border-purple-400 hover:shadow-purple-100' },
        { id: 'ai', name: 'Artificial Intelligence', code: 'AI', icon: Cpu, color: 'bg-emerald-50 text-emerald-600 border-emerald-200', hover: 'hover:border-emerald-400 hover:shadow-emerald-100' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Select a Domain</h2>
                <p className="text-gray-500 mt-1">Choose a department to view or schedule its exam timetable.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {domains.map((domain) => (
                    <button
                        key={domain.id}
                        onClick={() => navigate(`/examination/timetable/${domain.id}`)}
                        className={`flex items-center justify-between p-6 rounded-2xl border-2 bg-white transition-all duration-200 ${domain.color} ${domain.hover} hover:-translate-y-1 hover:shadow-lg`}
                    >
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-white/60`}>
                                <domain.icon className="w-7 h-7" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold">{domain.name}</h3>
                                <p className="text-sm font-semibold opacity-70 mt-1">Domain Code: {domain.code}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 opacity-50" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DomainSelection;