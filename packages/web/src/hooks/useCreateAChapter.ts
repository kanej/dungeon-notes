import { useCallback } from 'react'

// const ADD_CHAPTER = gql`
//   mutation AddChapter($name: String!) {
//     addChapter(name: $name) {
//       name
//       slug
//     }
//   }
// `

export default function useCreateAChapter() {
  // const [
  //   addChapter,
  //   // { loading: addAdventureLoading, error: addAdventureError },
  // ] = useMutation(ADD_CHAPTER)

  const handleCreateAChapter = useCallback(async () => {
    const chapter = window.prompt('What is the name of this chapter')

    if (!chapter) {
      return
    }

    alert('TBD')
    // return addChapter({ variables: { name: chapter } })
  }, [])

  return handleCreateAChapter
}
