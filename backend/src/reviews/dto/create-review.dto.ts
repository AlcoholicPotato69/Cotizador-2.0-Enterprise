import { IsString, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  @IsNotEmpty()
  documentId: string;

  @IsString()
  @IsNotEmpty()
  type: string; // LEGAL, FINANCIAL

  @IsString()
  @IsOptional()
  notes?: string;
}

export class AddDecisionDto {
  @IsString()
  @IsNotEmpty()
  decision: string; // APPROVED, REJECTED, CHANGES_REQUESTED

  @IsString()
  @IsOptional()
  comments?: string;
}
