import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { SiteContentsService } from './site-contents.service';
import { UpdateSiteContentDto } from './dto/update-site-content.dto';
import { RoleGuard, Roles } from '../helper/role-guard';
import * as authTypes from '../auth/auth.types';
import { imageFileFilter } from '../helper/upload.format';
import FormatValidation from '../helper/validation.format';

@ApiTags('Site Contents')
@Controller('site-contents')
export class SiteContentsController {
  constructor(private readonly siteContentsService: SiteContentsService) {}

  /**
   * Public: Get all customized site contents
   */
  @Get()
  getAllContents() {
    return this.siteContentsService.getAllContents();
  }

  /**
   * Public: Get content of a specific section (e.g. about_hero, about_story)
   */
  @Get(':section_key')
  getContent(@Param('section_key') sectionKey: string) {
    return this.siteContentsService.getContent(sectionKey);
  }

  /**
   * Superadmin: Update content of a section
   */
  @Put(':section_key')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
  updateContent(
    @Param('section_key') sectionKey: string,
    @Body() dto: UpdateSiteContentDto,
    @Request() req: authTypes.AuthRequest,
  ) {
    return this.siteContentsService.updateContent(
      sectionKey,
      dto.content,
      req.user.uuid,
    );
  }

  /**
   * Superadmin: Upload image for CMS content (hero, gallery, etc.)
   */
  @Post('upload')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  @UseInterceptors(FileInterceptor('file', imageFileFilter))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.siteContentsService.uploadImage(file);
  }
}
