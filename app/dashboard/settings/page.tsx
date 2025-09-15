"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Upload, Save, RotateCcw, Mail, Phone, MapPin, Shield, Bell } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const defaultSettings = {
  general: {
    siteName: "Municipal Council",
    contactEmail: "info@council.gov",
    contactPhone: "+1 (555) 123-4567",
    address: "123 Main Street, City, State 12345",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: ""
    }
  },
  branding: {
    logoUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100",
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    accentColor: "#F59E0B"
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    systemAlerts: true
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5
  },
  system: {
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    backupFrequency: "daily"
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  // Update CSS variables for dynamic theming
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', settings.branding.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.branding.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', settings.branding.accentColor);
  }, [settings.branding]);

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const updateNestedSetting = (category, nestedKey, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [nestedKey]: {
          ...prev[category][nestedKey],
          [key]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    localStorage.setItem('settings', JSON.stringify(settings));
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const handleResetToDefault = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('settings');
    setHasChanges(false);
  };

  const handleUploadLogo = () => {
    console.log('Uploading logo...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage system configuration and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleResetToDefault}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSaveChanges} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic site information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.general.siteName}
                  onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="contactPhone"
                      value={settings.general.contactPhone}
                      onChange={(e) => updateSetting('general', 'contactPhone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={settings.general.address}
                    onChange={(e) => updateSetting('general', 'address', e.target.value)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Media Links</h3>
                  {Object.entries(settings.general.socialMedia).map(([key, value]) => (
                    <div className="space-y-2" key={key}>
                      <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                      <Input
                        id={key}
                        value={value}
                        onChange={(e) => updateNestedSetting('general', 'socialMedia', key, e.target.value)}
                        placeholder={`Enter ${key} URL`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding" className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Branding & Appearance</CardTitle>
              <CardDescription>Customize the visual appearance of your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Logo</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 border rounded-lg overflow-hidden">
                    <img
                      src={settings.branding.logoUrl}
                      alt="Current Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <Button onClick={handleUploadLogo}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-sm text-gray-500">Recommended size: 200x200px</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Color Scheme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['primaryColor', 'secondaryColor', 'accentColor'].map((colorKey) => (
                      <div className="space-y-2" key={colorKey}>
                        <Label htmlFor={colorKey}>{colorKey.replace('Color', ' Color')}</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id={colorKey}
                            type="color"
                            value={settings.branding[colorKey]}
                            onChange={(e) => updateSetting('branding', colorKey, e.target.value)}
                            className="w-16 h-10"
                          />
                          <Input
                            value={settings.branding[colorKey]}
                            onChange={(e) => updateSetting('branding', colorKey, e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div className="flex items-center justify-between" key={key}>
                  <div className="space-y-0.5">
                    <Label>{key.replace(/([A-Z])/g, ' $1')}</Label>
                    <p className="text-sm text-gray-500">Toggle {key.replace(/([A-Z])/g, ' ')}</p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => updateSetting('notifications', key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={settings.security.passwordExpiry}
                      onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={settings.security.loginAttempts}
                    onChange={(e) => updateSetting('security', 'loginAttempts', parseInt(e.target.value))}
                    className="w-32"
                  />
                  <p className="text-sm text-gray-500">Account will be locked after this many failed attempts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System */}
        <TabsContent value="system" className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Advanced system settings and maintenance options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {['maintenanceMode', 'debugMode', 'cacheEnabled'].map((key) => (
                  <div className="flex items-center justify-between" key={key}>
                    <div className="space-y-0.5">
                      <Label>{key.replace(/([A-Z])/g, ' ')}</Label>
                      <p className="text-sm text-gray-500">Toggle {key.replace(/([A-Z])/g, ' ')}</p>
                    </div>
                    <Switch
                      checked={settings.system[key]}
                      onCheckedChange={(checked) => updateSetting('system', key, checked)}
                    />
                  </div>
                ))}
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <select
                    id="backupFrequency"
                    value={settings.system.backupFrequency}
                    onChange={(e) => updateSetting('system', 'backupFrequency', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Changes Banner */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span>You have unsaved changes</span>
            <Button size="sm" variant="secondary" onClick={handleSaveChanges}>
              Save Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
