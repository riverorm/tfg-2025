import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig.js'

export const markTaskAsDone = async (taskId) => {
  console.log('Marcar tarea como hecha:', taskId)
  const ref = doc(db, 'taskAssignments', taskId)

  await updateDoc(ref, {
    isDone: true,
  })
}