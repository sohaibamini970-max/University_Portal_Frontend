import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Camera, Upload, CheckCircle, User, Save } from 'lucide-react';

const ProfileImage = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // API Call to upload image goes here
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <Layout title="Profile Image" subtitle="Update your account avatar">
            <div className="max-w-md mx-auto mt-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    <div className="bg-slate-800 p-6 text-white text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <User className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold">Profile Image</h2>
                        <p className="text-slate-300 text-sm mt-1">Update your account avatar</p>
                    </div>

                    <div className="p-8 flex flex-col items-center">

                        {/* Image Preview */}
                        <div className="relative group mb-6">
                            <div className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-gray-300" />
                                )}
                            </div>

                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        </div>

                        {/* Upload Button */}
                        <label className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 cursor-pointer transition-colors mb-6">
                            <Upload className="w-4 h-4" /> Choose New Image
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={!imagePreview}
                            className={`w-full flex items-center justify-center gap-2 py-3 font-bold rounded-xl shadow-md transition-colors ${imagePreview
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <Save className="w-4 h-4" /> Save Profile Image
                        </button>
                    </div>
                </div>

                {showSuccess && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm text-center p-6 animate-in zoom-in-95">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Image Updated!</h2>
                            <p className="text-sm text-gray-500">Your profile picture has been changed.</p>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ProfileImage;