"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSnapshotDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_snapshot_dto_1 = require("./create-snapshot.dto");
class UpdateSnapshotDto extends (0, mapped_types_1.PartialType)(create_snapshot_dto_1.CreateSnapshotDto) {
}
exports.UpdateSnapshotDto = UpdateSnapshotDto;
//# sourceMappingURL=update-snapshot.dto.js.map