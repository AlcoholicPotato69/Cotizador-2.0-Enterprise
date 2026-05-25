const fs = require('fs');

const path = 'h:/Cotizador-2.0-Enterprise/backend/prisma/schema.prisma';
let content = fs.readFileSync(path, 'utf8');

const enumsToAdd = `
enum OutboxStatus {
  PENDING
  PROCESSING
  PUBLISHED
  FAILED
}

enum InboxStatus {
  PENDING
  PROCESSING
  PROCESSED
  FAILED
}

enum JobStatus {
  QUEUED
  RUNNING
  COMPLETED
  FAILED
  RETRYING
  CANCELLED
}

enum ArchiveStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
}
`;

content = content.replace('// ==========================================\n// FOUNDATIONAL DOMAINS', enumsToAdd + '\n// ==========================================\n// FOUNDATIONAL DOMAINS');

const tenantRelations = `  signatureEvidences       SignatureEvidence[]

  outboxEvents         OutboxEvent[]
  outboxDispatches     OutboxDispatch[]
  outboxFailures       OutboxFailure[]
  inboxEvents          InboxEvent[]
  jobQueues            JobQueue[]
  jobExecutions        JobExecution[]
  jobRetries           JobRetry[]
  jobFailures          JobFailure[]
  workflowDefinitions  WorkflowDefinition[]
  workflowVersions     WorkflowVersion[]
  workflowStates       WorkflowState[]
  workflowTransitions  WorkflowTransition[]
  workflowRules        WorkflowRule[]
  archivePolicies      ArchivePolicy[]
  archiveJobs          ArchiveJob[]
  archiveRecords       ArchiveRecord[]
  globalSearchIndices  GlobalSearchIndex[]
  numberingSequences   NumberingSequence[]
  storageMetadatas     StorageMetadata[]
  healthCheckMetrics   HealthCheckMetric[]
  paymentAllocations   PaymentAllocation[]`;

content = content.replace('  signatureEvidences       SignatureEvidence[]', tenantRelations);

content = content.replace('  payments Payment[]\n\n  createdAt DateTime', '  payments Payment[]\n  allocations PaymentAllocation[]\n\n  createdAt DateTime');
content = content.replace('  evidences PaymentEvidence[]\n}', '  evidences PaymentEvidence[]\n  allocations PaymentAllocation[]\n}');

const newModels = `
// ==========================================
// PAYMENT ALLOCATION ENGINE
// ==========================================
model PaymentAllocation {
  id              String    @id @default(uuid())
  tenantId        String    @map("tenant_id")
  tenant          Tenant    @relation(fields: [tenantId], references: [id])
  paymentId       String    @map("payment_id")
  payment         Payment   @relation(fields: [paymentId], references: [id])
  invoiceId       String    @map("invoice_id")
  invoice         Invoice   @relation(fields: [invoiceId], references: [id])
  allocatedAmount Decimal   @map("allocated_amount") @db.Decimal(15, 4)
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  deletedAt       DateTime? @map("deleted_at")
  deletedBy       String?   @map("deleted_by")
}

// ==========================================
// OUTBOX / INBOX PATTERN
// ==========================================
model OutboxEvent {
  id            String    @id @default(uuid())
  tenantId      String    @map("tenant_id")
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  aggregateType String    @map("aggregate_type")
  aggregateId   String    @map("aggregate_id")
  eventType     String    @map("event_type")
  payload       Json
  status        OutboxStatus @default(PENDING)
  correlationId String?   @map("correlation_id")
  traceId       String?   @map("trace_id")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")
  deletedBy     String?   @map("deleted_by")

  dispatches    OutboxDispatch[]
  failures      OutboxFailure[]

  @@index([tenantId, status])
}

model OutboxDispatch {
  id            String    @id @default(uuid())
  tenantId      String    @map("tenant_id")
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  outboxEventId String    @map("outbox_event_id")
  outboxEvent   OutboxEvent @relation(fields: [outboxEventId], references: [id])
  dispatchedAt  DateTime  @default(now()) @map("dispatched_at")
  destination   String
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")
  deletedBy     String?   @map("deleted_by")
}

model OutboxFailure {
  id            String    @id @default(uuid())
  tenantId      String    @map("tenant_id")
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  outboxEventId String    @map("outbox_event_id")
  outboxEvent   OutboxEvent @relation(fields: [outboxEventId], references: [id])
  errorMessage  String    @map("error_message")
  failedAt      DateTime  @default(now()) @map("failed_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")
  deletedBy     String?   @map("deleted_by")
}

model InboxEvent {
  id            String    @id @default(uuid())
  tenantId      String    @map("tenant_id")
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  eventId       String    @unique @map("event_id")
  eventType     String    @map("event_type")
  payload       Json
  processedAt   DateTime? @map("processed_at")
  status        InboxStatus @default(PENDING)
  correlationId String?   @map("correlation_id")
  traceId       String?   @map("trace_id")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")
  deletedBy     String?   @map("deleted_by")

  @@index([tenantId, status])
}

// ==========================================
// JOB PERSISTENCE (NATIVE)
// ==========================================
model JobQueue {
  id            String    @id @default(uuid())
  tenantId      String    @map("tenant_id")
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  queueName     String    @map("queue_name")
  jobType       String    @map("job_type")
  payload       Json
  status        JobStatus @default(QUEUED)
  priority      Int       @default(0)
  scheduledFor  DateTime? @map("scheduled_for")
  correlationId String?   @map("correlation_id")
  traceId       String?   @map("trace_id")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")
  deletedBy     String?   @map("deleted_by")

  executions    JobExecution[]
  retries       JobRetry[]
  failures      JobFailure[]

  @@index([tenantId, queueName, status])
}

model JobExecution {
  id            String    @id @default(uuid())
  tenantId      String    @map("tenant_id")
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  jobId         String    @map("job_id")
  job           JobQueue  @relation(fields: [jobId], references: [id])
  workerId      String?   @map("worker_id")
  startedAt     DateTime  @default(now()) @map("started_at")
  completedAt   DateTime? @map("completed_at")
  status        JobStatus @default(RUNNING)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")
  deletedBy     String?   @map("deleted_by")
}

model JobRetry {
  id            String    @id @default(uuid())
  tenantId      String    @map("tenant_id")
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  jobId         String    @map("job_id")
  job           JobQueue  @relation(fields: [jobId], references: [id])
  retryCount    Int       @map("retry_count")
  reason        String?
  scheduledFor  DateTime  @map("scheduled_for")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")
  deletedBy     String?   @map("deleted_by")
}

model JobFailure {
  id            String    @id @default(uuid())
  tenantId      String    @map("tenant_id")
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  jobId         String    @map("job_id")
  job           JobQueue  @relation(fields: [jobId], references: [id])
  errorMessage  String    @map("error_message")
  stackTrace    String?   @map("stack_trace")
  failedAt      DateTime  @default(now()) @map("failed_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")
  deletedBy     String?   @map("deleted_by")
}

// ==========================================
// WORKFLOW ENGINE
// ==========================================
model WorkflowDefinition {
  id          String    @id @default(uuid())
  tenantId    String    @map("tenant_id")
  tenant      Tenant    @relation(fields: [tenantId], references: [id])
  name        String
  description String?
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")
  deletedBy   String?   @map("deleted_by")

  versions    WorkflowVersion[]
}

model WorkflowVersion {
  id                   String             @id @default(uuid())
  tenantId             String             @map("tenant_id")
  tenant               Tenant             @relation(fields: [tenantId], references: [id])
  workflowDefinitionId String             @map("workflow_definition_id")
  workflowDefinition   WorkflowDefinition @relation(fields: [workflowDefinitionId], references: [id])
  versionNumber        Int                @map("version_number")
  isActive             Boolean            @default(false) @map("is_active")
  createdAt            DateTime           @default(now()) @map("created_at")
  updatedAt            DateTime           @updatedAt @map("updated_at")
  deletedAt            DateTime?          @map("deleted_at")
  deletedBy            String?            @map("deleted_by")

  states               WorkflowState[]
  transitions          WorkflowTransition[]
}

model WorkflowState {
  id                String          @id @default(uuid())
  tenantId          String          @map("tenant_id")
  tenant            Tenant          @relation(fields: [tenantId], references: [id])
  workflowVersionId String          @map("workflow_version_id")
  workflowVersion   WorkflowVersion @relation(fields: [workflowVersionId], references: [id])
  name              String
  isInitial         Boolean         @default(false) @map("is_initial")
  isFinal           Boolean         @default(false) @map("is_final")
  createdAt         DateTime        @default(now()) @map("created_at")
  updatedAt         DateTime        @updatedAt @map("updated_at")
  deletedAt         DateTime?       @map("deleted_at")
  deletedBy         String?         @map("deleted_by")

  sourceTransitions WorkflowTransition[] @relation("SourceState")
  targetTransitions WorkflowTransition[] @relation("TargetState")
  rules             WorkflowRule[]
}

model WorkflowTransition {
  id                String          @id @default(uuid())
  tenantId          String          @map("tenant_id")
  tenant            Tenant          @relation(fields: [tenantId], references: [id])
  workflowVersionId String          @map("workflow_version_id")
  workflowVersion   WorkflowVersion @relation(fields: [workflowVersionId], references: [id])
  sourceStateId     String          @map("source_state_id")
  targetStateId     String          @map("target_state_id")
  sourceState       WorkflowState   @relation("SourceState", fields: [sourceStateId], references: [id])
  targetState       WorkflowState   @relation("TargetState", fields: [targetStateId], references: [id])
  actionName        String          @map("action_name")
  createdAt         DateTime        @default(now()) @map("created_at")
  updatedAt         DateTime        @updatedAt @map("updated_at")
  deletedAt         DateTime?       @map("deleted_at")
  deletedBy         String?         @map("deleted_by")
}

model WorkflowRule {
  id              String        @id @default(uuid())
  tenantId        String        @map("tenant_id")
  tenant          Tenant        @relation(fields: [tenantId], references: [id])
  workflowStateId String        @map("workflow_state_id")
  workflowState   WorkflowState @relation(fields: [workflowStateId], references: [id])
  ruleExpression  String        @map("rule_expression")
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")
  deletedAt       DateTime?     @map("deleted_at")
  deletedBy       String?       @map("deleted_by")
}

// ==========================================
// ARCHIVE ENGINE
// ==========================================
model ArchivePolicy {
  id               String    @id @default(uuid())
  tenantId         String    @map("tenant_id")
  tenant           Tenant    @relation(fields: [tenantId], references: [id])
  entityType       String    @map("entity_type")
  retentionDays    Int       @map("retention_days")
  archiveStorageId String?   @map("archive_storage_id")
  createdAt        DateTime  @default(now()) @map("created_at")
  updatedAt        DateTime  @updatedAt @map("updated_at")
  deletedAt        DateTime? @map("deleted_at")
  deletedBy        String?   @map("deleted_by")

  jobs             ArchiveJob[]

  @@unique([tenantId, entityType])
}

model ArchiveJob {
  id              String        @id @default(uuid())
  tenantId        String        @map("tenant_id")
  tenant          Tenant        @relation(fields: [tenantId], references: [id])
  archivePolicyId String        @map("archive_policy_id")
  archivePolicy   ArchivePolicy @relation(fields: [archivePolicyId], references: [id])
  status          ArchiveStatus @default(PENDING)
  recordsArchived Int           @default(0) @map("records_archived")
  startedAt       DateTime?     @map("started_at")
  completedAt     DateTime?     @map("completed_at")
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")
  deletedAt       DateTime?     @map("deleted_at")
  deletedBy       String?       @map("deleted_by")

  records         ArchiveRecord[]
}

model ArchiveRecord {
  id           String    @id @default(uuid())
  tenantId     String    @map("tenant_id")
  tenant       Tenant    @relation(fields: [tenantId], references: [id])
  archiveJobId String    @map("archive_job_id")
  archiveJob   ArchiveJob @relation(fields: [archiveJobId], references: [id])
  entityId     String    @map("entity_id")
  archivedData Json      @map("archived_data")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  deletedAt    DateTime? @map("deleted_at")
  deletedBy    String?   @map("deleted_by")
}

// ==========================================
// OPERATIONAL DOMAINS (NUMBERING, STORAGE, HEALTH, SEARCH)
// ==========================================
model GlobalSearchIndex {
  id         String    @id @default(uuid())
  tenantId   String    @map("tenant_id")
  tenant     Tenant    @relation(fields: [tenantId], references: [id])
  entityType String    @map("entity_type")
  entityId   String    @map("entity_id")
  title      String?
  content    String
  url        String?
  createdAt  DateTime  @default(now()) @map("created_at")
  updatedAt  DateTime  @updatedAt @map("updated_at")
  deletedAt  DateTime? @map("deleted_at")
  deletedBy  String?   @map("deleted_by")

  @@index([tenantId, entityType])
  @@index([tenantId, title])
}

model NumberingSequence {
  id           String    @id @default(uuid())
  tenantId     String    @map("tenant_id")
  tenant       Tenant    @relation(fields: [tenantId], references: [id])
  entityType   String    @map("entity_type")
  prefix       String?
  suffix       String?
  currentValue BigInt    @map("current_value")
  step         Int       @default(1)
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  deletedAt    DateTime? @map("deleted_at")
  deletedBy    String?   @map("deleted_by")

  @@unique([tenantId, entityType])
}

model StorageMetadata {
  id           String    @id @default(uuid())
  tenantId     String    @map("tenant_id")
  tenant       Tenant    @relation(fields: [tenantId], references: [id])
  bucketName   String    @map("bucket_name")
  objectKey    String    @map("object_key")
  fileSize     BigInt    @map("file_size")
  contentType  String    @map("content_type")
  storageClass String?   @map("storage_class")
  checksum     String?
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  deletedAt    DateTime? @map("deleted_at")
  deletedBy    String?   @map("deleted_by")

  @@unique([tenantId, bucketName, objectKey])
}

model HealthCheckMetric {
  id            String    @id @default(uuid())
  tenantId      String    @map("tenant_id")
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  serviceName   String    @map("service_name")
  status        String
  latencyMs     Int?      @map("latency_ms")
  checkedAt     DateTime  @default(now()) @map("checked_at")
  errorDetails  String?   @map("error_details")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")
  deletedBy     String?   @map("deleted_by")

  @@index([tenantId, serviceName, status])
}
`;

fs.writeFileSync(path, content + newModels);
