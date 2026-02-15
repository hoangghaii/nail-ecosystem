import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({
    description: 'Contact first name',
    example: 'Sarah',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  firstName: string;

  @ApiProperty({
    description: 'Contact last name',
    example: 'Johnson',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  lastName: string;

  @ApiPropertyOptional({
    description: 'Contact email address',
    example: 'sarah.johnson@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1 (555) 987-6543',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  phone: string;

  @ApiPropertyOptional({
    description: 'Subject of the inquiry',
    example: 'Question about services',
  })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({
    description: 'Message content',
    example:
      'I would like to know more about your gel manicure services and pricing.',
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  message: string;
}
