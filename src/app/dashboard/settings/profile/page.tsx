'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogFooter } from '@/components/ui/Dialog';

export default function UserProfilePage() {
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      addToast({ title: 'Profile Saved', description: 'Your profile has been updated successfully.', type: 'success' });
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-semibold mb-6 text-lavender-700 font-display">User Profile</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
        />

        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="mt-8">
            Delete Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
          <DialogDescription>
            This action is irreversible. Are you sure you want to delete your account?
          </DialogDescription>
          <DialogFooter className="mt-4 flex justify-end gap-4">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                addToast({ title: 'Account Deleted', description: 'Your account has been deleted.', type: 'destructive' });
              }}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
