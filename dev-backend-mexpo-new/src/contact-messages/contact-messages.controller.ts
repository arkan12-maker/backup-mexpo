import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ContactMessagesService } from './contact-messages.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { QueryContactMessageDto } from './dto/query-contact-message.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { ReplyContactMessageDto } from './dto/reply-contact-message.dto';
import { RoleGuard, Roles } from '../helper/role-guard';
import * as authTypes from '../auth/auth.types';
import FormatValidation from '../helper/validation.format';

@ApiTags('Contact')
@Controller(['contact-messages', 'contact'])
export class ContactMessagesController {
  constructor(
    private readonly contactMessagesService: ContactMessagesService,
  ) {}

  /**
   * Public contact submission.
   * Also accepts POST /contact-messages or POST /contact (via legacy controller or route alias).
   */
  @Post()
  @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
  create(
    @Body() createContactMessageDto: CreateContactMessageDto,
    @Ip() ip: string,
  ) {
    return this.contactMessagesService.create(createContactMessageDto, ip);
  }

  /**
   * Superadmin: Statistics on contact messages (total, unread, replied, archived).
   */
  @Get('stats')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  getStats() {
    return this.contactMessagesService.getStats();
  }

  /**
   * Superadmin: List messages with pagination, search, and status filter.
   */
  @Get()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  @UsePipes(
    new ValidationPipe({ transform: true, exceptionFactory: FormatValidation }),
  )
  findAll(@Query() query: QueryContactMessageDto) {
    return this.contactMessagesService.findAll(query);
  }

  /**
   * Superadmin: Read single message detail (auto marks as READ).
   */
  @Get(':uuid')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  findOne(@Param('uuid') uuid: string) {
    return this.contactMessagesService.findOne(uuid, true);
  }

  /**
   * Superadmin: Update message status (UNREAD, READ, ARCHIVED).
   */
  @Patch(':uuid/status')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
  updateStatus(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateContactStatusDto,
  ) {
    return this.contactMessagesService.updateStatus(uuid, dto.status);
  }

  /**
   * Superadmin: Reply directly to visitor via email.
   */
  @Post(':uuid/reply')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
  reply(
    @Param('uuid') uuid: string,
    @Body() dto: ReplyContactMessageDto,
    @Request() req: authTypes.AuthRequest,
  ) {
    return this.contactMessagesService.reply(uuid, dto, req.user.uuid);
  }

  /**
   * Superadmin: Delete message.
   */
  @Delete(':uuid')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  remove(@Param('uuid') uuid: string) {
    return this.contactMessagesService.remove(uuid);
  }
}
