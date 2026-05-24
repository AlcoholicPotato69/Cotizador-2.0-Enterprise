# DTO (Data Transfer Object) Standards

DTOs represent the contract for data entering and exiting the NestJS API.

## Core Tools

- `@nestjs/swagger`: For OpenAPI documentation and types.
- `class-validator`: For robust runtime data validation.
- `class-transformer`: For transforming plain JSON into instantiated class objects.

## Rules for Creating DTOs

1. **Always Use Classes**: DTOs must be TypeScript `class`es, not `interface`s, so NestJS can retain metadata for runtime validation and Swagger documentation.
2. **Strict Validation**: Every property must have at least one validation decorator (e.g., `@IsString()`, `@IsNumber()`, `@IsOptional()`).
3. **Swagger Integration**: Decorate properties with `@ApiProperty()` or `@ApiPropertyOptional()` to automatically generate API documentation.

### Example Create DTO

```typescript
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'johan@example.com', description: 'User corporate email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'StrongPassword123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
```

## Update DTOs (Mapped Types)

Instead of duplicating the Create DTO, use `PartialType` provided by `@nestjs/swagger` to make all fields optional while inheriting validators and Swagger metadata.

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

## Output Serialization

- Exclude sensitive fields (e.g., passwords, internal tokens) using `class-transformer`'s `@Exclude()`.
- Ensure `ClassSerializerInterceptor` is enabled globally or on specific controllers to apply these exclusions on outbound responses.

```typescript
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;
  email: string;

  @Exclude()
  passwordHash: string;
}
```
