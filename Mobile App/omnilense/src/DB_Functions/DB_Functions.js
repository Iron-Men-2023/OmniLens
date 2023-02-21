import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import {db} from '../../config/firebaseConfig';

async function fetchUser() {
  let userData = {};
  const user = firebase.auth().currentUser;
  userData.userInfo = user;

  // // Get the user's idToken
  const idToken = await user.getIdToken();
  console.log('userId', user.uid);
  console.log('users', user);
  const userRef = await db.collection('users').doc(user.uid);
  console.log('userRef', userRef);
  // const userRef = db.collection('users').doc(user.uid);
  await userRef
    .get()
    .then(async doc => {
      if (!doc.exists) {
        console.log('User does not exist', doc);
      } else {
        userData.userDoc = doc.data();
        console.log('userDoc', doc.data());
        // let photoURL = userDoc.data().photoURL;
        // if (!photoURL) {
        //   console.log('No photoURLsssss');
        //   const pathToFile = `avatars/${user.uid}.jpg`;
        //   const photoURL = await firebase()
        //       .storage.ref(pathToFile)
        //       .getDownloadURL();
        //   try {
        //     await userRef.update({
        //       photoURL,
        //     });
        //   } catch (e) {
        //     console.log('Error updating user document', e);
        //   }
      }
      // const postsQuery = await firebase()
      //     .firestore.collection('posts')
      //     .where('userId', '==', user.uid)
      //     .get();
      // userData.postsData = postsQuery.docs.map(doc => doc.data());
    })
    .catch(e => {
      console.log('Error getting document', e);
    });
  return userData;
}

export default fetchUser;
