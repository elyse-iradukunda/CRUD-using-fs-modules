import { IsString, IsNotEmpty, IsInt } from "class-validator";

export class CreateItemDto {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpdateItemDto {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;
}
