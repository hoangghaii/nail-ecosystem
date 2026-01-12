import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContactNotesDto {
  @ApiProperty({
    description: 'Admin notes for this contact',
    example: 'Customer called back and booked an appointment',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty({ message: 'Admin notes cannot be empty' })
  @MaxLength(1000, { message: 'Admin notes cannot exceed 1000 characters' })
  adminNotes: string;
}
