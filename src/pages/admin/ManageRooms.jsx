import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { Plus, Search, Trash2, Edit2, Building2, MonitorPlay, X, CheckCircle, Loader2, Save } from 'lucide-react';
import { api } from '../../context/AuthContext';

const ManageRooms = () => {
    const [activeTab, setActiveTab] = useState('Classroom');
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [departmentInfo, setDepartmentInfo] = useState(null);

    // Edit State
    const [editingRoom, setEditingRoom] = useState(null);
    const [editRoomName, setEditRoomName] = useState('');

    // Form State
    const [newEntry, setNewEntry] = useState({ roomName: '' });

    const fetchData = async () => {
        try {
            const [roomsRes, deptRes] = await Promise.all([
                api.get('/rooms'),
                api.get('/departments')
            ]);
            setRooms(roomsRes.data);

            if (deptRes.data.length > 0) {
                setDepartmentInfo(deptRes.data[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = rooms
        .filter(r => r.roomType === activeTab)
        .filter(r => r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleAdd = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/rooms', {
                roomName: newEntry.roomName,
                roomType: activeTab
            });
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setShowModal(false);
                setNewEntry({ roomName: '' });
                fetchData();
            }, 1500);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add room");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        try {
            await api.delete(`/rooms/${id}`);
            fetchData();
        } catch (error) {
            alert("Failed to delete room");
        }
    };

    const openEditModal = (room) => {
        setEditingRoom(room);
        setEditRoomName(room.roomNumber);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.put(`/rooms/${editingRoom.id}`, {
                roomName: editRoomName,
                roomType: editingRoom.roomType
            });
            setEditingRoom(null);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update room");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Layout title="Rooms & Labs"><div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div></Layout>;

    const building = departmentInfo?.building || 'H';

    return (
        <Layout title="Rooms & Labs" subtitle="Manage physical spaces available for classes and exams">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">
                {/* Top Bar */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex w-full lg:w-auto bg-gray-100/80 p-1 rounded-xl">
                        <button onClick={() => setActiveTab('Classroom')} className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'Classroom' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            <Building2 className="w-4 h-4" /> Classrooms
                        </button>
                        <button onClick={() => setActiveTab('Lab')} className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'Lab' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            <MonitorPlay className="w-4 h-4" /> Labs
                        </button>
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto px-2 lg:px-0">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder={`Search ${activeTab}s...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-sm whitespace-nowrap">
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                </div>

                {/* Grid View */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredData.map(item => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeTab === 'Classroom' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                    {activeTab === 'Classroom' ? <Building2 className="w-6 h-6" /> : <MonitorPlay className="w-6 h-6" />}
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal(item)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <h3 className="font-bold text-2xl text-gray-900 mb-1">{item.roomNumber}</h3>
                            <p className="text-sm text-gray-500 font-medium">{item.roomType}</p>
                        </div>
                    ))}
                    {filteredData.length === 0 && <div className="col-span-full py-10 text-center text-gray-500 bg-white border border-gray-200 rounded-2xl">No {activeTab}s found.</div>}
                </div>
            </div>

            {/* ADD MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">Add New {activeTab}</h2>
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
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Room Name (Must start with {building})</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEntry.roomName}
                                        onChange={e => setNewEntry({ ...newEntry, roomName: e.target.value.toUpperCase() })}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-lg font-bold tracking-wider focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                                        placeholder={`e.g., ${building}S-12`}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Examples: <strong>{building}S-12</strong> (Classroom), <strong>{building}L-05</strong> (Lab)
                                    </p>
                                </div>

                                <div className="pt-4 border-t flex gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl">Cancel</button>
                                    <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl flex justify-center items-center gap-2">
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editingRoom && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">Edit {editingRoom.roomType}</h2>
                            <button onClick={() => setEditingRoom(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Room Name</label>
                                <input
                                    type="text"
                                    required
                                    value={editRoomName}
                                    onChange={e => setEditRoomName(e.target.value.toUpperCase())}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-lg font-bold tracking-wider focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                                />
                            </div>
                            <div className="pt-4 border-t flex gap-3">
                                <button type="button" onClick={() => setEditingRoom(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl flex justify-center items-center gap-2">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Update</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ManageRooms;