import { CreateRbacDto } from './dto/create-rbac.dto';
import { UpdateRbacDto } from './dto/update-rbac.dto';
export declare class RbacService {
    create(createRbacDto: CreateRbacDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRbacDto: UpdateRbacDto): string;
    remove(id: number): string;
}
