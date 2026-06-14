import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import {
  Settings,
  Bell,
  Lock,
  Palette,
  User,
  Eye,
  EyeOff,
  Save,
  RotateCw,
  Shield,
  Moon,
  Sun,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    bio: "Love building beautiful web applications",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    newComments: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    // Show toast notification
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your account, privacy, and application preferences.
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="account" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* Account Settings Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />

              <div>
                <label className="text-xs sm:text-sm font-semibold text-foreground opacity-85 block mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-3 bg-card/50 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary/50 resize-none text-sm placeholder-muted-foreground transition-all"
                  rows={4}
                  placeholder="Tell us about yourself"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSave} isLoading={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            {/* Password Change Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    label="Current Password"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.current}
                    onChange={(e) => handlePasswordChange("current", e.target.value)}
                  />
                </div>

                <Input
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.new}
                  onChange={(e) => handlePasswordChange("new", e.target.value)}
                />

                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.confirm}
                    onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-10 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long and include uppercase, lowercase, and numbers.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Update Password</Button>
              </CardFooter>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/40">
                  <div>
                    <p className="font-semibold mb-1">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <Button variant="primary">Enable</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Settings Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "emailNotifications",
                  label: "Email Notifications",
                  description: "Receive important updates via email",
                },
                {
                  key: "pushNotifications",
                  label: "Push Notifications",
                  description: "Get real-time notifications in your browser",
                },
                {
                  key: "weeklyDigest",
                  label: "Weekly Digest",
                  description: "Receive a summary of your activities",
                },
                {
                  key: "newComments",
                  label: "New Comments",
                  description: "Be notified when someone comments on your posts",
                },
              ].map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/40 hover:border-border/60 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-sm">{setting.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{setting.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        [setting.key]: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Theme & Display
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Color Theme</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setIsDarkMode(true)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isDarkMode
                        ? "border-primary bg-card/80"
                        : "border-border hover:border-border/60 bg-card/30"
                    }`}
                  >
                    <Moon className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="font-semibold text-sm">Dark Mode</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Easy on the eyes in low light
                    </p>
                  </button>

                  <button
                    onClick={() => setIsDarkMode(false)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      !isDarkMode
                        ? "border-primary bg-card/80"
                        : "border-border hover:border-border/60 bg-card/30"
                    }`}
                  >
                    <Sun className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="font-semibold text-sm">Light Mode</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bright and clean appearance
                    </p>
                  </button>
                </div>
              </div>

              <div className="border-t border-border/40 pt-6">
                <h3 className="font-semibold mb-4">Font Size</h3>
                <div className="flex gap-4">
                  {["Small", "Normal", "Large"].map((size) => (
                    <button
                      key={size}
                      className="px-4 py-2 rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
