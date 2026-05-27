import { ClientStatus } from '@prisma/client';
export declare class CreateClientDto {
    name: string;
    email?: string;
    phone?: string;
    rfc?: string;
    status?: ClientStatus;
    bankReference?: string;
}
