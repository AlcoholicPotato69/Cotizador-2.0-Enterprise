import { http } from '../api/http';

export interface Space {
    id: string;
    tenantId: string;
    name: string;
    code?: string;
    capacity: number;
    areaSqm: number;
    basePricePerHour: number;
    status: string;
    description: string;
    color?: string;
    tags?: any;
    spaceType: string;
    material?: string;
    width?: number;
    height?: number;
    measureUnit?: string;
    location?: string;
    allowsAgreement: boolean;
    isDigital: boolean;
    images?: any;
    createdAt?: Date;
    updatedAt?: Date;
}

export const spaceService = {
    async getAll(): Promise<Space[]> {
        const res = await http.get('/spaces');
        return res.data.data || res.data;
    },
    async getById(id: string): Promise<Space> {
        const res = await http.get(`/spaces/${id}`);
        return res.data.data || res.data;
    },
    async create(data: Partial<Space>): Promise<Space> {
        const res = await http.post('/spaces', data);
        return res.data.data || res.data;
    },
    async update(id: string, data: Partial<Space>): Promise<Space> {
        const res = await http.put(`/spaces/${id}`, data);
        return res.data.data || res.data;
    },
    async remove(id: string): Promise<void> {
        await http.delete(`/spaces/${id}`);
    }
};
