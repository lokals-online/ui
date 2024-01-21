
import { Audio } from 'expo-av';
import { Recording, Sound } from "expo-av/build/Audio";
import { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useBackgammonSession } from "../game/backgammon/BackgammonSessionProvider";
import { usePlayer } from "../player/CurrentPlayer";
import { LOKAL_API_URL, LOKAL_COLORS } from "./LokalConstants";
import { backgammonApi } from '../chirak/chirakApi/game/backgammonApi';

export const PlaySound = () => {
    const [sound, setSound] = useState<Sound>();

    async function playSound() {
        console.log('Loading Sound');
        
        const { sound } = await Audio.Sound.createAsync( require('../../assets/sounds/example.mp3'));
        
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    useEffect(() => {
        return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync();
            }
        : undefined;
    }, [sound]);

    return (
        <View>
            <Button title="Play Sound" onPress={playSound} />
        </View>
    );
}

export const BasKonus = () => {

    const {player, socketClient} = usePlayer();
    const {session} = useBackgammonSession();

    const [recording, setRecording] = useState<Recording>();
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [sound, setSound] = useState<Sound>();

    const blinkProgress = useSharedValue(1);
    const blinkStyle = useAnimatedStyle(() => {
        return {
            opacity: blinkProgress.value
        }
    });

    useEffect(() => {
        if (recording) {
            blinkProgress.value = withRepeat(withTiming(0.5, {duration: 100}), -1, true);
        }
        else {
            blinkProgress.value = 1;
        }
    }, [recording]);

    useEffect(() => {
        socketClient?.subscribe(`/topic/session/backgammon/${session?.id}/voice-message`, async (message: any) => {

            const sessionEvent = JSON.parse(message.body);
    
            if (sessionEvent['senderId'] === player.id) {
                console.log("no need to play for this user!")
                return;
            }

            try {
                // Decode the base64 string to a byte array
                const byteCharacters = atob(sessionEvent['payload']);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);

                // Create a Blob from the byte array
                const blob = new Blob([byteArray], { type: 'audio/webm' });

                const localUri = URL.createObjectURL(blob);

                console.log(blob, localUri);

                const { sound, status } = await Audio.Sound.createAsync(
                    { uri: localUri },
                    { shouldPlay: true }
                );

                await sound.playAsync();
            } catch (error) {
                console.error('Error during sound playback:', error);
            }
        })
    }, [socketClient]);

    const longPress = Gesture.LongPress()
        .minDuration(500)
        .onStart(() => {
            // change color
            startRecording();
        })
        .onEnd((e, success) => {
            if (success) {
                console.log(`Long pressed for ${e.duration} ms!`);
            }
            stopRecording();
        });

    async function startRecording() {
        try {
            if (permissionResponse.status !== 'granted') {
                console.log('Requesting permission..');
                await requestPermission();
            }
            
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.LOW_QUALITY);
            
            setRecording(recording);
            // console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({allowsRecordingIOS: false});
        const uri = recording.getURI();
        console.log('Recording: ', recording);
        
        // Convert the recording file to a blob
        const response = await fetch(uri);
        const blob = await response.blob();
        
        console.log('sending blob: ', blob, uri);

        // Create a FormData object and append the file
        const formData = new FormData();
        formData.append('file', blob, 'recording.m4a'); // Adjust the file name and type as needed

        backgammonApi.session.basKonus(session.id, formData)
    }

    async function playSoundFromByteArray(byteArray) {
        try {
            // Convert the byte array to a Blob
            const blob = new Blob([byteArray], { type: 'audio/m4a' }); // Adjust the MIME type based on your audio format
    
            // Convert the Blob to a local URI
            const localUri = URL.createObjectURL(blob);
    
            // Load the sound
            const { sound } = await Audio.Sound.createAsync(
                { uri: localUri },
                { shouldPlay: true }
            );
    
            // Play the sound
            await sound.playAsync();
        } catch (error) {
            console.error('Error while playing the sound:', error);
        }
    }

    async function playSound(uri) {
        console.log('Loading Sound');
        
        const { sound } = await Audio.Sound.createAsync(uri);
        
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={longPress}>
                <Animated.Text style={[{fontFamily: 'EuropeanTeletext', color: LOKAL_COLORS.NOT_AVAILABLE}, blinkStyle]}>[bas konus]</Animated.Text>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

{/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <LokalTextPrompt text={'['} style={{fontSize: 40}}></LokalTextPrompt>
    <LokalTextPrompt text={'bas konus'} style={{fontSize: 24}}></LokalTextPrompt>
    <LokalTextPrompt text={']'} style={{fontSize: 40}}></LokalTextPrompt>
</View> */}