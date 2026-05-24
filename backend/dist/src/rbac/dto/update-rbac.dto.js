"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRbacDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_rbac_dto_1 = require("./create-rbac.dto");
class UpdateRbacDto extends (0, mapped_types_1.PartialType)(create_rbac_dto_1.CreateRbacDto) {
}
exports.UpdateRbacDto = UpdateRbacDto;
//# sourceMappingURL=update-rbac.dto.js.map