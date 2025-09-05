import React from 'react';

type Props = {
  trigger?: React.ReactNode;
  onTaskCreated?: () => void;
};

export default function TaskCreationDialog({ trigger, onTaskCreated }: Props) {
  const handleCreate = () => {
    // Minimal placeholder: call the callback if present.
    if (onTaskCreated) onTaskCreated();
    // In the real app this would open a dialog and create a task via API.
  };

  return (
    <div>
      <div onClick={handleCreate}>
        {trigger || <button className="btn">New Task</button>}
      </div>
    </div>
  );
}
