import { addChapter, toGuid } from '@dungeon-notes/types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { v4 as uuidV4 } from 'uuid'

export default function useCreateAChapter(): () => Promise<void> {
  const dispatch = useDispatch()

  const handleCreateAChapter = useCallback(async () => {
    const id = toGuid(uuidV4())
    const name = 'New chapter'

    const command = addChapter({ id, name })

    const response = await fetch('http://localhost:9898/api/adventure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    })

    if (response.status !== 200) {
      console.error(response.text)
      return
    }

    dispatch(command)
  }, [dispatch])

  return handleCreateAChapter
}
