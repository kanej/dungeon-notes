import { useCallback } from 'react'

export default function useCreateAChapter(): () => Promise<void> {
  const handleCreateAChapter = useCallback(async () => {
    // eslint-disable-next-line no-alert
    const chapter = window.prompt('What is the name of this chapter')

    if (!chapter) {
      return
    }

    // eslint-disable-next-line no-alert
    alert('TBD')
  }, [])

  return handleCreateAChapter
}
