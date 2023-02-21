import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/storage';
import {db, storage, auth} from '../firebaseConfig';
import {Platform} from 'react-native';

async function fetchUserData() {
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
    bio: '',
    uid: user.uid,
    interests: [],
  });
}

async function updateUserPhotoAndName(user, name, photo) {
  if (!user) {
    return;
  }
  return db.collection('users').doc(user.uid).update({
    name: name,
    photoURL: photo,
  });
}

async function logout() {
  return auth.signOut();
}

async function updateInterests(interests) {
  const user = auth.currentUser;
  return db.collection('users').doc(user.uid).update({
    interests: interests,
  });
}

export {
  fetchUserData,
  createUser,
  updateUserPhotoAndName,
  logout,
  updateInterests,
};
