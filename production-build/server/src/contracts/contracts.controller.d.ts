import { ContractEngineService } from './contract.service';
export declare class ContractsController {
    private readonly service;
    constructor(service: ContractEngineService);
    getContract(id: string): Promise<any>;
}
