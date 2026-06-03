import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSave, FaEdit, FaCamera } from 'react-icons/fa';
import { updateUser, changePassword } from '../../features/authenthication/authSlice';
import axiosPrivate from '../../utils/axiosPrivate';

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    email: user?.email || '',
    username: user?.username || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
 console.log("USER IS ",user)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosPrivate.patch(`/users/${user?.id}`, formData);
      dispatch(updateUser(response.data.data.user));
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Update failed', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }
    setLoading(true);
    try {
      await axiosPrivate.patch('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        newPasswordConfirm: passwordData.confirmPassword
      });
      setMessage({ text: 'Password changed successfully!', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Password change failed', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
        {!isEditing && <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"><FaEdit /> Edit Profile</button>}
      </div>

      {message.text && <div className={`px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`}>{message.text}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md"><FaCamera className="text-gray-500 text-sm" /></button>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mt-4">{user?.userName}</h3>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <p className="mt-2 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full inline-block">Active Member</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>


            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" value={formData.userName} onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                disabled={!isEditing} 
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 
                ${!isEditing && 'bg-gray-50'}`} />
                </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!isEditing} 
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 
                ${!isEditing && 'bg-gray-50'}`} /></div>
              {isEditing && <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"><FaSave /> {loading ? 'Saving...' : 'Save Changes'}</button>}
            </form>
          </div>





          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label><input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required /></div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">New Password</label><input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label><input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required /></div>
              </div>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">{loading ? 'Updating...' : 'Update Password'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;