# Policy for tenant KEK operations via Transit Secret Engine
# Each application instance gets this policy attached to its token

# Allow encryption/decryption with tenant keys
path "transit/encrypt/tenant-*" {
  capabilities = ["update"]
}

path "transit/decrypt/tenant-*" {
  capabilities = ["update"]
}

# Allow key rotation (admin only)
path "transit/keys/tenant-*/rotate" {
  capabilities = ["update"]
}

# Read key metadata (no export of key material)
path "transit/keys/tenant-*" {
  capabilities = ["read"]
}

# Deny key export and deletion by default
path "transit/export/*" {
  capabilities = ["deny"]
}
