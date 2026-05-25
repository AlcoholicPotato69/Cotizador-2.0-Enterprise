"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spaces_service_1 = require("./src/spaces/spaces.service");
const tenant_context_1 = require("./src/prisma/tenant-context");
async function testRules() {
    const dummyRepo = {
        create: async (data) => ({ id: '123', ...data }),
        update: async (tenantId, id, data) => ({ id, ...data }),
        findById: async () => null,
    };
    const dummyEventPublisher = {
        publish: async () => { }
    };
    const service = new spaces_service_1.SpacesService(dummyRepo, dummyEventPublisher);
    console.log('--- TEST 1: Plaza Mayor can create Publicidad Física ---');
    await new Promise((resolve) => {
        tenant_context_1.tenantContext.run({ tenantId: 'pm', userId: 'user1', role: 'ADMIN' }, async () => {
            try {
                await service.create({
                    name: 'Anuncio 1',
                    capacity: 0,
                    areaSqm: 10,
                    basePricePerHour: 100,
                    configB2b: {},
                    preciosPorDia: {},
                    diasBloqueados: [],
                    impuestosIds: [],
                    description: 'Desc',
                    tags: {},
                    images: {},
                    spaceType: 'Publicidad Física',
                    planoPdf: 'url_al_plano.pdf',
                    regulationTemplate: 'reglas.pdf',
                });
                console.log('✅ Success: PM created Publicidad Física');
            }
            catch (e) {
                console.error('❌ Failed:', e.message);
            }
            resolve();
        });
    });
    console.log('\n--- TEST 2: Plaza Mayor CANNOT create Salones ---');
    await new Promise((resolve) => {
        tenant_context_1.tenantContext.run({ tenantId: 'pm', userId: 'user1', role: 'ADMIN' }, async () => {
            try {
                await service.create({
                    name: 'Salon 1',
                    capacity: 100,
                    areaSqm: 100,
                    basePricePerHour: 1000,
                    configB2b: {},
                    preciosPorDia: {},
                    diasBloqueados: [],
                    impuestosIds: [],
                    description: 'Desc',
                    tags: {},
                    images: {},
                    spaceType: 'Salones',
                    planoPdf: 'url_al_plano.pdf',
                    regulationTemplate: 'reglas.pdf',
                });
                console.log('❌ Failed: PM created Salones when it should not be allowed');
            }
            catch (e) {
                console.log('✅ Success (Blocked):', e.message);
            }
            resolve();
        });
    });
    console.log('\n--- TEST 3: Casa de Piedra can create Salones ---');
    await new Promise((resolve) => {
        tenant_context_1.tenantContext.run({ tenantId: 'cp', userId: 'user1', role: 'ADMIN' }, async () => {
            try {
                await service.create({
                    name: 'Salon 1',
                    capacity: 100,
                    areaSqm: 100,
                    basePricePerHour: 1000,
                    configB2b: {},
                    preciosPorDia: {},
                    diasBloqueados: [],
                    impuestosIds: [],
                    description: 'Desc',
                    tags: {},
                    images: {},
                    spaceType: 'Salones',
                    planoPdf: 'url_al_plano.pdf',
                    regulationTemplate: 'reglas.pdf',
                });
                console.log('✅ Success: CP created Salones');
            }
            catch (e) {
                console.error('❌ Failed:', e.message);
            }
            resolve();
        });
    });
    console.log('\n--- TEST 4: Space missing planoPdf is rejected ---');
    await new Promise((resolve) => {
        tenant_context_1.tenantContext.run({ tenantId: 'cp', userId: 'user1', role: 'ADMIN' }, async () => {
            try {
                await service.create({
                    name: 'Salon 1',
                    capacity: 100,
                    areaSqm: 100,
                    basePricePerHour: 1000,
                    configB2b: {},
                    preciosPorDia: {},
                    diasBloqueados: [],
                    impuestosIds: [],
                    description: 'Desc',
                    tags: {},
                    images: {},
                    spaceType: 'Salones',
                    planoPdf: '',
                    regulationTemplate: 'reglas.pdf',
                });
                console.log('❌ Failed: Space created without planoPdf');
            }
            catch (e) {
                console.log('✅ Success (Blocked):', e.message);
            }
            resolve();
        });
    });
    console.log('\n--- TEST 5: Space missing regulationTemplate is rejected ---');
    await new Promise((resolve) => {
        tenant_context_1.tenantContext.run({ tenantId: 'cp', userId: 'user1', role: 'ADMIN' }, async () => {
            try {
                await service.create({
                    name: 'Salon 1',
                    capacity: 100,
                    areaSqm: 100,
                    basePricePerHour: 1000,
                    configB2b: {},
                    preciosPorDia: {},
                    diasBloqueados: [],
                    impuestosIds: [],
                    description: 'Desc',
                    tags: {},
                    images: {},
                    spaceType: 'Salones',
                    planoPdf: 'url_al_plano.pdf',
                    regulationTemplate: '',
                });
                console.log('❌ Failed: Space created without regulationTemplate');
            }
            catch (e) {
                console.log('✅ Success (Blocked):', e.message);
            }
            resolve();
        });
    });
}
testRules().catch(console.error);
//# sourceMappingURL=test_catalog_rules.js.map