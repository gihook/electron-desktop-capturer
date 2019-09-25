import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {BetterSimplePeer} from '../better-simple-peer';
import {getUserMedia} from '../media-helpers';
import { desktopCapturer, DesktopCapturerSource } from 'electron';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  // @ts-ignore
  @ViewChild('desktopElement') desktopElement: ElementRef;
  outgoing: string;
  desktop: any = null;
  title = 'simple-peer-test';
  msg = 'test';
  stream: MediaStream;
  remoteStream: MediaStream;
  peer: BetterSimplePeer;
  newPeer: BetterSimplePeer;
  selectedSource: String;
  list: DesktopCapturerSource[];
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

  createConnection(): void {
    const isInitiator = true;
    console.log({ isInitiator });

    if (!isInitiator) return;

    this.peer = this.createPeer(isInitiator);
  }

  setOutgoing(value: string) {
    this.outgoing = value;
  }

  private createPeer(isInitiator) {
    const peer = new BetterSimplePeer(isInitiator);
    peer.sdp$().subscribe(sdp => {
      console.log({ sdp });
      this.setOutgoing(JSON.stringify(sdp));
    });

    peer.error$().subscribe(error => console.log({ error }));
    peer.connect$().subscribe(connect => console.log({ connect }));
    peer.tracks$().subscribe(trackData => console.log({ trackData }));

    peer.stream$().subscribe(stream => {
      console.log({ stream });
      this.remoteStream = stream;
    });

    return peer;
  }

  setAnswer(sdpValue: string, event) {
    if (!sdpValue) return;

    console.log('setting answer');
    event.preventDefault();
    const sdp = JSON.parse(sdpValue);
    this.peer.setSdp(sdp);
  }

  setOffer(sdpValue: string, event) {
    if (!sdpValue) return;

    event.preventDefault();
    const sdp = JSON.parse(sdpValue);
    const newPeer = this.createPeer(false);

    if (this.stream) newPeer.addStream(this.stream);

    newPeer.setSdp(sdp);
    this.peer = newPeer;
  }

  send() {
    // this.p.send(this.msg);
    // this.msg = '';
  }

  async turnOnCamera() {
    const stream = await getUserMedia({ audio: true, video: true });
    console.log('turned on');
    console.log({ stream });
    this.stream = stream;
  }

  turnOfCamera() {
    // this.myVideo.nativeElement.srcObject = null;
  }

  async addStreamToConnection() {
    const newPeer = this.createPeer(true);
    newPeer.addStream(this.stream);
    this.peer = newPeer;
  }

  async removeStreamFromConnection() {
    this.peer.removeStream(this.stream);
  }

  addAudioTrack() {
    this.peer.addTrack(this.stream.getAudioTracks()[0], this.stream);
  }

  addVideoTrack() {
    this.peer.addTrack(this.stream.getVideoTracks()[0], this.stream);
  }

  removeVideoTrack() {
    this.peer.removeTrack(this.stream.getVideoTracks()[0], this.stream);
  }

  desktopCapturing(newSource?: string) {
    const that = this;
    desktopCapturer.getSources({types: ['window', 'screen']}).then(async sources => {
      this.list = sources;
      if (newSource === null) {
        newSource = this.list[0].name;
      }
      console.log(this.list);
      this.selectedSource = sources[0].name;
      for (const source of sources) {
        if (source.name === this.list[0].name) {
          try {
            const streamDesktop = await (<any>navigator.mediaDevices).getUserMedia({
              audio: false,
              video:
                {
              mandatory: {
                chromeMediaSource: 'desktop',
                  chromeMediaSourceId: source.id,
                  minWidth: 1280,
                  maxWidth: 1280,
                  minHeight: 720,
                  maxHeight: 720
              }
            }
            });
            console.log('desktop',streamDesktop);
            that.desktopElement.nativeElement.srcObject = streamDesktop;
            that.desktopElement.nativeElement.srcObject.play();

          } catch (e) {
            console.log(e);
          }
          return;
        }
      }
    });

  }
}
