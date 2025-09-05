"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function NewTaskPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleCreateTask = async () => {
    if (!title.trim()) return

    setIsCreating(true)
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })

      if (response.ok) {
        // Use the correct toast function
        toast({
          title: "Task Created",
          description: "Task successfully created!",
        })
        router.push('/dashboard/tasks')
      } else {
        throw new Error('Failed to create task')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
      
      <div className="space-y-4">
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
        
        <Textarea
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <Button 
          onClick={handleCreateTask}
          disabled={isCreating || !title.trim()}
        >
          {isCreating ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </div>
  )
}
