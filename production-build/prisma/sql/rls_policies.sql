-- Habilitar RLS en todas las tablas transaccionales
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Role" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Permission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Client" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Space" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SpaceOccupancy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NotificationQueue" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Quote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Contract" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Signature" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;

-- Política Híbrida: Un usuario puede ver los registros de su Tenant o todo si es 'staff'
CREATE OR REPLACE FUNCTION is_staff() RETURNS BOOLEAN AS $$
BEGIN
  RETURN current_setting('app.current_role', true) = 'staff';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_current_tenant_id() RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id', true);
END;
$$ LANGUAGE plpgsql;

-- Definición de Políticas con ESTRATEGIA HÍBRIDA
CREATE POLICY "Tenant isolation for User" ON "User" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for Role" ON "Role" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for Permission" ON "Permission" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for Client" ON "Client" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for Space" ON "Space" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for SpaceOccupancy" ON "SpaceOccupancy" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for Document" ON "Document" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for NotificationQueue" ON "NotificationQueue" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for Quote" ON "Quote" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for Contract" ON "Contract" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for Signature" ON "Signature" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for Invoice" ON "Invoice" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for Payment" ON "Payment" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());

ALTER TABLE "ArchivePolicy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ArchiveJob" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ArchiveRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GlobalSearchIndex" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for ArchivePolicy" ON "ArchivePolicy" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for ArchiveJob" ON "ArchiveJob" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for ArchiveRecord" ON "ArchiveRecord" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
CREATE POLICY "Tenant isolation for GlobalSearchIndex" ON "GlobalSearchIndex" FOR ALL USING (tenant_id = get_current_tenant_id() OR is_staff());
