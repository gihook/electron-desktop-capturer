import { Component } from '@angular/core';
import { BetterSimplePeer } from '../better-simple-peer';
import { getUserMedia } from '../media-helpers';
import { desktopCapturer, DesktopCapturerSource } from 'electron';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  outgoing: string;
  desktopStream: any = null;
  stream: MediaStream;
  remoteStream: MediaStream;
  peer: BetterSimplePeer;
  newPeer: BetterSimplePeer;
  desktopSources: DesktopCapturerSource[];
  selectedSourceId: string;

  setOutgoing(value: string) {
    this.outgoing = value;
  }

  private createPeer({ sdp, stream }) {
    const peer = new BetterSimplePeer({
      sdpData: sdp,
      stream,
      onRemoteStream: remoteStream => this.remoteStream = remoteStream,
      onConnect: () => console.log('connected')
    });

    return peer;
  }

  setAnswer(sdpValue: string, event) {
    if (!sdpValue) return;

    event.preventDefault();
    const sdp = JSON.parse(sdpValue);
    this.peer.setSdp(sdp);
  }

  setOffer(sdpValue: string, event) {
    if (!sdpValue) return;

    event.preventDefault();
    const sdp = JSON.parse(sdpValue);
    const newPeer = this.createPeer({ stream: this.stream, sdp });
    this.peer = newPeer;
  }

  async turnOnCamera() {
    const stream = await getUserMedia({ audio: true, video: true });
    this.stream = stream;
  }

  async addStreamToConnection() {
    const newPeer = this.createPeer({ stream: this.stream, sdp: undefined });
    this.peer = newPeer;
  }

  async loadSharingOptions() {
    const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
    this.desktopSources = sources;
  }

  async getDesktopStream(sourceId: string) {
    const desktopStream = await (<any>navigator.mediaDevices).getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720
        }
      }
    });

    return desktopStream;
  }

  async setLocalStream(sourceId: string) {
    this.stream = await this.getDesktopStream(sourceId);
    this.selectedSourceId = sourceId;
  }
}
