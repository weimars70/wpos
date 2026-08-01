import { Controller, Get, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  // UseGuards? Maybe for now let's keep it simple or use AuthGuard if exists
  async getSummary(@Query('empresaId', ParseIntPipe) empresaId: number) {
    return this.dashboardService.getSummary(empresaId);
  }
}
