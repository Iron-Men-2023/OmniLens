import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/storage';
import {db, storage} from '../../config/firebaseConfig';
import {Platform} from 'react-native';

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

function createUser(user) {
  if (!user) {
    return;
  }
  if (!user.photoURL) {
    user.photoURL =
      'https://firebasestorage.googleapis.com/v0/b/instagram-clone-4a7d2.appspot.com/o/avatars%2Fdefault-avatar.png?alt=media&token=0d0c9f9b-1a7a-4c1f-8d8c-0e0b3d3b3c3b';
  }
  let username = user.email.split('@')[0];
  return db.collection('users').doc(user.uid).set({
    email: user.email,
    name: user.displayName,
    username: username,
    photoURL: user.photoURL,
    uid: user.uid,
  });
}

async function updateUser(user, name, photo) {
  if (!user) {
    return;
  }
  // const pathToFile = `faces/${user.uid}/face.jpg`;
  // const uploadUri =
  //   Platform.OS === 'ios' ? photo.replace('file://', '') : photo;
  // console.log('uploadUri', uploadUri);
  // const storagePath = await storage.ref(pathToFile);
  // await putFile(uploadUri);
  // const ref = storage.ref(pathToFile);
  // const url = await ref.getDownloadURL();
  return db.collection('users').doc(user.uid).update({
    name: name,
    photoURL: photo,
  });
}

export {fetchUser, createUser, updateUser};
