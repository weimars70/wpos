import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Users CRUD routes are not yet implemented for the new schema.
// Placeholder controller to satisfy module loading.
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {}
