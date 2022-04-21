import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DtoValidationPipe implements PipeTransform<any> {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (!metatype || !DtoValidationPipe.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('payload does not match schema');
    }
    return value;
  }

  private static toValidate(metatype: unknown): boolean {
    const types: unknown[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
