import { IsInt, IsPositive } from 'class-validator';

export class OrderDeletedEvent {
  @IsInt() @IsPositive() orderId!: number;
}
