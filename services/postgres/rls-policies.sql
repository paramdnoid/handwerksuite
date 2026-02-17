-- Row Level Security Policies for HandwerkSuite
-- Apply after running Drizzle migrations

-- ── Tenants ─────────────────────────────────────────────
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Craft businesses see only their own tenant
CREATE POLICY tenant_self_access ON tenants
  FOR ALL
  USING (id = current_tenant_id());

-- Authorities can read assigned craft businesses
CREATE POLICY authority_read_assigned ON tenants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM authority_assignments aa
      WHERE aa.authority_tenant_id = current_tenant_id()
        AND aa.craft_tenant_id = tenants.id
        AND aa.revoked_at IS NULL
    )
  );

-- ── Projects ────────────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY project_tenant_isolation ON projects
  FOR ALL
  USING (tenant_id = current_tenant_id());

-- ── Customers ───────────────────────────────────────────
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY customer_tenant_isolation ON customers
  FOR ALL
  USING (tenant_id = current_tenant_id());

-- ── Audit Log ───────────────────────────────────────────
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_log_tenant_isolation ON audit_log
  FOR ALL
  USING (tenant_id = current_tenant_id());

-- ── Tenant Members ──────────────────────────────────────
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_members_isolation ON tenant_members
  FOR ALL
  USING (tenant_id = current_tenant_id());

-- ── Authority Assignments ───────────────────────────────
ALTER TABLE authority_assignments ENABLE ROW LEVEL SECURITY;

-- Authorities see their own assignments
CREATE POLICY authority_assignments_authority ON authority_assignments
  FOR SELECT
  USING (authority_tenant_id = current_tenant_id());

-- Craft businesses see assignments pointing to them
CREATE POLICY authority_assignments_craft ON authority_assignments
  FOR SELECT
  USING (craft_tenant_id = current_tenant_id());
