-- Row Level Security Policies for ZunftGewerk
-- Apply after running Drizzle migrations

-- ── Companies ─────────────────────────────────────────────
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY company_self_access ON companies
  FOR ALL
  USING (id = current_company_id() AND deleted_at IS NULL);

CREATE POLICY authority_read_assigned ON companies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM authority_assignments aa
      WHERE aa.authority_company_id = current_company_id()
        AND aa.craft_company_id = companies.id
        AND aa.revoked_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- ── Company Settings ──────────────────────────────────────
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY company_settings_isolation ON company_settings
  FOR ALL
  USING (company_id = current_company_id());

-- ── Company Members ───────────────────────────────────────
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY company_members_isolation ON company_members
  FOR ALL
  USING (company_id = current_company_id());

-- ── Invitations ───────────────────────────────────────────
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY invitations_isolation ON invitations
  FOR ALL
  USING (company_id = current_company_id());

-- ── Projects ──────────────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY project_company_isolation ON projects
  FOR ALL
  USING (company_id = current_company_id() AND deleted_at IS NULL);

-- ── Customers ─────────────────────────────────────────────
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY customer_company_isolation ON customers
  FOR ALL
  USING (company_id = current_company_id() AND deleted_at IS NULL);

-- ── Company Modules ───────────────────────────────────────
ALTER TABLE company_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY company_modules_isolation ON company_modules
  FOR ALL
  USING (company_id = current_company_id());

-- ── Modules (read-only for all authenticated users) ──────
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY modules_read_all ON modules
  FOR SELECT
  USING (true);

-- ── Craft Type Modules (read-only for all) ───────────────
ALTER TABLE craft_type_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY craft_type_modules_read_all ON craft_type_modules
  FOR SELECT
  USING (true);

-- ── Audit Log ─────────────────────────────────────────────
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_log_company_isolation ON audit_log
  FOR ALL
  USING (company_id = current_company_id());

-- ── Authority Assignments ─────────────────────────────────
ALTER TABLE authority_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY authority_assignments_authority ON authority_assignments
  FOR SELECT
  USING (authority_company_id = current_company_id());

CREATE POLICY authority_assignments_craft ON authority_assignments
  FOR SELECT
  USING (craft_company_id = current_company_id());

-- ── Apply updated_at triggers ─────────────────────────────
CREATE TRIGGER set_updated_at_companies
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_company_settings
  BEFORE UPDATE ON company_settings
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_customers
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ── CHECK Constraint for craft_type ───────────────────────
ALTER TABLE companies ADD CONSTRAINT company_craft_type_check CHECK (
  (company_type = 'authority' AND craft_type IS NULL) OR
  (company_type = 'craft_business' AND craft_type IS NOT NULL)
);
