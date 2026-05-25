const fs = require('fs');

// spaces.service.spec.ts
let spaces = fs.readFileSync('src/spaces/spaces.service.spec.ts', 'utf8');
spaces = spaces.replace(/{ name: 'Test', spaceType: 'publicidad física' }/g, "{ name: 'Test', spaceType: 'publicidad física', planoPdf: 'url', regulationTemplate: 'url' }");
fs.writeFileSync('src/spaces/spaces.service.spec.ts', spaces);

// document-viewer.service.spec.ts
let doc = fs.readFileSync('src/files/document-viewer/document-viewer.service.spec.ts', 'utf8');
doc = doc.replace(/expect\(result\)\.toBe\('http:\/\/doc'\);/g, "expect(result).toEqual({ url: 'http://doc' });");
fs.writeFileSync('src/files/document-viewer/document-viewer.service.spec.ts', doc);

// reviews.service.spec.ts
let rev = fs.readFileSync('src/reviews/reviews.service.spec.ts', 'utf8');
if (!rev.includes('EventEmitter2')) {
  rev = "import { EventEmitter2 } from '@nestjs/event-emitter';\n" + rev;
  rev = rev.replace(/providers: \[/, "providers: [{provide: EventEmitter2, useValue: {}}, ");
}
fs.writeFileSync('src/reviews/reviews.service.spec.ts', rev);

// customer-credits.service.spec.ts
let cred = fs.readFileSync('src/customer-credits/customer-credits.service.spec.ts', 'utf8');
cred = cred.replace(/customercredits\.repository/g, 'customer-credits.repository');
fs.writeFileSync('src/customer-credits/customer-credits.service.spec.ts', cred);

// contract.service.spec.ts
let contr = fs.readFileSync('src/contracts/contract.service.spec.ts', 'utf8');
contr = contr.replace(/provide: PrismaService, useValue: \{\}/g, "provide: PrismaService, useValue: { $transaction: jest.fn().mockImplementation(cb => cb({ $executeRaw: jest.fn() })) }");
fs.writeFileSync('src/contracts/contract.service.spec.ts', contr);

// outbox-processor.service.spec.ts
let outbox = fs.readFileSync('src/common/outbox/outbox-processor.service.spec.ts', 'utf8');
outbox = outbox.replace(/let eventEmitter: EventEmitter2;/g, "let eventEmitter: EventEmitter2;\n  let eventPublisher: DomainEventPublisher;");
outbox = outbox.replace(/eventEmitter = module\.get<EventEmitter2>\(EventEmitter2\);/g, "eventEmitter = module.get<EventEmitter2>(EventEmitter2);\n    eventPublisher = module.get<DomainEventPublisher>(DomainEventPublisher);");
fs.writeFileSync('src/common/outbox/outbox-processor.service.spec.ts', outbox);

console.log('Fixed final tests');
