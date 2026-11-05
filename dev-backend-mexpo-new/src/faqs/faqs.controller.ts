import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ReorderFaqDto } from './dto/reorder-faq.dto';
import { RoleGuard, Roles } from '../helper/role-guard';
import * as authTypes from '../auth/auth.types';
import FormatValidation from '../helper/validation.format';

@ApiTags('FAQs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  /**
   * Public: Get published FAQs
   */
  @Get()
  findAllPublic(@Query('category') category?: string) {
    return this.faqsService.findAllPublic(category);
  }

  /**
   * Superadmin: Get all FAQs (including unpublished) with search and filters
   */
  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  findAllAdmin(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.faqsService.findAllAdmin(search, category);
  }

  /**
   * Superadmin: Reorder FAQs
   */
  @Patch('reorder')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
  reorder(@Body() dto: ReorderFaqDto, @Request() req: authTypes.AuthRequest) {
    return this.faqsService.reorder(dto, req.user.uuid);
  }

  /**
   * Superadmin: Get FAQ detail
   */
  @Get(':uuid')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  findOne(@Param('uuid') uuid: string) {
    return this.faqsService.findOne(uuid);
  }

  /**
   * Superadmin: Create new FAQ
   */
  @Post()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
  create(@Body() dto: CreateFaqDto, @Request() req: authTypes.AuthRequest) {
    return this.faqsService.create(dto, req.user.uuid);
  }

  /**
   * Superadmin: Update FAQ
   */
  @Put(':uuid')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateFaqDto,
    @Request() req: authTypes.AuthRequest,
  ) {
    return this.faqsService.update(uuid, dto, req.user.uuid);
  }

  /**
   * Superadmin: Delete FAQ
   */
  @Delete(':uuid')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('SUPERADMIN')
  remove(@Param('uuid') uuid: string) {
    return this.faqsService.remove(uuid);
  }
}
