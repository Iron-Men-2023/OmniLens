import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/storage';
import {db, storage, auth} from '../firebaseConfig';
import {Platform} from 'react-native';
import {apiUrl, defaultAvatar} from '../../config';
import {faker} from '@faker-js/faker';
import {manipulateAsync} from "expo-image-manipulator";
import * as ImageManipulator from "expo-image-manipulator";

async function fetchUserData() {
    let userData = {};
    const user = auth.currentUser;
    userData.userInfo = user;

    // Get the user's idToken
    const userRef = await db.collection('users').doc(user.uid);

    await userRef
        .get()
        .then(async doc => {
            if (!doc.exists) {
                console.log('User does not exist', doc);
            } else {
                userData.userDoc = doc.data();
            }
        })
        .catch(e => {
            console.log('Error getting document', e);
        });
    return userData;
}

async function getUserById(uid) {
    let userData = {};
    const userRef = await db.collection('users').doc(uid);
    if (!userRef) {
        return null;
    }
    await userRef
        .get()
        .then(async doc => {
            if (!doc.exists) {
                console.log('User does not exist', uid);
                return null;
            } else {
                userData.userDoc = doc.data();
                let userExists = true;
                return userData;
            }
        })
        .catch(e => {
            return null;
        });
    if (userData.userDoc === undefined) {
        return null;
    }
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

function createUser(name, photoURL, interests) {
    const user = auth.currentUser;
    if (!user) {
        return;
    }
    let photo = defaultAvatar;
    let username = user.email.split('@')[0];
    return db.collection('users').doc(user.uid).set({
        email: user.email,
        name: name,
        username: username,
        avatarPhotoUrl: photoURL,
        coverPhotoUrl: photo,
        bio: 'Please Edit Me!',
        uid: user.uid,
        interests: interests,
        friendRequests: null,
        friends: null,
        recents: null,
        instagram: 'https://www.instagram.com/',
        twitter: 'https://twitter.com/',
        facebook: 'https://www.facebook.com/',
        linkedin: 'https://www.linkedin.com/',
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
    // Update the document with the updated interests array
    return userRef.update({
        recents: currentRecents,
    });
}

async function setImageForUser(user, photo, type) {
    if (!user) {
        return;
    }
    if (type === 'Avatar') {
        await db.collection('users').doc(user.uid).update({
            avatarPhotoUrl: photo,
        });
        return;
    } else if (type === 'Cover') {
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

const generateFakeChats = async (numberOfChats = 5, messagesPerUser = 5) => {
    const currentUser = auth.currentUser;
    const batch = db.batch();

    for (let i = 0; i < numberOfChats; i++) {
        // Create a fake chat
        const chatRef = db.collection('chats').doc();
        const fakeChat = {
            name: faker.name.fullName(),
            imageUrl: faker.image.avatar(),
            lastMessage: faker.lorem.sentence(),
        };
        batch.set(chatRef, fakeChat);

        // Generate fake messages for each user
        for (let j = 0; j < messagesPerUser * 2; j++) {
            const messageRef = chatRef.collection('messages').doc();
            const fakeMessage = {
                _id: messageRef.id,
                text: faker.lorem.sentence(),
                createdAt: firebase.firestore.Timestamp.fromDate(faker.date.past()),
                received: faker.datatype.boolean(),
                user: j % 2 === 0
                    ? {
                        _id: currentUser.uid,
                        name: currentUser.displayName,
                        avatar: currentUser.photoURL,
                    }
                    : {
                        _id: faker.random.alphaNumeric(14),
                        name: fakeChat.name,
                        avatar: fakeChat.imageUrl,
                    },
            };
            batch.set(messageRef, fakeMessage);
        }
    }

    // Commit the batch
    await batch.commit();
};

async function uriToBase64(uri) {
    const resizedImage = await manipulateAsync(
        uri,
        [{resize: {width: 600}}],
        {compress: 1, format: ImageManipulator.SaveFormat.JPEG},
    );
    const response = await fetch(resizedImage.uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort();
            reject(new Error('Problem parsing input file.'));
        };
        reader.onload = () => {
            resolve(reader.result.split(',')[1]);
        };
        reader.readAsDataURL(blob);
    });
}

async function fetchApiData(jsonData, path) {
    // console.log('json data: ', jsonData);
    try {
        const response = await fetch(`${apiUrl}${path}`, {
            method: 'POST',
            // Send form data
            headers: {'Content-Type': 'multipart/form-data'},
            // headers: {'Content-Type': 'application/data'},
            body: jsonData,
        });
        return response.ok ? await response.json() : null;
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function getChatGivenUsers(user1Id, user2Id) {
    try {
        const chatsSnapshot = await db.collection('chats')
            .where('users', 'array-contains', user1Id)
            .get();

        let chat = null;

        chatsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.users.includes(user2Id)) {
                chat = {id: doc.id, data};
            }
        });

        if (chat) {
            return chat;
        } else {
            const newChat = await db.collection('chats').add({
                lastMessage: '',
                users: [user1Id, user2Id],
                name: '',
                lastMessageUserId: '',
            });

            return {
                id: newChat.id,
                data: {
                    lastMessage: '',
                    users: [user1Id, user2Id],
                    name: '',
                    lastMessageUserId: '',
                },
            };
        }
    } catch (error) {
        console.error('Error getting or creating chat:', error);
        return null;
    }
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
    generateFakeChats,
    uriToBase64,
    fetchApiData,
    getChatGivenUsers,
};
