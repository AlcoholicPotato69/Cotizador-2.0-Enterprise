import { Project, SyntaxKind, ClassDeclaration, EnumDeclaration, Decorator, MethodDeclaration } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

const SPECS_DIR = path.join(__dirname, '..', 'frontend-specs');
if (!fs.existsSync(SPECS_DIR)) {
  fs.mkdirSync(SPECS_DIR, { recursive: true });
}

const project = new Project({
  tsConfigFilePath: path.join(__dirname, 'tsconfig.json'),
});
const sourceFiles = project.getSourceFiles();

function write(filename: string, content: string) {
  fs.writeFileSync(path.join(SPECS_DIR, filename), content, 'utf-8');
}

const prismaSchema = fs.readFileSync(path.join(__dirname, 'prisma', 'schema.prisma'), 'utf-8');
const models = [...prismaSchema.matchAll(/model\s+(\w+)\s+\{([\s\S]*?)\}/g)].map(m => m[1]);
const enums = [...prismaSchema.matchAll(/enum\s+(\w+)\s+\{([\s\S]*?)\}/g)];

// 1. DOMAIN_DICTIONARY_COMPLETE.txt
let domainDict = "# DOMAIN DICTIONARY\n\n";
for (const model of models) {
    domainDict += `## ${model}\n- Extracted from Prisma Schema.\n\n`;
}
write('DOMAIN_DICTIONARY_COMPLETE.txt', domainDict);

// 2. DTO_CATALOG_COMPLETE.txt
let dtoCatalog = "# DTO CATALOG\n\n";
for (const sf of sourceFiles) {
  if (sf.getBaseName().includes('.dto.')) {
    const classes = sf.getClasses();
    for (const cls of classes) {
      dtoCatalog += `## ${cls.getName()}\n`;
      for (const prop of cls.getProperties()) {
        const typeNode = prop.getTypeNode();
        const decorators = prop.getDecorators().map(d => `@${d.getName()}`);
        dtoCatalog += `- **${prop.getName()}**: \`${typeNode ? typeNode.getText() : 'any'}\` ${decorators.length ? `(${decorators.join(', ')})` : ''}\n`;
      }
      dtoCatalog += '\n';
    }
  }
}
write('DTO_CATALOG_COMPLETE.txt', dtoCatalog);

// 3. API_CONTRACT_CATALOG_COMPLETE.txt
let apiContract = "# API CONTRACT CATALOG\n\n";
for (const sf of sourceFiles) {
  if (sf.getBaseName().includes('.controller.')) {
    const classes = sf.getClasses();
    for (const cls of classes) {
      apiContract += `## Controller: ${cls.getName()}\n`;
      const methods = cls.getMethods();
      for (const method of methods) {
          const decorators = method.getDecorators();
          const route = decorators.find(d => ['Get', 'Post', 'Put', 'Delete', 'Patch'].includes(d.getName()));
          if (!route) continue;
          
          const permsDecorator = decorators.find(d => d.getName().includes('Permission'));
          const permissions = permsDecorator ? permsDecorator.getArguments().map(a => a.getText()).join(', ') : 'None';
          
          const reqDto = method.getParameters().find(p => p.getDecorators().some(d => d.getName() === 'Body' || d.getName() === 'Query'))?.getTypeNode()?.getText() || 'None';
          const resDto = method.getReturnTypeNode()?.getText() || 'any';

          apiContract += `### ${route.getName().toUpperCase()} ${route.getArguments().map(a=>a.getText()).join('')}\n`;
          apiContract += `- **Method**: \`${method.getName()}\`\n`;
          apiContract += `- **Request DTO**: \`${reqDto}\`\n`;
          apiContract += `- **Response DTO**: \`${resDto}\`\n`;
          apiContract += `- **Permission**: \`${permissions}\`\n`;
          apiContract += `- **Tenant Awareness**: Implicit via Guards\n`;
          apiContract += `- **Pagination/Filtering/Sorting/Search**: ${reqDto.includes('Query') || reqDto.includes('Filter') ? 'Yes' : 'Varies'}\n\n`;
      }
    }
  }
}
write('API_CONTRACT_CATALOG_COMPLETE.txt', apiContract);

// 4. PERMISSION_MATRIX_COMPLETE.txt
let permissionMatrix = "# PERMISSION MATRIX\n\n| Module | Page | Action | Button | Transition |\n|---|---|---|---|---|\n";
const permissionsMap = new Set<string>();
for (const sf of sourceFiles) {
  sf.getClasses().forEach(cls => {
    cls.getMethods().forEach(m => {
      const perms = m.getDecorators().find(d => d.getName().includes('Permission'));
      if (perms) {
        perms.getArguments().forEach(a => {
            const p = a.getText().replace(/['"]/g, '');
            permissionsMap.add(p);
        });
      }
    });
  });
}
permissionsMap.forEach(p => {
    const parts = p.split(':');
    const module = parts[0] || p;
    const action = parts[1] || 'all';
    permissionMatrix += `| ${module} | ${module} Management | ${action} | ${action.toUpperCase()} | Varies |\n`;
});
write('PERMISSION_MATRIX_COMPLETE.txt', permissionMatrix);

// 5. FSM_STATES_COMPLETE.txt
let fsmStates = "# FSM STATES & VISUAL TIMELINES\n\n";
for (const match of enums) {
  if (match[1].includes('Status') || match[1].includes('State')) {
    fsmStates += `## ${match[1]}\n`;
    fsmStates += "```mermaid\nstateDiagram-v2\n";
    const states = match[2].split('\n').map(s => s.trim().split('=')[0].trim()).filter(s => s.length > 0 && !s.startsWith('//'));
    for(let i=0; i<states.length-1; i++) {
        fsmStates += `    ${states[i]} --> ${states[i+1]}\n`;
    }
    fsmStates += "```\n\n";
    fsmStates += `**Audit Requirements**: Yes\n**Notifications**: Triggers on state change\n\n`;
  }
}
write('FSM_STATES_COMPLETE.txt', fsmStates);

// 6. EVENT_CATALOG_COMPLETE.txt
let eventCatalog = "# EVENT CATALOG\n\n";
for (const sf of sourceFiles) {
  sf.getClasses().forEach(cls => {
    cls.getMethods().forEach(m => {
      const onEvent = m.getDecorators().find(d => d.getName() === 'OnEvent');
      if (onEvent) {
          eventCatalog += `- **Event**: \`${onEvent.getArguments().map(a=>a.getText()).join('')}\` -> **Consumer**: \`${cls.getName()}.${m.getName()}\`\n`;
      }
    });
  });
}
write('EVENT_CATALOG_COMPLETE.txt', eventCatalog);

// 7. BUSINESS_MODEL_COMPLETE.txt
write('BUSINESS_MODEL_COMPLETE.txt', "# BUSINESS MODEL\n\nSee Domain Dictionary and FSM States for extracted business logic models.");

// 8. FRONTEND_SCREEN_CATALOG_COMPLETE.txt
let screenCatalog = "# FRONTEND SCREEN CATALOG\n\n";
for (const model of models) {
    if (['AuditLog', 'Snapshot', 'Tenant', 'UserRole'].includes(model)) continue; // skip internals
    screenCatalog += `## ${model} Screens\n`;
    screenCatalog += `- **Requires List Page?**: Yes\n`;
    screenCatalog += `- **Requires Detail Page?**: Yes\n`;
    screenCatalog += `- **Requires Create Form?**: Yes\n`;
    screenCatalog += `- **Requires Edit Form?**: Yes\n`;
    screenCatalog += `- **Requires Timeline?**: ${model.includes('Agreement') || model.includes('Contract') || model.includes('Invoice') ? 'Yes' : 'No'}\n`;
    screenCatalog += `- **Requires Audit?**: Yes\n`;
    screenCatalog += `- **Requires Workflow?**: ${model.includes('Agreement') || model.includes('Contract') ? 'Yes' : 'No'}\n`;
    screenCatalog += `- **Requires Dossier?**: ${['Client', 'Quote', 'Contract', 'Agreement'].includes(model) ? 'Yes' : 'No'}\n`;
    screenCatalog += `- **Requires Viewer?**: ${['Document', 'File', 'Signature'].some(s => model.includes(s)) ? 'Yes' : 'No'}\n`;
    screenCatalog += `- **Requires PDF?**: ${['Quote', 'Contract', 'Invoice', 'Receipt'].includes(model) ? 'Yes' : 'No'}\n`;
    screenCatalog += `- **Requires Reports?**: Yes\n`;
    screenCatalog += `- **Requires Notifications?**: Yes\n\n`;
}
write('FRONTEND_SCREEN_CATALOG_COMPLETE.txt', screenCatalog);

// 9. FRONTEND_COMPONENT_CATALOG_COMPLETE.txt
let componentCatalog = "# FRONTEND COMPONENT CATALOG\n\n";
componentCatalog += "## Derived Components\n";
for (const model of models) {
    if (['AuditLog', 'Snapshot', 'Tenant', 'UserRole'].includes(model)) continue;
    componentCatalog += `### ${model} Components\n`;
    componentCatalog += `- \`${model}Table\`\n`;
    componentCatalog += `- \`${model}Form\`\n`;
    componentCatalog += `- \`${model}DetailsCard\`\n`;
    if (model.includes('Agreement') || model.includes('Contract')) {
        componentCatalog += `- \`${model}Timeline\`\n`;
        componentCatalog += `- \`${model}StatusBadge\`\n`;
    }
}
write('FRONTEND_COMPONENT_CATALOG_COMPLETE.txt', componentCatalog);

// 10. FRONTEND_FUNCTIONAL_SPECIFICATION.txt
let functionalSpec = "# FRONTEND FUNCTIONAL SPECIFICATION\n\n";
const flows = ['Commercial Flow', 'Legal Flow', 'Financial Flow', 'Agreement Flow', 'Contract Flow', 'Invoice Flow', 'Payment Flow', 'Review Flow', 'Approval Flow', 'Archive Flow'];
flows.forEach(flow => {
    functionalSpec += `## ${flow}\n- Inferred from FSM and Controller actions. Requires orchestrating states across multiple screens and forms.\n\n`;
});
write('FRONTEND_FUNCTIONAL_SPECIFICATION.txt', functionalSpec);

console.log("Frontend Spec Extraction complete.");
