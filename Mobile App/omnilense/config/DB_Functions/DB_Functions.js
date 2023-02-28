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
  //console.log('userId', user.uid);
  //console.log('users', user);
  const userRef = await db.collection('users').doc(user.uid);
  //console.log('userRef', userRef);
  // const userRef = db.collection('users').doc(user.uid);
  await userRef
    .get()
    .then(async doc => {
      if (!doc.exists) {
        console.log('User does not exist', doc);
      } else {
        userData.userDoc = doc.data();
        //console.log('userDoc', doc.data());
      }
      // const postsQuery = await firebase()
      //     .firestore.collection('posts')
      //     .where('userId', '==', user.uid)
      //     .get();
      // userData.postsData = postsQuery.docs.map(doc => doc.data());
    })
    .catch(e => {
      //console.log('Error getting document', e);
    });
  return userData;
}
async function getUserById(uid){
    let userData = {};
    const user = firebase.auth().currentUser;

    // // Get the user's idToken
    const idToken = await user.getIdToken();
    //console.log('userId', user.uid);
    //console.log('users', user);
    const userRef = await db.collection('users').doc(uid);
    //console.log('userRef', userRef);
    // const userRef = db.collection('users').doc(user.uid);
    await userRef
        .get()
        .then(async doc => {
          if (!doc.exists) {
            console.log('User does not exist',uid);
          } else {
            userData.userDoc = doc.data();
           // console.log('userDoc', doc.data());
          }
          // const postsQuery = await firebase()
          //     .firestore.collection('posts')
          //     .where('userId', '==', user.uid)
          //     .get();
          // userData.postsData = postsQuery.docs.map(doc => doc.data());
        })
        .catch(e => {
          //console.log('Error getting document', e);
        });
    return userData;

}
async function getAllUsers() {
  const users = []
  const userRef = await db.collection('users').doc();
  await userRef.get()
      .then(async doc=> {
            console.log(doc.data())
          }
      )
  snapshot.forEach(doc => {
    users.push(doc.data())
  });
  return users
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

async function setImageForUser(user, photo, type) {
  if (!user) {
    return;
  }
  if (type === 'Avatar') {
    return db.collection('users').doc(user.uid).update({
      avatarPhotoUrl: photo,
    });
  }
  return db.collection('users').doc(user.uid).update({
    coverPhotoUrl: photo,
  });
}

export {
  fetchUserData,
  createUser,
  updateUserPhotoAndName,
  logout,
  updateInterests,
  setImageForUser,
  getAllUsers,
  getUserById
};
