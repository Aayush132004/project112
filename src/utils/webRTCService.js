export default class WebRTCService {
    constructor() {
      this.peerConnection = null;
      this.localStream = null;
      this.remoteStream = null;
      this.onRemoteStreamUpdate = null;
      this.role = null;
      this.socketConnection = null;
      this.iceServers = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'c' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ],
      };
    }
  
    async initialize(role, socketConnection, onRemoteStreamUpdate) {
      this.role = role;
      this.socketConnection = socketConnection;
      this.onRemoteStreamUpdate = onRemoteStreamUpdate;
  
      // Set up socket event listeners
      this.socketConnection.on('offer', async (offer) => {
        if (this.role === 'scribe') {
          await this.handleOffer(offer);
        }
      });
  
      this.socketConnection.on('answer', async (answer) => {
        if (this.role === 'student') {
          await this.handleAnswer(answer);
        }
      });
  
      this.socketConnection.on('ice-candidate', async (candidate) => {
        await this.handleIceCandidate(candidate);
      });
  
      // Get local media stream
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        return this.localStream;
      } catch (error) {
        console.error('Error accessing media devices:', error);
        throw error;
      }
    }
  
    async startCall(targetId) {
      try {
        await this.createPeerConnection();
        
        // Add local tracks to peer connection
        this.localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream);
        });
  
        // If student, create and send offer
        if (this.role === 'student') {
          const offer = await this.peerConnection.createOffer();
          await this.peerConnection.setLocalDescription(offer);
          
          // Send offer to server to forward to the scribe
          this.socketConnection.emit('create-offer', {
            target: targetId,
            offer: offer
          });
        }
      } catch (error) {
        console.error('Error starting call:', error);
        throw error;
      }
    }
  
    async createPeerConnection() {
      this.peerConnection = new RTCPeerConnection(this.iceServers);
      
      // Set up remote stream handling
      this.remoteStream = new MediaStream();
      if (this.onRemoteStreamUpdate) {
        this.onRemoteStreamUpdate(this.remoteStream);
      }
  
      this.peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => {
          this.remoteStream.addTrack(track);
        });
        if (this.onRemoteStreamUpdate) {
          this.onRemoteStreamUpdate(this.remoteStream);
        }
      };
  
      // Handle ICE candidates
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socketConnection.emit('ice-candidate', {
            candidate: event.candidate
          });
        }
      };
  
      // Connection state change handling
      this.peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', this.peerConnection.connectionState);
      };
    }
  
    async handleOffer(offer) {
      try {
        await this.createPeerConnection();
        
        // Add local tracks to peer connection
        this.localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream);
        });
  
        // Set remote description (the offer)
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        
        // Create answer
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        
        // Send answer back
        this.socketConnection.emit('create-answer', {
          answer: answer
        });
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    }
  
    async handleAnswer(answer) {
      try {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  
    async handleIceCandidate(candidate) {
      try {
        if (this.peerConnection) {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    }
  
    endCall() {
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }
      
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
      }
    }
}