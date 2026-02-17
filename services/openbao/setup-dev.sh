#!/bin/bash
# Development setup script for OpenBao Transit Secret Engine
# Run this after starting docker-compose

set -euo pipefail

VAULT_ADDR="${VAULT_ADDR:-http://localhost:8200}"
VAULT_TOKEN="${VAULT_TOKEN:-dev-vault-token}"

echo "Setting up OpenBao Transit Secret Engine..."
echo "VAULT_ADDR: $VAULT_ADDR"

# Enable Transit Secret Engine
echo "Enabling Transit Secret Engine..."
curl -s -X POST \
  -H "X-Vault-Token: $VAULT_TOKEN" \
  "$VAULT_ADDR/v1/sys/mounts/transit" \
  -d '{"type": "transit"}' || echo "Transit already enabled"

# Create a test tenant key
echo "Creating test tenant key..."
curl -s -X POST \
  -H "X-Vault-Token: $VAULT_TOKEN" \
  "$VAULT_ADDR/v1/transit/keys/tenant-test-kek" \
  -d '{
    "type": "aes256-gcm96",
    "exportable": false,
    "allow_plaintext_backup": false
  }'

# Apply tenant KEK policy
echo "Applying tenant KEK policy..."
curl -s -X PUT \
  -H "X-Vault-Token: $VAULT_TOKEN" \
  "$VAULT_ADDR/v1/sys/policies/acl/tenant-kek" \
  -d "{\"policy\": $(cat policies/tenant-kek.hcl | jq -Rs .)}"

echo ""
echo "OpenBao setup complete!"
echo "Transit engine mounted at: transit/"
echo "Test key created: tenant-test-kek"
