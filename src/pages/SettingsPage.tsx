import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Lock, Bell, Shield, LogOut, AlertTriangle } from 'lucide-react';
export function SettingsPage() {
  const { user, logout } = useStore();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Notification preferences state
  const [notifications, setNotifications] = useState({
    trades: true,
    prices: true,
    news: false,
    bot: true
  });
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully');
  };
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    alert('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const handleResetLive = () => {
    if (
    confirm(
      'Are you sure you want to reset your live account balance to $10,000? All trade history will be lost.'
    ))
    {
      alert('Live account reset successfully');
      // In a real app, this would call a store function
    }
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <h1 className="text-2xl font-bold text-white mb-6">Account Settings</h1>

      {/* Profile Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-400" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)} />

              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                className="opacity-60 cursor-not-allowed" />

              <Input
                label="Country"
                value={user?.country || 'Global'}
                disabled
                className="opacity-60 cursor-not-allowed" />

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">
                  Account Type
                </label>
                <div className="flex h-10 items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900">
                    LIVE ACCOUNT
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-400" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} />

              <Input
                type="password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} />

            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="secondary">
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-400" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
          {
            key: 'trades',
            label: 'Trade Execution Alerts',
            desc: 'Get notified when orders are opened or closed'
          },
          {
            key: 'prices',
            label: 'Price Alerts',
            desc: 'Notifications when assets hit your target price'
          },
          {
            key: 'news',
            label: 'Market News & Updates',
            desc: 'Daily summaries and major economic events'
          },
          {
            key: 'bot',
            label: 'AI Bot Activity',
            desc: 'Updates on automated trading performance'
          }].
          map((item) =>
          <div
            key={item.key}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-gray-800/50">

              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
              onClick={() =>
              toggleNotification(item.key as keyof typeof notifications)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-700'}`}>

                <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'}`} />

              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KYC Verification */}
      <Card className="bg-gray-900 border-gray-800 opacity-75">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-400" />
            Identity Verification (KYC)
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
              COMING SOON
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Identity verification will be required for live trading accounts and
            withdrawals exceeding $10,000. This feature is currently under
            development.
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-gray-900 border-red-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-900/30 bg-red-900/10">
            <div>
              <p className="text-sm font-medium text-white">
                Reset Live Account
              </p>
              <p className="text-xs text-gray-500">
                Restore balance to $10,000 and clear trade history
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={handleResetLive}>
              Reset Balance
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-800 bg-gray-800/30">
            <div>
              <p className="text-sm font-medium text-white">Sign Out</p>
              <p className="text-xs text-gray-500">
                Log out of your account on this device
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-red-400 hover:text-red-300 hover:border-red-900 hover:bg-red-900/20">

              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>);

}