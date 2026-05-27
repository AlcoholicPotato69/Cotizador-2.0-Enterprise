import { http } from '../api/http';

export interface PricingRuleAst {
    type?: string;
    field?: string;
    operator?: string;
    value?: string | number;
    rules?: PricingRuleAst[];
}

export interface PricingRuleAction {
    type: string;
    value: number | string;
}

export interface PricingRule {
    id: string;
    tenant: string;
    name: string;
    rule_type: string;
    status: string;
    conditions_ast: PricingRuleAst;
    action: PricingRuleAction;
    created?: string;
    updated?: string;
}

export const pricingService = {
    async getActiveRules(tenantId: string): Promise<PricingRule[]> {
        const res = await http.get('/rule_registry', {
            params: {
                filter: `tenant = "${tenantId}" && rule_type = "pricing" && status = "active"`,
                sort: '-created'
            }
        });
        return res.data?.data || res.data || [];
    },
    async archiveRule(id: string): Promise<PricingRule> {
        const res = await http.put(`/rule_registry/${id}`, { status: 'archived' });
        return res.data;
    }
};
