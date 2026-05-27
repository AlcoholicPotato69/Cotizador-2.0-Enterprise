import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WorkflowEngineService } from './workflow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Workflow')
@Controller('workflows')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantIsolationGuard)
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowEngineService) {}

  @Post(':versionId/transitions')
  @ApiOperation({ summary: 'Execute Post operation' })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Permissions('workflows:read')
  async executeTransition(
    @Request() req: any,
    @Param('versionId') workflowVersionId: string,
    @Body()
    body: { currentStateId: string; actionName: string; contextPayload: any },
  ) {
    const tenantId = req.tenantId; // Set by TenantContextInterceptor / TenantGuard
    const targetStateId = await this.workflowService.executeTransition(
      tenantId,
      workflowVersionId,
      body.currentStateId,
      body.actionName,
      body.contextPayload,
    );

    return {
      success: true,
      data: {
        targetStateId,
      },
    };
  }
}
