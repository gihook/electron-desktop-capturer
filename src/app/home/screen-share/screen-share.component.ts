import { Component, OnInit } from '@angular/core';
import { desktopCapturer, DesktopCapturerSource } from 'electron';

@Component({
  selector: 'app-screen-share',
  templateUrl: './screen-share.component.html',
  styleUrls: ['./screen-share.component.scss']
})
export class ScreenShareComponent implements OnInit {

  selectedSource: DesktopCapturerSource;
  list: DesktopCapturerSource[];

  constructor() { }

  ngOnInit() {
    this.desktopCapturing(null);
  }

  desktopCapturing(newSource: string) {
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {

      this.list = sources;
      this.selectedSource = sources[0];
      for (const source of sources) {
        if (source.name === newSource) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
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
            handleStream(stream);
          } catch (e) {
            handleError(e);
          }
          return;
        }
      }
    });

    function handleStream(stream) {
      const video = document.querySelector('video');
      video.srcObject = stream;
      video.onloadedmetadata = (e) => video.play();
    }

    function handleError(e) {
      console.log(e);
    }
  }

  changeScreen(screenName: string) {
    this.desktopCapturing(screenName);
  }


}
