var rbac = require(`${__hooks}/utils/permissions.js`);

/**
 * MATRIZ DE COBERTURA DE HOOKS (Backend Enforcement & Tenant Isolation)
 * Protege contra Frontend Tampering interceptando las llamadas REST.
 */
// 1. CREATE
onRecordCreateRequest((e) => {
  const rbac = require(`${__hooks}/utils/permissions.js`);
  rbac.enforceRbac(e, "create", $app);
  return e.next();
});

// 2. UPDATE
onRecordUpdateRequest((e) => {
  const rbac = require(`${__hooks}/utils/permissions.js`);
  rbac.enforceRbac(e, "update", $app);
  return e.next();
});

// 3. DELETE
onRecordDeleteRequest((e) => {
  const rbac = require(`${__hooks}/utils/permissions.js`);
  rbac.enforceRbac(e, "delete", $app);
  return e.next();
});

// 4. VIEW (Optional for strict isolation on Fetch - note that PB API Rules usually handle lists, but this handles single views)
onRecordViewRequest((e) => {
  const rbac = require(`${__hooks}/utils/permissions.js`);
  // Solo aplicamos a las colecciones protegidas
  if (rbac.protectedCollections[e.collection.name]) {
     rbac.enforceRbac(e, "view", $app);
  }
  return e.next();
});
