import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Bell, Shield, Smartphone, CreditCard, LogOut, ChevronRight, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { tokenManager } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = tokenManager.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    
    // Get profile photo from localStorage if available
    const storedPhoto = localStorage.getItem('profilePhoto');
    if (storedPhoto) {
      setProfilePhoto(storedPhoto);
    }
    
    setLoading(false);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        localStorage.setItem('profilePhoto', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    localStorage.removeItem('profilePhoto');
  };

  const handleLogout = () => {
    tokenManager.removeToken();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1">
          {[
            { id: 'profile', label: 'Profile', icon: User, active: true },
            { id: 'notifications', label: 'Notifications', icon: Bell, active: false },
            { id: 'privacy', label: 'Privacy & Data', icon: Shield, active: false },
            { id: 'devices', label: 'Connected Devices', icon: Smartphone, active: false },
            { id: 'billing', label: 'Billing', icon: CreditCard, active: false },
          ].map(item => (
            <button
              key={item.id}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                item.active 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
              {!item.active && <ChevronRight className="w-4 h-4 opacity-50" />}
            </button>
          ))}
          
          <div className="pt-8 mt-8 border-t border-slate-200">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Profile Section */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-sm relative group cursor-pointer">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
                        <User className="w-10 h-10 text-slate-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium">Change</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">{user?.name || 'User'}</h3>
                    <p className="text-sm text-slate-500 mb-3">{user?.email || 'email@example.com'}</p>
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        id="photoInput"
                        accept="image/*" 
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs cursor-pointer"
                        onClick={() => document.getElementById('photoInput')?.click()}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload New
                      </Button>
                      {profilePhoto && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={handleRemovePhoto}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={user?.name || ''} disabled className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id">User ID</Label>
                    <Input id="id" value={user?._id || ''} disabled className="bg-slate-50 font-mono text-xs" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={user?.email || ''} disabled className="bg-slate-50" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences Section */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Clinical Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div>
                    <h4 className="font-medium text-slate-900">Data Sharing with Dermatologist</h4>
                    <p className="text-sm text-slate-500 mt-1">Allow connected clinics to view your longitudinal scan history.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div>
                    <h4 className="font-medium text-slate-900">Environmental Alerts</h4>
                    <p className="text-sm text-slate-500 mt-1">Receive push notifications for high UV or poor air quality.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-100 bg-red-50/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-red-900">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900">Delete Account & Data</h4>
                    <p className="text-sm text-slate-500 mt-1 max-w-md">Permanently delete your account and all associated health data. This action cannot be undone.</p>
                  </div>
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 shrink-0">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8">
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
