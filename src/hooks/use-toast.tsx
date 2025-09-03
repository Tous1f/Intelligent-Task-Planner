"use client"

import { useState } from 'react'
import { toast } from 'sonner' // or your preferred toast library

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([])

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36)
    
    if (type === 'success') {
      toast.success(message)
    } else if (type === 'error') {
      toast.error(message)
    } else {
      toast(message)
    }
    
    setToasts(prev => [...prev, { id, message, type }])
  }

  const notifySuccess = (message: string) => showToast(message, 'success')
  const notifyError = (message: string) => showToast(message, 'error')

  return {
    showToast,
    notifySuccess,
    notifyError,
    toasts
  }
}