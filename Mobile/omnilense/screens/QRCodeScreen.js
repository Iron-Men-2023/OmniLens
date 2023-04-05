import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Appbar, Text, Card} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import {db, auth} from '../config/firebaseConfig';

const QRCodeScreen = ({navigation}) => {
    const [qrData, setQRData] = useState(null);

    useEffect(() => {
        generateQRData().then(r => console.log('QR code generated'));
    }, []);

    const generateQRData = async () => {
        const data = {
            userId: auth.currentUser.uid,
            deviceId: 'your-device-id',
        };
        const jsonString = JSON.stringify(data);
        setQRData(jsonString);
    };

    return (
        <>
            {/*<Appbar.Header style={styles.appBar}>*/}
            {/*    <Appbar.BackAction style={styles.backAction} onPress={() => navigation.navigate('Feed')}/>*/}
            {/*</Appbar.Header>*/}
            <View style={styles.container}>
                {qrData ? (
                    <>
                        <Text style={styles.header}>Scan this QR code to register your device:</Text>
                        <Card style={styles.card}>
                            <Card.Content style={styles.cardContent}>
                                <QRCode value={qrData} size={200}/>
                            </Card.Content>
                        </Card>
                    </>
                ) : (
                    <Text>Loading QR code...</Text>
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    cardContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    appBar: {
        backgroundColor: 'transparent',
        flex: 1,
        elevation: 0,
        justifyContent: 'flex-start',
        paddingTop: 0,

    },
});

export default QRCodeScreen;
