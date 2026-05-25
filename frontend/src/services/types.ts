export interface QueryParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC' | 'asc' | 'desc';
    search?: string;
    [key: string]: any;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}
