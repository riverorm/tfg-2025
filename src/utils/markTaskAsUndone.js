import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig.js'

export const markTaskAsUndone = async (taskId) => {
  console.log('Marcar tarea como sin hacer:', taskId)
  const ref = doc(db, 'taskAssignments', taskId)

  await updateDoc(ref, {
    isDone: false,
  })
}