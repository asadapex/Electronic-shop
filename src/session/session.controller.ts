import { Controller, Get, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { Request } from 'express';
import { AuthguardGuard } from 'src/authguard/authguard.guard';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @UseGuards(AuthguardGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.sessionService.findAll(req);
  }

  @UseGuards(AuthguardGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.sessionService.remove(+id, req);
  }
}
