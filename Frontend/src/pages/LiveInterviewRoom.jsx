/*
------------------------------------------------
File: LiveInterviewRoom.jsx
Purpose: Real-time 1-on-1 WebRTC Live Video & Audio Mock Interview Room.
Responsibilities: Manages WebRTC peer connection with STUN & TURN relay fallbacks, ICE candidate queuing, dual video feeds, audio stream, and live teacher scoring panel.
Dependencies: react, react-router-dom, axiosClient, lucide-react
------------------------------------------------
*/

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, Award, CheckCircle, 
  User, Clock, MessageSquare, AlertCircle, Sparkles, Sliders, RefreshCw 
} from 'lucide-react';

const LiveInterviewRoom = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userRole, setUserRole] = useState('STUDENT');
  const [peerId, setPeerId] = useState(null);

  // WebRTC & Media States
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [connected, setConnected] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Faculty Live Evaluation Scorecard
  const [commScore, setCommScore] = useState(80);
  const [techScore, setTechScore] = useState(85);
  const [confScore, setConfScore] = useState(75);
  const [facultyFeedback, setFacultyFeedback] = useState('');
  const [submittingEval, setSubmittingEval] = useState(false);
  const [evalSuccess, setEvalSuccess] = useState(false);

  // Refs for WebRTC & Polling
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const timerRef = useRef(null);
  const iceCandidatesQueueRef = useRef([]);

  // Fetch session details & user profile
  useEffect(() => {
    const initRoom = async () => {
      try {
        const profileRes = await axiosClient.get('/auth/profile');
        if (profileRes.data.success) {
          const user = profileRes.data.user;
          setCurrentUserId(user.user_id);
          setUserRole(user.role);

          const sessionRes = await axiosClient.get(`/live-interview/session/${sessionId}`);
          if (sessionRes.data.success) {
            const sess = sessionRes.data.session;
            setSession(sess);

            // Determine target peer ID
            const isFaculty = user.role === 'FACULTY' || user.role === 'ADMIN' || user.user_id === sess.faculty_id;
            const targetPeerId = isFaculty ? sess.student_id : sess.faculty_id;
            setPeerId(targetPeerId);

            // Update status to LIVE if scheduled
            if (sess.status === 'SCHEDULED') {
              axiosClient.put(`/live-interview/status/${sessionId}`, { status: 'LIVE' });
            }
          }
        }
      } catch (err) {
        console.error('Room init error:', err);
        setErrorMsg('Failed to initialize live room. Please check your connection.');
      }
    };

    initRoom();
  }, [sessionId]);

  // Callback Ref for Local Video element
  const setLocalVideoRef = (node) => {
    localVideoRef.current = node;
    if (node && localStream) {
      node.srcObject = localStream;
      node.muted = true;
      node.play().catch(e => console.log('Local video play check:', e));
    }
  };

  // Callback Ref for Remote Video element
  const setRemoteVideoRef = (node) => {
    remoteVideoRef.current = node;
    if (node && remoteStream) {
      node.srcObject = remoteStream;
      node.play().catch(e => console.log('Remote video play check:', e));
    }
  };

  // Bind localStream to video element whenever localStream updates
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.muted = true;
      localVideoRef.current.play().catch(e => console.log('Local video effect play:', e));
    }
  }, [localStream]);

  // Bind remoteStream to video element whenever remoteStream updates
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(e => console.log('Remote video effect play:', e));
    }
  }, [remoteStream]);

  // Manual Trigger to Send WebRTC SDP Offer (Used by Faculty or via Re-connect Button)
  const initiateOffer = async () => {
    if (!pcRef.current || !peerId) return;
    try {
      console.log('Initiating WebRTC SDP offer...');
      const offer = await pcRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await pcRef.current.setLocalDescription(offer);
      await axiosClient.post('/live-interview/signal/send', {
        sessionId,
        receiverId: peerId,
        signalType: 'offer',
        payload: offer
      });
    } catch (e) {
      console.error('Initiate offer error:', e);
    }
  };

  // Process any queued ICE candidates after remote description is attached
  const flushIceCandidates = async () => {
    if (pcRef.current && pcRef.current.remoteDescription && iceCandidatesQueueRef.current.length > 0) {
      console.log(`Flushing ${iceCandidatesQueueRef.current.length} queued ICE candidates...`);
      while (iceCandidatesQueueRef.current.length > 0) {
        const cand = iceCandidatesQueueRef.current.shift();
        try {
          await pcRef.current.addIceCandidate(cand);
        } catch (e) {
          console.error('Buffered ICE candidate add error:', e);
        }
      }
    }
  };

  // Start Media Stream & WebRTC Engine
  useEffect(() => {
    if (!currentUserId || !peerId) return;

    let isMounted = true;

    const setupMediaAndWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (!isMounted) return;

        setLocalStream(stream);

        // Bind directly to video element ref if available
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.muted = true;
          localVideoRef.current.play().catch(console.error);
        }

        // Initialize PeerConnection with STUN & TURN Relay servers
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            {
              urls: 'turn:openrelay.metered.ca:80',
              username: 'openrelayproject',
              credential: 'openrelayproject'
            },
            {
              urls: 'turn:openrelay.metered.ca:443',
              username: 'openrelayproject',
              credential: 'openrelayproject'
            },
            {
              urls: 'turns:openrelay.metered.ca:443?transport=tcp',
              username: 'openrelayproject',
              credential: 'openrelayproject'
            }
          ]
        });
        pcRef.current = pc;

        // Add local tracks to PeerConnection
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // Listen for remote tracks
        pc.ontrack = (event) => {
          console.log('Remote WebRTC track received:', event.streams);
          if (event.streams && event.streams[0]) {
            setRemoteStream(event.streams[0]);
            setConnected(true);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0];
              remoteVideoRef.current.play().catch(console.error);
            }
          }
        };

        // Handle connection & ICE state changes
        pc.onconnectionstatechange = () => {
          console.log('WebRTC Connection State:', pc.connectionState);
          if (pc.connectionState === 'connected') {
            setConnected(true);
          } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            setConnected(false);
          }
        };

        pc.oniceconnectionstatechange = () => {
          console.log('WebRTC ICE State:', pc.iceConnectionState);
          if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
            setConnected(true);
          }
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            axiosClient.post('/live-interview/signal/send', {
              sessionId,
              receiverId: peerId,
              signalType: 'ice-candidate',
              payload: event.candidate
            }).catch(console.error);
          }
        };

        // Send a "join-room" signal so peer knows we are online
        axiosClient.post('/live-interview/signal/send', {
          sessionId,
          receiverId: peerId,
          signalType: 'join-room',
          payload: { joinedAt: new Date() }
        }).catch(console.error);

        // Determine if this user is the initiator (Faculty / Admin)
        const isInitiator = userRole === 'FACULTY' || userRole === 'ADMIN' || currentUserId === session?.faculty_id;
        if (isInitiator) {
          // Send initial offer
          setTimeout(() => {
            initiateOffer();
          }, 1000);
        }

        // Signaling Poller (Polls every 1.5 seconds)
        pollIntervalRef.current = setInterval(async () => {
          try {
            const sigRes = await axiosClient.get(`/live-interview/signal/poll/${sessionId}`);
            if (sigRes.data.success && sigRes.data.signals && sigRes.data.signals.length > 0) {
              for (const sig of sigRes.data.signals) {
                if (sig.signal_type === 'join-room') {
                  console.log('Peer joined room signal received');
                  if (isInitiator && (!pc.remoteDescription || pc.connectionState !== 'connected')) {
                    initiateOffer();
                  }
                } else if (sig.signal_type === 'offer') {
                  console.log('Incoming SDP offer received');
                  await pc.setRemoteDescription(new RTCSessionDescription(sig.payload));
                  await flushIceCandidates();
                  const answer = await pc.createAnswer();
                  await pc.setLocalDescription(answer);
                  await axiosClient.post('/live-interview/signal/send', {
                    sessionId,
                    receiverId: peerId,
                    signalType: 'answer',
                    payload: answer
                  });
                } else if (sig.signal_type === 'answer') {
                  console.log('Incoming SDP answer received');
                  if (pc.signalingState === 'have-local-offer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(sig.payload));
                    await flushIceCandidates();
                    setConnected(true);
                  }
                } else if (sig.signal_type === 'ice-candidate') {
                  const candidate = new RTCIceCandidate(sig.payload);
                  if (pc.remoteDescription) {
                    try {
                      await pc.addIceCandidate(candidate);
                    } catch (iceErr) {
                      console.error('ICE candidate add error:', iceErr);
                    }
                  } else {
                    iceCandidatesQueueRef.current.push(candidate);
                  }
                }
              }
            }
          } catch (pollErr) {
            console.error('Signal poll error:', pollErr);
          }
        }, 1500);

      } catch (err) {
        console.error('WebRTC initialization error:', err);
        setErrorMsg('Unable to access camera/microphone. Please allow browser permissions to enter the live interview room.');
      }
    };

    setupMediaAndWebRTC();

    // Timer counter
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(pollIntervalRef.current);
      clearInterval(timerRef.current);
      if (pcRef.current) {
        pcRef.current.close();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentUserId, peerId, userRole, session]);

  const toggleMuteAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleMuteVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoMuted(!videoTrack.enabled);
      }
    }
  };

  const handleEndCall = () => {
    if (pcRef.current) pcRef.current.close();
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    navigate('/live-interview/schedule');
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    setSubmittingEval(true);
    try {
      const res = await axiosClient.post(`/live-interview/evaluate/${sessionId}`, {
        commScore,
        techScore,
        confScore,
        feedback: facultyFeedback
      });

      if (res.data.success) {
        setEvalSuccess(true);
        setTimeout(() => {
          handleEndCall();
        }, 1500);
      }
    } catch (err) {
      console.error('Evaluation submission error:', err);
      alert('Failed to submit evaluation. Please try again.');
    } finally {
      setSubmittingEval(false);
    }
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const overallCalculated = Math.round((parseInt(commScore) + parseInt(techScore) + parseInt(confScore)) / 3);

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="p-4 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-md flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-850 dark:text-white flex items-center gap-2">
              <span>{session?.title || 'Live 1-on-1 Mock Interview Room'}</span>
              <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                LIVE STREAM
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {userRole === 'STUDENT'
                ? `Faculty Mentor: ${session?.faculty_name || 'Connecting...'}`
                : `Student Candidate: ${session?.student_name || 'Connecting...'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={initiateOffer}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
            title="Manually trigger WebRTC camera re-handshake"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-connect Live Video</span>
          </button>

          <div className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-rose-500" />
            <span>Duration: {formatTimer(elapsedTime)}</span>
          </div>

          <button
            onClick={handleEndCall}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/20 transition-all"
          >
            <PhoneOff className="w-4 h-4" />
            Leave Room
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Live Room Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Video Feeds */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Remote Video Stream (Candidate or Faculty) */}
          <div className="relative w-full h-96 bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-2xl flex items-center justify-center">
            {remoteStream ? (
              <video
                ref={setRemoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-8 space-y-3">
                <div className="h-20 w-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-500/20 animate-pulse">
                  <User className="w-10 h-10" />
                </div>
                <p className="font-extrabold text-sm text-slate-300">
                  Waiting for {userRole === 'STUDENT' ? 'Faculty Mentor' : 'Student Candidate'} to connect live...
                </p>
                <p className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-500" />
                  Establishing WebRTC peer connection handshake over STUN/TURN...
                </p>
                <button
                  onClick={initiateOffer}
                  className="mt-2 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-black uppercase tracking-wider transition-all inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Click to Force Video Handshake Now
                </button>
              </div>
            )}

            {/* Remote Overlay Badge */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
              <span>{userRole === 'STUDENT' ? `Faculty: ${session?.faculty_name || 'Connecting...'}` : `Candidate: ${session?.student_name || 'Connecting...'}`}</span>
            </div>
          </div>

          {/* Lower Bar: Local Video & Clear Camera/Mic Action Buttons */}
          <div className="p-4 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-4">
            {/* Local Video Thumbnail */}
            <div className="flex items-center gap-3">
              <div className="w-28 h-20 bg-slate-900 rounded-2xl overflow-hidden border-2 border-rose-500/40 relative shadow-inner">
                <video
                  ref={setLocalVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                <span className="absolute bottom-1.5 left-1.5 text-[9px] font-black bg-black/80 text-white px-2 py-0.5 rounded-md">
                  You ({videoMuted ? 'Cam Off' : 'Cam Live'})
                </span>
              </div>
              <div>
                <p className="font-extrabold text-xs text-slate-850 dark:text-white">Your Camera Preview</p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  {videoMuted ? '🔴 Camera Off' : '🟢 Camera Streaming'} • {audioMuted ? '🔴 Mic Muted' : '🟢 Mic Unmuted'}
                </p>
              </div>
            </div>

            {/* Clear Labeled Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Mic Toggle Button */}
              <button
                onClick={toggleMuteAudio}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all transform hover:scale-105 ${
                  audioMuted 
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/30 shadow-md shadow-rose-500/10' 
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                }`}
              >
                {audioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{audioMuted ? 'Mic: MUTED' : 'Mic: UNMUTED'}</span>
              </button>

              {/* Camera Toggle Button */}
              <button
                onClick={toggleMuteVideo}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all transform hover:scale-105 ${
                  videoMuted 
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/30 shadow-md shadow-rose-500/10' 
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                }`}
              >
                {videoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                <span>{videoMuted ? 'Camera: OFF' : 'Camera: ON'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Faculty Live Evaluation Panel OR Student Status */}
        <div className="lg:col-span-1 space-y-6">
          {userRole === 'FACULTY' || userRole === 'ADMIN' ? (
            <div className="p-6 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-md space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-150 dark:border-slate-800/60">
                <h3 className="font-black text-sm text-slate-850 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Live Teacher Evaluation Panel
                </h3>
                <span className="text-[10px] font-black px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 uppercase">
                  Score: {overallCalculated}%
                </span>
              </div>

              <form onSubmit={handleSubmitEvaluation} className="space-y-5">
                {/* Communication Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-black text-slate-700 dark:text-slate-300">
                    <span>Communication & Speech</span>
                    <span className="text-blue-500">{commScore}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={commScore} 
                    onChange={e => setCommScore(e.target.value)} 
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Technical Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-black text-slate-700 dark:text-slate-300">
                    <span>Technical & STAR Logic</span>
                    <span className="text-purple-500">{techScore}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={techScore} 
                    onChange={e => setTechScore(e.target.value)} 
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Confidence Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-black text-slate-700 dark:text-slate-300">
                    <span>Body Language & Confidence</span>
                    <span className="text-amber-500">{confScore}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={confScore} 
                    onChange={e => setConfScore(e.target.value)} 
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Teacher Feedback Notes */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Live Teacher Feedback & Actionable Notes
                  </label>
                  <textarea
                    rows="4"
                    value={facultyFeedback}
                    onChange={e => setFacultyFeedback(e.target.value)}
                    placeholder="Provide specific feedback on student's spoken pitch, STAR method structure, and tone..."
                    className="w-full p-3.5 border border-slate-200 dark:border-slate-800 dark:bg-[#0a0f1d] bg-transparent rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none placeholder-slate-400 text-slate-800 dark:text-slate-200"
                  />
                </div>

                {evalSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-black flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Evaluation submitted! Redirecting...
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingEval}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {submittingEval ? 'Submitting Scorecard...' : 'Submit Scorecard & Complete'}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-6 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-md space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-150 dark:border-slate-800/60">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">Live Session In Progress</h3>
                  <p className="text-xs text-slate-400">Faculty is watching & listening live</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800/50 space-y-3">
                <p className="text-xs font-black text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Spoken Pitch Instructions
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  1. Speak clearly into your microphone.<br />
                  2. Maintain direct eye contact with your camera.<br />
                  3. Structure your answers using the **STAR Method** (Situation, Task, Action, Result).<br />
                  4. Your faculty mentor will rate your performance live and issue a scorecard upon completion.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveInterviewRoom;
