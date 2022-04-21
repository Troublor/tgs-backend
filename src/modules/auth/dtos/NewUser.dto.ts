import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export default class NewUserDto {
  @ApiProperty()
  @IsString()
  username!: string;

  @ApiProperty()
  @IsString()
  password!: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;
}
