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
  let photo =
    'https://firebasestorage.googleapis.com/v0/b/omnilens-d5745.appspot.com/o/images%2Flogo.png?alt=media&token=33463096-3586-4e32-86a4-213fdeabe8a9';
  let username = user.email.split('@')[0];
  return db.collection('users').doc(user.uid).set({
    email: user.email,
    name: user.displayName,
    username: username,
    avatarPhotoUrl: photo,
    coverPhotoUrl: photo,
    bio: '',
    uid: user.uid,
    interests: [],
    friendRequests: [],
    friends: [],
    recents: [],
  });
}

async function updateUserName(user, name) {
  if (!user) {
    return;
  }
  return db.collection('users').doc(user.uid).update({
    name: name,
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
  console.log('user', user);
  console.log('photo', photo);
  console.log('type', type);
  if (type === 'Avatar') {
    await db.collection('users').doc(user.uid).update({
      avatarPhotoUrl: photo,
    });
    return;
  }
  await db.collection('users').doc(user.uid).update({
    coverPhotoUrl: photo,
  });
  return;
}

async function getAllUsersData(users) {
  if (!users) {
    return;
  }
  const usersRequested = [];
  const usersRef = db.collection('users');
  const allUsers = await usersRef.get();
  allUsers.docs.map(doc => {
    users.forEach(user => {
      if (doc.id === user) {
        usersRequested.push(doc.data());
      }
    });
  });
  return usersRequested;
}

async function addRecents() {
  const users = [];
  const docs = await db.collection('users').get();
  docs.forEach(doc => {
    users.push({id: doc.id, ...doc.data()});
  });
  const batch = db.batch();
  users.forEach(user => {
    const userRef = db.collection('users').doc(user.id);
    batch.update(userRef, {
      recents: firebase.firestore.FieldValue.arrayUnion(new Date().getTime()),
    });
  });
  batch
    .commit()
    .then(() => {
      console.log('Recents field updated successfully');
    })
    .catch(error => {
      console.error('Error updating recents field:', error);
    });
}

export {
  fetchUserData,
  createUser,
  updateUserName,
  logout,
  updateInterests,
  setImageForUser,
  getAllUsersData,
  addRecents,
};
