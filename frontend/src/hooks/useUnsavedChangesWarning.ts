import { useEffect } from 'react'

export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

}

export function useConfirmIfNeeded(hasUnsavedChanges: boolean) {
  return (message?: string) => {
    if (!hasUnsavedChanges) return true
    return window.confirm(message ?? 'You have unsaved changes! Are you sure you want to leave?')
  }
}
