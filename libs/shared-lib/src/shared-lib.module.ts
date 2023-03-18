import { Module } from '@nestjs/common';
import { SharedService } from './shared-lib.service';

@Module({
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedLibModule {}
