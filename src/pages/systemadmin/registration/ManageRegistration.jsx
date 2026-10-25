import React, { useState } from 'react';
import { Power, CheckCircle, AlertTriangle, Layers } from 'lucide-react';

const ManageRegistration = () => {
    // Mock Data: Registration statuses for 2nd+ semesters
    const [registrationState, setRegistrationState] = useState([
        { id: 1, domain: 'Computer Science (BCS)', semesters: { '2nd': true, '3rd': true, '4th': false, '5th': false, '6th': false, '7th': false, '8th': false } },
        { id: 2, domain: 'Software Engineering (BSE)', semesters: { '2nd': true, '3rd': true, '4th': true, '5th': false, '6th': false, '7th': false, '8th': false } },
        { id: 3, domain: 'Business Admin (BBA)', semesters: { '2nd': false, '3rd': false, '4th': false, '5th': false, '6th': false, '7th': false, '8th': false } },
    ]);

    const allSemesters = ['2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

    const handleToggle = (domainId, semester) => {
        setRegistrationState(prev => prev.map(domain => {
            if (domain.id === domainId) {
                return {
                    ...domain,
                    semesters: {
                        ...domain.semesters,
                        [semester]: !domain.semesters[semester]
                    }
                };
            }
            return domain;
        }));
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Power className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Manage Course Registration</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Toggle registration ON/OFF for continuing students (2nd Semester onwards). When enabled, students can log in and select their own courses.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {registrationState.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-slate-50 p-4 border-b border-gray-200 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-bold text-gray-900">{item.domain}</h3>
                        </div>

                        {/* Scrollable grid for 2nd-8th semesters */}
                        <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 overflow-x-auto">
                            {allSemesters.map(sem => {
                                const isOpen = item.semesters[sem];
                                return (
                                    <div key={sem} className={`border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-colors ${isOpen ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                                        }`}>
                                        <span className={`text-xs font-bold ${isOpen ? 'text-emerald-800' : 'text-red-800'}`}>
                                            {sem} Sem
                                        </span>

                                        {/* Toggle Button */}
                                        <button
                                            onClick={() => handleToggle(item.id, sem)}
                                            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${isOpen ? 'bg-emerald-500' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isOpen ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>

                                        <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${isOpen ? 'text-emerald-600' : 'text-red-500'
                                            }`}>
                                            {isOpen ? <><CheckCircle className="w-3 h-3" /> Open</> : <><AlertTriangle className="w-3 h-3" /> Closed</>}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageRegistration;