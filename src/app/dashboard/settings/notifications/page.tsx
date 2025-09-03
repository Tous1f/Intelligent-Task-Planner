'use client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useState } from 'react';

export default function NotificationsSettings() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="font-display text-2xl text-lavender-700 mb-6">Notification Preferences</h1>
      <Card>
        <form className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lavender-700">Email Notifications</span>
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={e => setEmailEnabled(e.target.checked)}
              className="w-5 h-5 text-lavender-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lavender-700">Push Notifications</span>
            <input
              type="checkbox"
              checked={pushEnabled}
              onChange={e => setPushEnabled(e.target.checked)}
              className="w-5 h-5 text-lavender-500"
            />
          </div>
          <Button className="w-full mt-6">Save Changes</Button>
        </form>
      </Card>
    </div>
  );
}
