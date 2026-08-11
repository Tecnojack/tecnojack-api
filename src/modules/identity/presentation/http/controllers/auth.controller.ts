import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { RegisterUserUseCase } from '../../../application/register-user/register-user.use-case.js';
import { LoginUseCase } from '../../../application/login/login.use-case.js';
import { LogoutUseCase } from '../../../application/logout/logout.use-case.js';
import { RefreshTokenUseCase } from '../../../application/refresh-token/refresh-token.use-case.js';
import { ManageUserLifecycleUseCase } from '../../../application/manage-user-lifecycle/manage-user-lifecycle.use-case.js';
import { CreateUserDto, LoginDto, RefreshTokenDto, ResetPasswordDto } from '../dtos/auth-request.dto.js';
import { UserResponseDto, TokenResponseDto } from '../dtos/auth-response.dto.js';

@ApiTags('Identity Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshUseCase: RefreshTokenUseCase,
    private readonly lifecycleUseCase: ManageUserLifecycleUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user identity' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async register(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.registerUseCase.execute({
      email: dto.email,
      passwordPlain: dto.password,
      tenantId: dto.tenantId,
    });
    return UserResponseDto.fromDomain(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate local credentials and start device session' })
  @ApiResponse({ status: 200, type: TokenResponseDto })
  async login(@Body() dto: LoginDto, @Req() req: Request): Promise<TokenResponseDto> {
    const ipAddress = req.ip ?? '127.0.0.1';
    const userAgent = req.headers['user-agent'] ?? 'Unknown Agent';
    const tokens = await this.loginUseCase.execute({
      email: dto.email,
      passwordPlain: dto.password,
      ipAddress,
      userAgent,
      deviceType: 'WebBrowser',
    });
    return tokens;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke active refresh token and end session' })
  async logout(@Body() dto: RefreshTokenDto): Promise<void> {
    await this.logoutUseCase.execute(dto.refreshToken);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and issue a fresh access JWT' })
  @ApiResponse({ status: 200, type: TokenResponseDto })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokenResponseDto> {
    return this.refreshUseCase.execute(dto.refreshToken);
  }

  @Post(':id/verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address' })
  async verifyEmail(@Body() body: { id: string }): Promise<UserResponseDto> {
    const user = await this.lifecycleUseCase.verifyEmail(body.id);
    return UserResponseDto.fromDomain(user);
  }

  @Post(':id/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset account password' })
  async resetPassword(
    @Body() body: { id: string; dto: ResetPasswordDto },
  ): Promise<UserResponseDto> {
    const user = await this.lifecycleUseCase.resetPassword(body.id, body.dto.newPassword);
    return UserResponseDto.fromDomain(user);
  }
}
