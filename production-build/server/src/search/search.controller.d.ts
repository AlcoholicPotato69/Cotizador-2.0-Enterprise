import { GlobalSearchEngineService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: GlobalSearchEngineService);
    globalSearch(query: string): Promise<unknown>;
}
