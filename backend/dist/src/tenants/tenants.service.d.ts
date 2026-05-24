import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantsService {
    create(createTenantDto: CreateTenantDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTenantDto: UpdateTenantDto): string;
    remove(id: number): string;
}
