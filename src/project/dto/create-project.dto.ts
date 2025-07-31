import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  assignedUsers: string[];

  @IsArray()
  @IsString({ each: true })
  tasks: string[];
}
