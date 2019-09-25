import { Component, OnInit } from '@angular/core';
import SimplePeer from 'simple-peer';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-initiator',
  templateUrl: './initiator.component.html',
  styleUrls: ['./initiator.component.scss']
})
export class InitiatorComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.route.snapshot.params.param);
  }

}
