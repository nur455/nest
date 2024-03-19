import { IsString, MinLength } from 'class-validator';

export class AuthDto {
	@IsString()
	email: string;
	@IsString()
	@MinLength(2)
	password: string;
}
