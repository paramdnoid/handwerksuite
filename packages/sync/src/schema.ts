import { Schema, Table, Column, ColumnType } from "@powersync/web";

const projects = new Table({
  name: "projects",
  columns: [
    new Column({ name: "company_id", type: ColumnType.TEXT }),
    new Column({ name: "project_number", type: ColumnType.TEXT }),
    new Column({ name: "customer_id", type: ColumnType.TEXT }),
    new Column({ name: "assigned_to", type: ColumnType.TEXT }),
    new Column({ name: "title", type: ColumnType.TEXT }),
    new Column({ name: "description", type: ColumnType.TEXT }),
    new Column({ name: "status", type: ColumnType.TEXT }),
    new Column({ name: "priority", type: ColumnType.TEXT }),
    new Column({ name: "estimated_hours", type: ColumnType.INTEGER }),
    new Column({ name: "actual_hours", type: ColumnType.INTEGER }),
    new Column({ name: "estimated_cost", type: ColumnType.REAL }),
    new Column({ name: "actual_cost", type: ColumnType.REAL }),
    new Column({ name: "encrypted_notes", type: ColumnType.TEXT }),
    new Column({ name: "start_date", type: ColumnType.TEXT }),
    new Column({ name: "end_date", type: ColumnType.TEXT }),
    new Column({ name: "completed_at", type: ColumnType.TEXT }),
    new Column({ name: "created_by", type: ColumnType.TEXT }),
    new Column({ name: "updated_by", type: ColumnType.TEXT }),
    new Column({ name: "created_at", type: ColumnType.TEXT }),
    new Column({ name: "updated_at", type: ColumnType.TEXT }),
    new Column({ name: "deleted_at", type: ColumnType.TEXT }),
  ],
});

const customers = new Table({
  name: "customers",
  columns: [
    new Column({ name: "company_id", type: ColumnType.TEXT }),
    new Column({ name: "customer_number", type: ColumnType.TEXT }),
    new Column({ name: "type", type: ColumnType.TEXT }),
    new Column({ name: "company_name", type: ColumnType.TEXT }),
    new Column({ name: "first_name", type: ColumnType.TEXT }),
    new Column({ name: "last_name", type: ColumnType.TEXT }),
    new Column({ name: "encrypted_email", type: ColumnType.TEXT }),
    new Column({ name: "encrypted_phone", type: ColumnType.TEXT }),
    new Column({ name: "encrypted_address", type: ColumnType.TEXT }),
    new Column({ name: "tax_id", type: ColumnType.TEXT }),
    new Column({ name: "notes", type: ColumnType.TEXT }),
    new Column({ name: "created_by", type: ColumnType.TEXT }),
    new Column({ name: "updated_by", type: ColumnType.TEXT }),
    new Column({ name: "created_at", type: ColumnType.TEXT }),
    new Column({ name: "updated_at", type: ColumnType.TEXT }),
    new Column({ name: "deleted_at", type: ColumnType.TEXT }),
  ],
});

const companyModules = new Table({
  name: "company_modules",
  columns: [
    new Column({ name: "company_id", type: ColumnType.TEXT }),
    new Column({ name: "module_id", type: ColumnType.TEXT }),
    new Column({ name: "is_active", type: ColumnType.INTEGER }),
    new Column({ name: "activated_at", type: ColumnType.TEXT }),
    new Column({ name: "deactivated_at", type: ColumnType.TEXT }),
  ],
});

export const appSchema = new Schema([projects, customers, companyModules]);
