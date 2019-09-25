import { fromEvent, Observable } from 'rxjs';
import SimplePeer from 'simple-peer';

export class BetterSimplePeer {
  peer;

  constructor(options: {
    sdpData?: any,
    stream?: MediaStream,
    onConnect: (() => void),
    onRemoteStream: ((stream: MediaStream) => void)
  }) {
    const { sdpData, stream, onConnect, onRemoteStream } = options;
    const initiator = sdpData === undefined;

    this.peer = new SimplePeer({
      initiator,
      stream,
      trickle: false
    });

    this.peer.on('connect', () => onConnect());
    this.peer.on('stream', (remoteStream: MediaStream) => onRemoteStream(remoteStream));
  }

  setSdp(sdp) {
    this.peer.signal(sdp);
  }

  sdp$(): Observable<{ type: string, sdp: string }> {
    return fromEvent(this.peer, 'sdp');
  }
}
