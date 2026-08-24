import { IsInt, IsPositive } from 'class-validator';

export class UserCreatedEvent {
  @IsInt() @IsPositive() userId!: number;
}
