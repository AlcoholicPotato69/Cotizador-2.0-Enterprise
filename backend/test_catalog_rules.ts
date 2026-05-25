import { SpacesService } from './src/spaces/spaces.service';
import { CreateSpaceDto } from './src/spaces/dto/create-space.dto';
import { tenantContext } from './src/prisma/tenant-context';
import { SpaceStatus } from '@prisma/client';

async function testRules() {
  const dummyRepo = {
    create: async (data: any) => ({ id: '123', ...data }),
    update: async (tenantId: string, id: string, data: any) => ({ id, ...data }),
    findById: async () => null,
  } as any;

  const dummyEventPublisher = {
    publish: async () => {}
  } as any;

  const service = new SpacesService(dummyRepo, dummyEventPublisher);

  console.log('--- TEST 1: Plaza Mayor can create Publicidad Física ---');
  await new Promise<void>((resolve) => {
    tenantContext.run({ tenantId: 'pm', userId: 'user1', role: 'ADMIN' }, async () => {
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
        } as CreateSpaceDto);
        console.log('✅ Success: PM created Publicidad Física');
      } catch (e: any) {
        console.error('❌ Failed:', e.message);
      }
      resolve();
    });
  });

  console.log('\n--- TEST 2: Plaza Mayor CANNOT create Salones ---');
  await new Promise<void>((resolve) => {
    tenantContext.run({ tenantId: 'pm', userId: 'user1', role: 'ADMIN' }, async () => {
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
        } as CreateSpaceDto);
        console.log('❌ Failed: PM created Salones when it should not be allowed');
      } catch (e: any) {
        console.log('✅ Success (Blocked):', e.message);
      }
      resolve();
    });
  });

  console.log('\n--- TEST 3: Casa de Piedra can create Salones ---');
  await new Promise<void>((resolve) => {
    tenantContext.run({ tenantId: 'cp', userId: 'user1', role: 'ADMIN' }, async () => {
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
        } as CreateSpaceDto);
        console.log('✅ Success: CP created Salones');
      } catch (e: any) {
        console.error('❌ Failed:', e.message);
      }
      resolve();
    });
  });

  console.log('\n--- TEST 4: Space missing planoPdf is rejected ---');
  await new Promise<void>((resolve) => {
    tenantContext.run({ tenantId: 'cp', userId: 'user1', role: 'ADMIN' }, async () => {
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
        } as CreateSpaceDto);
        console.log('❌ Failed: Space created without planoPdf');
      } catch (e: any) {
        console.log('✅ Success (Blocked):', e.message);
      }
      resolve();
    });
  });

  console.log('\n--- TEST 5: Space missing regulationTemplate is rejected ---');
  await new Promise<void>((resolve) => {
    tenantContext.run({ tenantId: 'cp', userId: 'user1', role: 'ADMIN' }, async () => {
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
        } as CreateSpaceDto);
        console.log('❌ Failed: Space created without regulationTemplate');
      } catch (e: any) {
        console.log('✅ Success (Blocked):', e.message);
      }
      resolve();
    });
  });
}

testRules().catch(console.error);
