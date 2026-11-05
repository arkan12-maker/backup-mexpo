import { Module } from '@nestjs/common';
import { SiteContentsService } from './site-contents.service';
import { SiteContentsController } from './site-contents.controller';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [SiteContentsController],
  providers: [SiteContentsService],
  exports: [SiteContentsService],
})
export class SiteContentsModule {}
