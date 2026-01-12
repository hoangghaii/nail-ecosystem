import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@nailsalon.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Admin password (minimum 8 characters)',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description:
      'Remember me for extended session (30 days instead of 24 hours)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
