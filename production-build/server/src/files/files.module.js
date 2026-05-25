"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesModule = void 0;
const common_1 = require("@nestjs/common");
const client_file_repository_1 = require("./client-file/client-file.repository");
const client_file_service_1 = require("./client-file/client-file.service");
const client_file_controller_1 = require("./client-file/client-file.controller");
const quote_file_repository_1 = require("./quote-file/quote-file.repository");
const quote_file_service_1 = require("./quote-file/quote-file.service");
const quote_file_controller_1 = require("./quote-file/quote-file.controller");
const contract_file_repository_1 = require("./contract-file/contract-file.repository");
const contract_file_service_1 = require("./contract-file/contract-file.service");
const contract_file_controller_1 = require("./contract-file/contract-file.controller");
const agreement_file_repository_1 = require("./agreement-file/agreement-file.repository");
const agreement_file_service_1 = require("./agreement-file/agreement-file.service");
const agreement_file_controller_1 = require("./agreement-file/agreement-file.controller");
const financial_file_repository_1 = require("./financial-file/financial-file.repository");
const financial_file_service_1 = require("./financial-file/financial-file.service");
const financial_file_controller_1 = require("./financial-file/financial-file.controller");
const document_viewer_service_1 = require("./document-viewer/document-viewer.service");
const document_viewer_controller_1 = require("./document-viewer/document-viewer.controller");
let FilesModule = class FilesModule {
};
exports.FilesModule = FilesModule;
exports.FilesModule = FilesModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [
            client_file_controller_1.ClientFileController,
            quote_file_controller_1.QuoteFileController,
            contract_file_controller_1.ContractFileController,
            agreement_file_controller_1.AgreementFileController,
            financial_file_controller_1.FinancialFileController,
            document_viewer_controller_1.DocumentViewerController,
        ],
        providers: [
            client_file_repository_1.ClientFileRepository,
            client_file_service_1.ClientFileService,
            quote_file_repository_1.QuoteFileRepository,
            quote_file_service_1.QuoteFileService,
            contract_file_repository_1.ContractFileRepository,
            contract_file_service_1.ContractFileService,
            agreement_file_repository_1.AgreementFileRepository,
            agreement_file_service_1.AgreementFileService,
            financial_file_repository_1.FinancialFileRepository,
            financial_file_service_1.FinancialFileService,
            document_viewer_service_1.DocumentViewerService,
        ],
        exports: [
            client_file_service_1.ClientFileService,
            quote_file_service_1.QuoteFileService,
            contract_file_service_1.ContractFileService,
            agreement_file_service_1.AgreementFileService,
            financial_file_service_1.FinancialFileService,
            document_viewer_service_1.DocumentViewerService,
        ],
    })
], FilesModule);
//# sourceMappingURL=files.module.js.map