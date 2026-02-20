import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    rememberMe = false,
  ): void {
    const isProd =
      this.configService.get<string>('app.env') === 'production';
    // Cookie maxAge matches JWT expiry to avoid sending expired tokens
    const accessMaxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 days (matches rememberMe JWT)
      : 15 * 60 * 1000; // 15 min (matches default JWT_ACCESS_EXPIRY)
    const refreshMaxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 days
      : 7 * 24 * 60 * 60 * 1000; // 7 days (matches JWT_REFRESH_EXPIRY)

    const baseOpts = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict' as const,
      path: '/',
    };

    res.cookie('nail_admin_access_token', accessToken, {
      ...baseOpts,
      maxAge: accessMaxAge,
    });
    res.cookie('nail_admin_refresh_token', refreshToken, {
      ...baseOpts,
      maxAge: refreshMaxAge,
    });
  }

  private clearCookies(res: Response): void {
    const isProd =
      this.configService.get<string>('app.env') === 'production';
    const baseOpts = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict' as const,
      path: '/',
    };
    res.clearCookie('nail_admin_access_token', baseOpts);
    res.clearCookie('nail_admin_refresh_token', baseOpts);
  }

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 20, ttl: 3600000 } })
  @ApiOperation({ summary: 'Register new admin user' })
  @ApiResponse({ status: 201, description: 'Admin successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({
    status: 429,
    description: 'Too many registration attempts (20 per hour)',
  })
  async register(
    @Body() dto: RegisterAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);
    this.setCookies(res, result.accessToken, result.refreshToken);
    return { admin: result.admin };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Login admin user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated. Tokens set as HttpOnly cookies.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({
    status: 429,
    description: 'Too many login attempts (100 per minute)',
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    this.setCookies(
      res,
      result.accessToken,
      result.refreshToken,
      dto.rememberMe,
    );
    return { admin: result.admin };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout admin user' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(
    @CurrentUser('_id') adminId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(adminId);
    this.clearCookies(res);
    return { message: 'Logged out successfully' };
  }

  // @Public() bypasses the global AccessTokenGuard (which would reject an expired access token).
  // @UseGuards(RefreshTokenGuard) then applies the refresh-token-specific check.
  // Both decorators are required — removing @Public() would cause AccessTokenGuard to also
  // run and 401 on an expired access token before RefreshTokenGuard gets a chance.
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'New tokens set as HttpOnly cookies',
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @CurrentUser('sub') adminId: string,
    @CurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(adminId, refreshToken);
    this.setCookies(res, tokens.accessToken, tokens.refreshToken);
    return { message: 'Tokens refreshed' };
  }
}
