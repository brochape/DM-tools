import React, { useEffect, useRef, useState, VideoHTMLAttributes } from 'react';
import { FunctionComponent } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
    srcObject: MediaStream;
};

export default function Video({ srcObject, ...props }: PropsType) {
    const refVideo = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        console.log('video stream set');
        if (!refVideo.current) return;
        refVideo.current.srcObject = srcObject;
    }, [srcObject]);

    return <video ref={refVideo} {...props} />;
}

export const VideoPage: FunctionComponent = () => {
    const firebaseConfig = {
        apiKey: 'AIzaSyC9DxmeKbSAY9HFZ2NBzVRhzN0UjxSU5Bs',
        authDomain: 'webrtc-test-480b3.firebaseapp.com',
        projectId: 'webrtc-test-480b3',
        storageBucket: 'webrtc-test-480b3.appspot.com',
        messagingSenderId: '982478263213',
        appId: '1:982478263213:web:ba60f0dcc6eaf1bd60c724',
        measurementId: 'G-CLX18X1XQD',
    };

    const [callButtonDisabled, setCallButtonDisabled] = useState<boolean>(true);
    const [answerButtonDisabled, setAnswerButtonDisabled] = useState<boolean>(
        true
    );
    const [webcamButtonDisabled, setWebcamButtonDisabled] = useState<boolean>(
        false
    );
    const [hangupButtonDisabled, setHangupButtonDisabled] = useState<boolean>(
        false
    );

    const [localStream, setLocalStream] = useState<MediaStream>(
        new MediaStream()
    );

    const [localVideoStream, setLocalVideoStream] = useState<MediaStream>(
        new MediaStream()
    );

    const [remoteStream, setRemoteStream] = useState<MediaStream>(
        new MediaStream()
    );

    const servers = {
        iceServers: [
            {
                urls: [
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302',
                ],
            },
        ],
        iceCandidatePoolSize: 10,
    };

    let peerConnection;
    const [callId, setCallId] = useState<string>('');

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Global State

    async function createRoom() {
        setCallButtonDisabled(true);
        setAnswerButtonDisabled(true);
        const db = firebase.firestore();
        const roomRef = await db.collection('rooms').doc();

        console.log('Create PeerConnection with configuration: ', servers);
        peerConnection = new RTCPeerConnection(servers);

        registerPeerConnectionListeners();

        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
        });

        // Code for collecting ICE candidates below
        const callerCandidatesCollection = roomRef.collection(
            'callerCandidates'
        );

        peerConnection.addEventListener('icecandidate', (event) => {
            if (!event.candidate) {
                console.log('Got final candidate!');
                return;
            }
            console.log('Got candidate: ', event.candidate);
            callerCandidatesCollection.add(event.candidate.toJSON());
        });
        // Code for collecting ICE candidates above

        // Code for creating a room below
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log('Created offer:', offer);

        const roomWithOffer = {
            offer: {
                type: offer.type,
                sdp: offer.sdp,
            },
        };
        await roomRef.set(roomWithOffer);
        console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
        setCallId(roomRef.id);
        // Code for creating a room above

        peerConnection.addEventListener('track', (event) => {
            console.log('Got remote track:', event.streams[0]);
            event.streams[0].getTracks().forEach((track) => {
                console.log('Add a track to the remoteStream:', track);
                remoteStream.addTrack(track);
            });
        });

        // Listening for remote session description below
        roomRef.onSnapshot(async (snapshot) => {
            const data = snapshot.data();
            if (
                !peerConnection.currentRemoteDescription &&
                data &&
                data.answer
            ) {
                console.log('Got remote description: ', data.answer);
                const rtcSessionDescription = new RTCSessionDescription(
                    data.answer
                );
                await peerConnection.setRemoteDescription(
                    rtcSessionDescription
                );
            }
        });
        // Listening for remote session description above

        // Listen for remote ICE candidates below
        roomRef.collection('calleeCandidates').onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === 'added') {
                    let data = change.doc.data();
                    console.log(
                        `Got new remote ICE candidate: ${JSON.stringify(data)}`
                    );
                    await peerConnection.addIceCandidate(
                        new RTCIceCandidate(data)
                    );
                }
            });
        });
        // Listen for remote ICE candidates above
    }

    async function joinRoom() {
        setCallButtonDisabled(true);
        setAnswerButtonDisabled(true);

        console.log('Join room: ', callId);
        // document.querySelector(
        //     '#currentRoom'
        // ).innerText = `Current room is ${roomId} - You are the callee!`;
        await joinRoomById(callId);
        // roomDialog.open();
    }

    async function joinRoomById(roomId) {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(`${roomId}`);
        const roomSnapshot = await roomRef.get();
        console.log('Got room:', roomSnapshot.exists);

        if (roomSnapshot.exists) {
            console.log('Create PeerConnection with configuration: ', servers);
            peerConnection = new RTCPeerConnection(servers);
            registerPeerConnectionListeners();
            localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream);
            });

            // Code for collecting ICE candidates below
            const calleeCandidatesCollection = roomRef.collection(
                'calleeCandidates'
            );
            peerConnection.addEventListener('icecandidate', (event) => {
                if (!event.candidate) {
                    console.log('Got final candidate!');
                    return;
                }
                console.log('Got candidate: ', event.candidate);
                calleeCandidatesCollection.add(event.candidate.toJSON());
            });
            // Code for collecting ICE candidates above

            peerConnection.addEventListener('track', (event) => {
                console.log('Got remote track:', event.streams[0]);
                event.streams[0].getTracks().forEach((track) => {
                    console.log('Add a track to the remoteStream:', track);
                    remoteStream.addTrack(track);
                });
            });

            // Code for creating SDP answer below
            const offer = roomSnapshot?.data()?.offer;
            console.log('Got offer:', offer);
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(offer)
            );
            const answer = await peerConnection.createAnswer();
            console.log('Created answer:', answer);
            await peerConnection.setLocalDescription(answer);

            const roomWithAnswer = {
                answer: {
                    type: answer.type,
                    sdp: answer.sdp,
                },
            };
            await roomRef.update(roomWithAnswer);
            // Code for creating SDP answer above

            // Listening for remote ICE candidates below
            roomRef.collection('callerCandidates').onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(async (change) => {
                    if (change.type === 'added') {
                        let data = change.doc.data();
                        console.log(
                            `Got new remote ICE candidate: ${JSON.stringify(
                                data
                            )}`
                        );
                        await peerConnection.addIceCandidate(
                            new RTCIceCandidate(data)
                        );
                    }
                });
            });
            // Listening for remote ICE candidates above
        }
    }

    async function openUserMedia(e) {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        setLocalStream(stream);
        setLocalVideoStream(new MediaStream(stream.getVideoTracks()));
        setRemoteStream(new MediaStream());

        console.log('Stream:', localStream);
        setWebcamButtonDisabled(true);
        setAnswerButtonDisabled(false);
        setCallButtonDisabled(false);
        setHangupButtonDisabled(false);
    }

    async function hangUp(e) {
        const tracks = localStream.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });

        if (remoteStream) {
            remoteStream.getTracks().forEach((track) => track.stop());
        }

        if (peerConnection) {
            peerConnection.close();
        }

        setCallButtonDisabled(true);
        setAnswerButtonDisabled(true);

        // document.querySelector('#localVideo').srcObject = null;
        // document.querySelector('#remoteVideo').srcObject = null;
        // document.querySelector('#cameraBtn').disabled = false;
        // document.querySelector('#joinBtn').disabled = true;
        // document.querySelector('#createBtn').disabled = true;
        // document.querySelector('#hangupBtn').disabled = true;
        // document.querySelector('#currentRoom').innerText = '';

        // Delete room on hangup
        if (callId) {
            const db = firebase.firestore();
            const roomRef = db.collection('rooms').doc(callId);
            const calleeCandidates = await roomRef
                .collection('calleeCandidates')
                .get();
            calleeCandidates.forEach(async (candidate) => {
                await candidate.ref.delete();
            });
            const callerCandidates = await roomRef
                .collection('callerCandidates')
                .get();
            callerCandidates.forEach(async (candidate) => {
                await candidate.ref.delete();
            });
            await roomRef.delete();
        }

        document.location.reload(true);
    }

    function registerPeerConnectionListeners() {
        peerConnection.addEventListener('icegatheringstatechange', () => {
            console.log(
                `ICE gathering state changed: ${peerConnection.iceGatheringState}`
            );
        });

        peerConnection.addEventListener('connectionstatechange', () => {
            console.log(
                `Connection state change: ${peerConnection.connectionState}`
            );
        });

        peerConnection.addEventListener('signalingstatechange', () => {
            console.log(
                `Signaling state change: ${peerConnection.signalingState}`
            );
        });

        peerConnection.addEventListener('iceconnectionstatechange ', () => {
            console.log(
                `ICE connection state change: ${peerConnection.iceConnectionState}`
            );
        });
    }

    const updateInput = (event) => {
        setCallId(event.target.value);
    };

    return (
        <div className={'mainPage'}>
            <h2>1. Start your Webcam</h2>
            <div className="videos">
                <span>
                    <h3>Local Stream</h3>
                    {localVideoStream && (
                        <Video
                            id="webcamVideo"
                            autoPlay
                            playsInline
                            srcObject={localVideoStream}
                        />
                    )}
                </span>
                <span>
                    <h3>Remote Stream</h3>
                    {remoteStream && (
                        <Video
                            id="remoteVideo"
                            autoPlay
                            playsInline
                            srcObject={remoteStream}
                        />
                    )}
                </span>
            </div>

            <button
                id="webcamButton"
                disabled={webcamButtonDisabled}
                onClick={openUserMedia}
            >
                Start webcam
            </button>
            <h2>2. Create a new Call</h2>
            <button
                id="callButton"
                disabled={callButtonDisabled}
                onClick={createRoom}
            >
                Create Call (offer)
            </button>

            <h2>3. Join a Call</h2>
            <p>Answer the call from a different browser window or device</p>

            <input id="callInput" value={callId} onChange={updateInput} />
            <button
                id="answerButton"
                disabled={answerButtonDisabled}
                onClick={joinRoom}
            >
                Answer
            </button>

            <h2>4. Hangup</h2>

            <button
                id="hangupButton"
                disabled={hangupButtonDisabled}
                onClick={hangUp}
            >
                Hangup
            </button>
        </div>
    );
};
