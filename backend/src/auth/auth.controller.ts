import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { TenantIsolationGuard } from './guards/tenant-isolation.guard';
import { Permissions } from './decorators/permissions.decorator';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Controller responsible for handling authentication routes.
 * Exposes endpoints for user login and profile retrieval.
 *
 * @class AuthController
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticates a user and generates a JWT token.
   *
   * @param {LoginDto} body - The login credentials (email and password).
   * @returns {Promise<{token: string, user: Record<string, any>}>} An object containing the generated JWT token and user details.
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    // Validate credentials using DTO
    return this.authService.login(body);
  }

  /**
   * Retrieves the authenticated user's profile information.
   *
   * @param {any} req - The HTTP request object containing the user context.
   * @returns {any} The authenticated user's data from the JWT payload.
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Execute Get operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getProfile(@Request() req: any) {
    return req.user;
  }
}
