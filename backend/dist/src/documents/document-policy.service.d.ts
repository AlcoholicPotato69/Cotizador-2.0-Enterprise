export interface Document {
    legalHold: boolean;
    retentionUntil: Date | null;
}
export declare class DocumentPolicyService {
    canDelete(document: Document): boolean;
    canArchive(document: Document): boolean;
    canPurge(document: Document): boolean;
}
