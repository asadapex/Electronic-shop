import { Injectable } from '@nestjs/common';
import DeviceDetector from 'device-detector-js';

@Injectable()
export class DeviceDetectorService {
  private deviceDetector = new DeviceDetector();

  detect(userAgent: string) {
    return this.deviceDetector.parse(userAgent);
  }
}
