import { IsNotEmpty } from 'class-validator';

export class UpdateProduct {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly price: number;
}
