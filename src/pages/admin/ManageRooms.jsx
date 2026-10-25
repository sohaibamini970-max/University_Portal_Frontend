import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Plus, Search, Trash2, Edit2, Building2, MonitorPlay, Users, X, CheckCircle } from 'lucide-react';

const ManageRooms = () => {
    const [activeTab, setActiveTab] = useState('rooms');
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock Data
    const [rooms, setRooms] = useState([
        { id: 1, name: 'Room 101', block: 'Block A', capacity: 50, type: 'Classroom' },
        { id: 2, name: 'Room 201', block: 'Block A', capacity: 40, type: 'Classroom' },
        { id: 3, name: 'Room 302', block: 'Block B', capacity: 45, type: 'Classroom' },
    ]);

    const [labs, setLabs] = useState([
        { id: 4, name: 'Lab 1', block: 'Block C', capacity: 30, type: 'Computer Lab' },
        { id: 5, name: 'Lab 3', block: 'Block C', capacity: 25, type: 'Networking Lab' },
    ]);

    // Form State
    const [newEntry, setNewEntry] = useState({ name: '', block: '', capacity: '', type: '' });

    const currentData = activeTab === 'rooms' ? rooms : labs;
    const filteredData = currentData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdd = (e) => {
        e.preventDefault();
        const entry = {
            id: Date.now(),
            ...newEntry,
            capacity: Number(newEntry.capacity),
            type: activeTab === 'rooms' ? 'Classroom' : 'Computer Lab'
        };

        if (activeTab === 'rooms') {
            setRooms(prev => [...prev, entry]);
        } else {
            setLabs(prev => [...prev, entry]);
        }

        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setShowModal(false);
            setNewEntry({ name: '', block: '', capacity: '', type: '' });
        }, 1500);
    };

    const handleDelete = (id) => {
        if (activeTab === 'rooms') {
            setRooms(prev => prev.filter(r => r.id !== id));
        } else {
            setLabs(prev => prev.filter(l => l.id !== id));
        }
    };

    return (
        <Layout title="Rooms & Labs" subtitle="Manage physical spaces available for classes and exams">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                {/* Top Bar */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">

                    {/* Tabs */}
                    <div className="flex w-full lg:w-auto bg-gray-100/80 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('rooms')}
                            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'rooms' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Building2 className="w-4 h-4" /> Classrooms
                        </button>
                        <button
                            onClick={() => setActiveTab('labs')}
                            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'labs' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <MonitorPlay className="w-4 h-4" /> Labs
                        </button>
                    </div>

                    {/* Search & Add */}
                    <div className="flex items-center gap-3 w-full lg:w-auto px-2 lg:px-0">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-sm whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                </div>

                {/* Grid View */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredData.map(item => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeTab === 'rooms' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                    }`}>
                                    {activeTab === 'rooms' ? <Building2 className="w-6 h-6" /> : <MonitorPlay className="w-6 h-6" />}
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{item.block} • {item.type}</p>

                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 w-max">
                                <Users className="w-4 h-4 text-gray-400" />
                                Capacity: {item.capacity} Students
                            </div>
                        </div>
                    ))}
                    {filteredData.length === 0 && (
                        <div className="col-span-full py-10 text-center text-gray-500 bg-white border border-gray-200 rounded-2xl">
                            No {activeTab} found.
                        </div>
                    )}
                </div>
            </div>

            {/* ADD MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">Add New {activeTab === 'rooms' ? 'Classroom' : 'Lab'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>

                        {showSuccess ? (
                            <div className="p-8 text-center animate-in zoom-in-95">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Added Successfully!</h3>
                            </div>
                        ) : (
                            <form onSubmit={handleAdd} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Room Name / Number</label>
                                    <input type="text" required value={newEntry.name} onChange={e => setNewEntry({ ...newEntry, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Room 401 or Lab 5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Block / Building</label>
                                    <input type="text" required value={newEntry.block} onChange={e => setNewEntry({ ...newEntry, block: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Block A" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Student Capacity</label>
                                    <input type="number" required value={newEntry.capacity} onChange={e => setNewEntry({ ...newEntry, capacity: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., 50" />
                                </div>
                                <div className="pt-4 border-t flex gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl">Save</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ManageRooms;