import {auth, storage, db} from '../config/firebaseConfig';
import {
  Alert,
  Platform,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Logo from '../assets/Logo.png';
import {
  fetchUserData,
  setImageForUser,
} from '../config/DB_Functions/DB_Functions';

function SendFriendRequest({senderId, receiverId}) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSendRequest = async () => {
    setIsSending(true);
    setError(null);

    try {
      // Create a new friend request document
      await db.collection('friendRequests').add({
        senderId,
        receiverId,
        status: 'pending',
      });

      console.log('Friend request sent successfully!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      setError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View>
      <Button
        title="Send Friend Request"
        onPress={handleSendRequest}
        disabled={isSending}
      />
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
}

// AcceptRejectFriendRequest component
function AcceptRejectFriendRequest({friendRequestId, senderId, receiverId}) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState(null);

  const handleAcceptRequest = async () => {
    setIsAccepting(true);
    setError(null);

    try {
      // Update the friend request document
      const friendRequestRef = db
        .collection('friendRequests')
        .doc(friendRequestId);
      await friendRequestRef.update({status: 'accepted'});

      // Update the sender's friends list
      const senderRef = db.collection('users').doc(senderId);
      await senderRef.update({
        friends: db.FieldValue.arrayUnion(receiverId),
      });

      // Update the receiver's friends list
      const receiverRef = db.collection('users').doc(receiverId);
      await receiverRef.update({
        friends: db.FieldValue.arrayUnion(senderId),
      });

      console.log('Friend request accepted successfully!');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setError(error.message);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRejectRequest = async () => {
    setIsRejecting(true);
    setError(null);

    try {
      // Update the friend request document
      const friendRequestRef = db
        .collection('friendRequests')
        .doc(friendRequestId);
      await friendRequestRef.update({status: 'rejected'});

      console.log('Friend request rejected successfully!');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      setError(error.message);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <View>
      <Button
        title="Accept Friend Request"
        onPress={handleAcceptRequest}
        disabled={isAccepting || isRejecting}
      />
      <Button
        title="Reject Friend Request"
        onPress={handleRejectRequest}
        disabled={isAccepting || isRejecting}
      />
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
}

export default function FriendsComponent({user}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <SendFriendRequest senderId={user.uid} receiverId="def456" />
        <AcceptRejectFriendRequest
          friendRequestId="ghi789"
          senderId="def456"
          receiverId="abc123"
        />
      </View>
    </View>
  );
}
