import { IsNotEmpty } from 'class-validator';

export class CreateProduct {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly price: number;
}
