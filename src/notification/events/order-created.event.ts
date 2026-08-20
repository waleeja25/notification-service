import { IsInt, IsPositive } from 'class-validator';

export class OrderCreatedEvent {
  @IsInt() @IsPositive() orderId!: number;
  @IsInt() @IsPositive() userId!: number;
}
