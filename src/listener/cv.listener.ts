import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from './Events/cv.events';
import * as fs from 'fs';

@Injectable()
export class CvListener {
  @OnEvent(EVENTS.CV_ADD)
  async handleCvAdded(payload: any) {
    
    payload['type'] = "cv.added"
    const data = JSON.stringify(payload);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    fetch('https://localhost:9200/cvs/_doc', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ZWxhc3RpYzppUS1yb1dhUG1zN1NqdFBxRXR5dA=='
    },
    body: data,
    })
    

  }
  @OnEvent(EVENTS.CV_UPDATE)
  async handleCvUpdated(payload: any) {
    //save the logs in a file after stringifying the payload
    payload['type'] = "cv.updated"
    const data = JSON.stringify(payload);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    fetch('https://localhost:9200/cvs/_doc', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ZWxhc3RpYzppUS1yb1dhUG1zN1NqdFBxRXR5dA=='
    },
    body: data,
    })
    
  }
  @OnEvent(EVENTS.CV_DELETE)
  async handleCvDeleted(payload: any) {
    //save the logs in a file after stringifying the payload
    payload['type'] = "cv.deleted"
    const data = JSON.stringify(payload);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    fetch('https://localhost:9200/cvs/_doc', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ZWxhc3RpYzppUS1yb1dhUG1zN1NqdFBxRXR5dA=='
    },
    body: data,
    })
   
  }
}