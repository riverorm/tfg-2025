import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from '@/firebaseConfig.js'

export const listenTasksAssignments = (onTasksAssignments) => {
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Obtener el groupId del usuario actual
      getDoc(doc(db, 'users', user.uid)).then((userDoc) => {
        if (!userDoc.exists()) {
          console.log('El usuario no pertenece a ningún grupo.')
          return
        }

        const userGroupId = userDoc.data().groupId

        // Escuchar cambios en tiempo real
        const tasksRef = collection(db, 'taskAssignments')
        const tasksQuery = query(tasksRef, where('groupId', '==', userGroupId), orderBy('date'))

        onSnapshot(tasksQuery, (snapshot) => {
          onTasksAssignments(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })),
          )
        })
      })
    } else {
      console.log('Usuario no autenticado.')
    }
  })
}