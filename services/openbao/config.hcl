# OpenBao Server Configuration (Production)
# For development, use docker-compose with -dev mode

ui = true

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = false
  tls_cert_file = "/opt/openbao/tls/server.crt"
  tls_key_file  = "/opt/openbao/tls/server.key"
}

storage "postgresql" {
  connection_url = "postgres://openbao:password@postgres:5432/openbao?sslmode=require"
  ha_enabled     = true
}

# Auto-unseal with cloud KMS (production)
# seal "awskms" {
#   region     = "eu-central-1"
#   kms_key_id = "your-kms-key-id"
# }

# Telemetry
telemetry {
  disable_hostname = true
  prometheus_retention_time = "30s"
}
