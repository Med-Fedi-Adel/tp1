import { Module } from '@nestjs/common';
import { CvListener } from './cv.listener';

@Module({
    providers: [CvListener],
})
export class ListenerModule {}
