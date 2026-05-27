import { Project, SyntaxKind, ClassDeclaration, EnumDeclaration, Decorator } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

const AI_CONTEXT_DIR = path.join(__dirname, '..', 'ai-context');
if (!fs.existsSync(AI_CONTEXT_DIR)) {
  fs.mkdirSync(AI_CONTEXT_DIR, { recursive: true });
}

const project = new Project({
  tsConfigFilePath: path.join(__dirname, 'tsconfig.json'),
});

function write(filename: string, content: string) {
  fs.writeFileSync(path.join(AI_CONTEXT_DIR, filename), content, 'utf-8');
}

// ---------------------------------------------------------
// 02. DOMAIN DICTIONARY (From Prisma)
// ---------------------------------------------------------
const prismaSchema = fs.readFileSync(path.join(__dirname, 'prisma', 'schema.prisma'), 'utf-8');
const models = [...prismaSchema.matchAll(/model\s+(\w+)\s+\{([\s\S]*?)\}/g)];
const enums = [...prismaSchema.matchAll(/enum\s+(\w+)\s+\{([\s\S]*?)\}/g)];

let domainDict = "# DOMAIN DICTIONARY\n\n## Models\n";
for (const match of models) {
  domainDict += `### ${match[1]}\n\`\`\`prisma\n${match[2].trim()}\n\`\`\`\n\n`;
}
domainDict += "## Enums\n";
for (const match of enums) {
  domainDict += `### ${match[1]}\n\`\`\`prisma\n${match[2].trim()}\n\`\`\`\n\n`;
}
write('02_DOMAIN_DICTIONARY.txt', domainDict);

// ---------------------------------------------------------
// 03. PERMISSION MATRIX
// ---------------------------------------------------------
let permissionMatrix = "# PERMISSION MATRIX\n\n";
const sourceFiles = project.getSourceFiles();

const permissionsMap = new Map<string, string[]>();

for (const sf of sourceFiles) {
  const classes = sf.getClasses();
  for (const cls of classes) {
    const methods = cls.getMethods();
    for (const method of methods) {
      const decorators = method.getDecorators();
      const permsDecorator = decorators.find(d => d.getName() === 'RequirePermissions' || d.getName() === 'Permissions');
      if (permsDecorator) {
        const args = permsDecorator.getArguments().map(a => a.getText());
        const key = `${cls.getName()}::${method.getName()}`;
        permissionsMap.set(key, args);
      }
    }
  }
}

if (permissionsMap.size === 0) {
    // Try grep style fallback
    for (const sf of sourceFiles) {
        const text = sf.getFullText();
        const matches = [...text.matchAll(/@(?:Require)?Permissions?\(([^)]+)\)/g)];
        for (const m of matches) {
            permissionMatrix += `- Found Decorator: ${m[0]} in ${sf.getBaseName()}\n`;
        }
    }
}

for (const [key, perms] of permissionsMap.entries()) {
  permissionMatrix += `- **${key}** requires: ${perms.join(', ')}\n`;
}
write('03_PERMISSION_MATRIX.txt', permissionMatrix || "NOT_IMPLEMENTED");

// ---------------------------------------------------------
// 04. FSM STATES
// ---------------------------------------------------------
let fsmStates = "# FSM STATES\n\n";
let foundStates = false;
for (const match of enums) {
  if (match[1].includes('Status') || match[1].includes('State')) {
    foundStates = true;
    fsmStates += `### ${match[1]}\n\`\`\`prisma\n${match[2].trim()}\n\`\`\`\n\n`;
  }
}
if (!foundStates) fsmStates += "NOT_IMPLEMENTED";
write('04_FSM_STATES.txt', fsmStates);

// ---------------------------------------------------------
// 05. DTO CATALOG
// ---------------------------------------------------------
let dtoCatalog = "# DTO CATALOG\n\n";
for (const sf of sourceFiles) {
  if (sf.getBaseName().includes('.dto.')) {
    const classes = sf.getClasses();
    for (const cls of classes) {
      dtoCatalog += `### ${cls.getName()}\n`;
      dtoCatalog += `File: ${sf.getFilePath()}\n`;
      for (const prop of cls.getProperties()) {
        const typeNode = prop.getTypeNode();
        const decorators = prop.getDecorators().map(d => d.getName());
        dtoCatalog += `- ${prop.getName()}: ${typeNode ? typeNode.getText() : 'any'} [Decorators: ${decorators.join(', ')}]\n`;
      }
      dtoCatalog += '\n';
    }
  }
}
write('05_DTO_CATALOG.txt', dtoCatalog || "NOT_IMPLEMENTED");

// ---------------------------------------------------------
// 09. DOMAIN EVENTS
// ---------------------------------------------------------
let eventsText = "# DOMAIN EVENTS\n\n";
for (const sf of sourceFiles) {
  const classes = sf.getClasses();
  for (const cls of classes) {
    const methods = cls.getMethods();
    for (const method of methods) {
      const onEvent = method.getDecorators().find(d => d.getName() === 'OnEvent');
      if (onEvent) {
        eventsText += `- **Consumer**: ${cls.getName()}::${method.getName()} -> listents to ${onEvent.getArguments().map(a => a.getText()).join(', ')}\n`;
      }
    }
  }
}
// Also search for emitters
for (const sf of sourceFiles) {
    const text = sf.getFullText();
    const emitMatches = [...text.matchAll(/\.emit\(\s*['"]([^'"]+)['"]/g)];
    for (const m of emitMatches) {
        eventsText += `- **Producer Emit**: Event '${m[1]}' in ${sf.getBaseName()}\n`;
    }
}
write('09_DOMAIN_EVENTS.txt', eventsText || "NOT_IMPLEMENTED");

// ---------------------------------------------------------
// 06, 07, 08. BUSINESS LOGIC (Extracted from Services)
// ---------------------------------------------------------
let servicesText = "# BUSINESS RULES AND PROCESSES (Extracted from Services)\n\n";
for (const sf of sourceFiles) {
  if (sf.getBaseName().includes('.service.')) {
    const classes = sf.getClasses();
    for (const cls of classes) {
      servicesText += `### Service: ${cls.getName()}\n`;
      const methods = cls.getMethods();
      for (const method of methods) {
        const params = method.getParameters().map(p => `${p.getName()}: ${p.getTypeNode()?.getText() || 'any'}`);
        servicesText += `- ${method.getName()}(${params.join(', ')}) -> ${method.getReturnTypeNode()?.getText() || 'any'}\n`;
      }
      servicesText += '\n';
    }
  }
}

write('06_BUSINESS_RULES.txt', servicesText);
write('07_BUSINESS_PROCESSES.txt', servicesText); // Using same for now, studio can infer
write('08_USE_CASES.txt', servicesText); // Using same for now, studio can infer

// ---------------------------------------------------------
// 10, 11, 12, 13. ENGINES
// ---------------------------------------------------------
// Find relevant modules or just mark NOT_IMPLEMENTED if not explicitly found
const checkEngine = (keyword: string) => {
    let result = `# ${keyword.toUpperCase()} ENGINE\n\n`;
    let found = false;
    for (const sf of sourceFiles) {
        if (sf.getFilePath().toLowerCase().includes(keyword.toLowerCase())) {
            found = true;
            result += `Found in ${sf.getBaseName()}\n`;
            sf.getClasses().forEach(cls => {
                result += `- Class: ${cls.getName()}\n`;
                cls.getMethods().forEach(m => {
                    result += `  - Method: ${m.getName()}\n`;
                });
            });
        }
    }
    return found ? result : "NOT_IMPLEMENTED";
};

write('10_DOCUMENT_ENGINE.txt', checkEngine('document'));
write('11_DOSSIER_ENGINE.txt', checkEngine('dossier'));
write('12_WORKFLOW_ENGINE.txt', checkEngine('workflow'));
write('13_NOTIFICATION_ENGINE.txt', checkEngine('notification'));

// ---------------------------------------------------------
// 01, 14, 15, 16, 17, 18. OTHERS
// ---------------------------------------------------------
write('01_PROJECT_OVERVIEW.txt', "Project: Cotizador 2.0 Enterprise\nSource: Backend Analysis\nExtracted directly from backend reality.");
write('14_FRONTEND_ARCHITECTURE.txt', "NOT_IMPLEMENTED\nBackend Only Extraction");
write('15_DESIGN_SYSTEM.txt', "NOT_IMPLEMENTED\nBackend Only Extraction");
write('16_UI_COMPONENT_LIBRARY.txt', "NOT_IMPLEMENTED\nBackend Only Extraction");

// UI Domain Map from Controllers
let uiDomainMap = "# UI DOMAIN MAP (Inferred from Controllers)\n\n";
for (const sf of sourceFiles) {
  if (sf.getBaseName().includes('.controller.')) {
    const classes = sf.getClasses();
    for (const cls of classes) {
      uiDomainMap += `### Controller: ${cls.getName()}\n`;
      const methods = cls.getMethods();
      for (const method of methods) {
          const decorators = method.getDecorators().map(d => d.getName());
          const route = method.getDecorators().find(d => ['Get', 'Post', 'Put', 'Delete', 'Patch'].includes(d.getName()));
          const routePath = route ? route.getArguments().map(a => a.getText()).join(', ') : '';
          uiDomainMap += `- Endpoint: [${route ? route.getName() : 'Unknown'}] ${routePath} -> ${method.getName()} (Decorators: ${decorators.join(', ')})\n`;
      }
      uiDomainMap += '\n';
    }
  }
}
write('17_UI_DOMAIN_MAP.txt', uiDomainMap || "NOT_IMPLEMENTED");
write('18_GOOGLE_STUDIO_RULES.txt', "MUST USE EXACT DATA FROM THESE FILES. NO ASSUMPTIONS.");

console.log("Extraction complete.");
