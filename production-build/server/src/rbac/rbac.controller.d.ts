import { RbacService } from './rbac.service';
import { CreateRbacDto } from './dto/create-rbac.dto';
import { UpdateRbacDto } from './dto/update-rbac.dto';
export declare class RbacController {
    private readonly rbacService;
    constructor(rbacService: RbacService);
    create(createRbacDto: CreateRbacDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateRbacDto: UpdateRbacDto): string;
    remove(id: string): string;
}
