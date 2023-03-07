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

async function getUserById(uid) {
  let userData = {};
  const user = auth.currentUser;

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
        console.log('User does not exist', uid);
      } else {
        userData.userDoc = doc.data();
        // console.log('userDoc', doc.data());
      }
    })
    .catch(e => {
      //console.log('Error getting document', e);
    });
  return userData;
}

async function getAllUsers() {
  const users = [];
  const userRef = await db.collection('users').doc();
  await userRef.get().then(async doc => {
    console.log(doc.data());
  });
  snapshot.forEach(doc => {
    users.push(doc.data());
  });
  return users;
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
    instagram: '',
    twitter: '',
    facebook: '',
    linkedin: '',
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

async function updateRecents(recentId) {
  const user = auth.currentUser;
  const userRef = db.collection('users').doc(user.uid);

  // Get the current interests array from the document
  const doc = await userRef.get();
  let currentRecents = doc.data().recents || [];

  // Check if the new interest is already in the array
  const existingIndex = currentRecents.findIndex(int => int === recentId);

  // If the new interest is already in the array, remove it from its current position
  if (existingIndex !== -1) {
    currentRecents.splice(existingIndex, 1);
  }

  // Add the new interest to the beginning of the array
  currentRecents = [recentId, ...currentRecents.slice(0, 10)];
  console.log('currentRecents', currentRecents);
  // Update the document with the updated interests array
  return userRef.update({
    recents: currentRecents,
  });
}

async function setImageForUser(user, photo, type) {
  if (!user) {
    return;
  }
  console.log('photo', photo);
  console.log('type', type);
  if (type === 'Avatar') {
    console.log('avatar');
    await db.collection('users').doc(user.uid).update({
      avatarPhotoUrl: photo,
    });
    return;
  } else if (type === 'Cover') {
    console.log('cover');
    await db.collection('users').doc(user.uid).update({
      coverPhotoUrl: photo,
    });
    return;
  }
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

async function addSocialMediaProfiles() {
  const users = [];
  const docs = await db.collection('users').get();
  docs.forEach(doc => {
    users.push({id: doc.id, ...doc.data()});
  });
  const batch = db.batch();
  users.forEach(user => {
    const userRef = db.collection('users').doc(user.id);
    batch.update(userRef, {
      instagram: '',
      twitter: '',
      facebook: '',
      linkedin: '',
    });
  });
  batch
    .commit()
    .then(() => {
      console.log('Social media field updated successfully');
    })
    .catch(error => {
      console.error('Error updating social media field:', error);
    });
}

async function getUserByName(name) {
  const users = [];
  const snapshot = await db.collection('users').get(); // retrieve all documents from 'users'
  let userData = null;
  await snapshot.forEach(doc => {
    users.push(doc.data());
    if (doc.data().name === name) {
      userData = doc.data();
      return userData;
    }
  });
  return userData;
}

async function sendFriendRequest(userData) {
  const currentUser = auth.currentUser;
  // Check if they are already friends
  const userRef = db.collection('users').doc(currentUser.uid);
  const doc = await userRef.get();
  let currentFriends = doc.data().friends || [];
  const existingIndex = currentFriends.findIndex(int => int === userData.uid);
  if (existingIndex !== -1) {
    console.log('You are already friends');
    return 1;
  }
  // Check if they have already sent a friend request
  const userRef2 = db.collection('users').doc(userData.uid);
  const doc2 = await userRef2.get();
  let currentFriendRequests = doc2.data().friendRequests || [];
  const existingIndex2 = currentFriendRequests.findIndex(
    int => int === currentUser.uid,
  );
  if (existingIndex2 !== -1) {
    console.log('You have already sent a friend request');
    return 2;
  }
  await db
    .collection('users')
    .doc(userData.uid)
    .update({
      friendRequests: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
    })
    .then(r => console.log('Friend request sent successfully!'))
    .catch(e => console.error('Error sending friend request:', e));
}

export {
  fetchUserData,
  createUser,
  updateUserName,
  logout,
  updateInterests,
  setImageForUser,
  getAllUsers,
  getUserById,
  getAllUsersData,
  getUserByName,
  updateRecents,
  sendFriendRequest,
};
