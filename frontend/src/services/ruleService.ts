import { http } from '../api/http';

export interface Rule {
    id: string;
    tenant: string;
    name: string;
    description?: string;
    rule_type: string;
    status: string;
    version?: number;
    priority?: number;
    is_exclusive?: boolean;
    stop_processing?: boolean;
    conditions_ast: any;
    action: any;
    created?: string;
    updated?: string;
}

export const ruleService = {
    async getActiveRules(tenantId: string, ruleType: string): Promise<Rule[]> {
        const res = await http.get('/rule_registry', {
            params: {
                filter: `tenant = "${tenantId}" && rule_type = "${ruleType}" && status = "active"`,
                sort: '-created'
            }
        });
        return res.data?.data || res.data || [];
    },
    async getFullList(options?: any): Promise<Rule[]> {
        const res = await http.get('/rule_registry', { params: options });
        return res.data?.data || res.data || [];
    },
    async update(id: string, data: Partial<Rule>): Promise<Rule> {
        const res = await http.put(`/rule_registry/${id}`, data);
        return res.data;
    },
    async create(data: Partial<Rule>): Promise<Rule> {
        const res = await http.post('/rule_registry', data);
        return res.data;
    }
};
