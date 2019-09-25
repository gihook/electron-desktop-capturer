import { Component, OnInit } from '@angular/core';
import { desktopCapturer, DesktopCapturerSource } from 'electron';

@Component({
  selector: 'app-screen-share',
  templateUrl: './screen-share.component.html',
  styleUrls: ['./screen-share.component.scss']
})
export class ScreenShareComponent implements OnInit {

  selectedSource: String;
  list: DesktopCapturerSource[];

  constructor() { }

  ngOnInit() {
    this.desktopCapturing();
  }

  desktopCapturing(newSource?: string) {
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
      this.list = sources;
      if (newSource === null) {
        newSource = this.list[0].name;
      }
      console.log(this.list);
      this.selectedSource = sources[0].name;
      for (const source of sources) {
        if (source.name === newSource) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: true
              // {
              //   mandatory: {
              //     chromeMediaSource: 'desktop',
              //     chromeMediaSourceId: source.id,
              //     minWidth: 1280,
              //     maxWidth: 1280,
              //     minHeight: 720,
              //     maxHeight: 720
              //   }
              // }
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
