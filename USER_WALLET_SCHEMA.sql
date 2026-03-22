-- ============================================================================
-- USER WALLET ADDRESSES SCHEMA
-- ============================================================================
-- This schema manages user wallet/deposit addresses for individual users
-- Admin can add, edit, delete wallet addresses per user
-- Supports both DEPOSIT and PURCHASE transaction types
-- ============================================================================

-- Main user wallet addresses table
CREATE TABLE IF NOT EXISTS user_wallet_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  address VARCHAR NOT NULL,
  label VARCHAR,
  type VARCHAR NOT NULL CHECK (type IN ('DEPOSIT', 'PURCHASE')),
  currency VARCHAR DEFAULT 'USD',
  network VARCHAR, -- e.g., TRC20, ERC20, Bitcoin, Ethereum, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure we don't have duplicate addresses for the same user and type
  UNIQUE(user_id, address, type)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_wallet_user_id ON user_wallet_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wallet_type ON user_wallet_addresses(type);
CREATE INDEX IF NOT EXISTS idx_user_wallet_active ON user_wallet_addresses(is_active);
CREATE INDEX IF NOT EXISTS idx_user_wallet_user_type ON user_wallet_addresses(user_id, type);

-- ============================================================================
-- SCHEMA EXPLANATION
-- ============================================================================
-- Columns:
--   id: Unique identifier for each wallet address record (UUID)
--   user_id: Foreign key to user_profiles table (when user is deleted, wallets are deleted)
--   address: The actual wallet/deposit address (e.g., crypto address, bank account)
--   label: Human-readable label (e.g., "Main Deposit", "Trading Account", "Primary Bank")
--   type: Either 'DEPOSIT' (for receiving funds) or 'PURCHASE' (for payments)
--   currency: Currency code (e.g., USD, EUR, USDT, BTC)
--   network: Blockchain network if crypto (TRC20, ERC20, Bitcoin, Litecoin, etc.)
--   is_active: Boolean to soft-delete or disable wallets without removing data
--   created_at: When the wallet was added
--   updated_at: When the wallet was last modified

-- ============================================================================
-- EXAMPLE DATA
-- ============================================================================
-- INSERT INTO user_wallet_addresses 
--   (user_id, address, label, type, currency, network, is_active)
-- VALUES 
--   ('550e8400-e29b-41d4-a716-446655440000', '0x123...abc', 'Main Deposit', 'DEPOSIT', 'USDT', 'ERC20', true),
--   ('550e8400-e29b-41d4-a716-446655440000', '1A1z7a...def', 'Bitcoin Purchase', 'PURCHASE', 'BTC', 'Bitcoin', true),
--   ('550e8400-e29b-41d4-a716-446655440000', '123-456-7890', 'Bank Account', 'DEPOSIT', 'USD', NULL, true);

-- ============================================================================
-- ADMIN OPERATIONS
-- ============================================================================
-- Get all wallets for a specific user:
-- SELECT * FROM user_wallet_addresses WHERE user_id = 'user-uuid' ORDER BY created_at DESC;

-- Get all DEPOSIT wallets (for receiving payments):
-- SELECT * FROM user_wallet_addresses WHERE type = 'DEPOSIT' ORDER BY created_at DESC;

-- Get all PURCHASE wallets (for payments):
-- SELECT * FROM user_wallet_addresses WHERE type = 'PURCHASE' ORDER BY created_at DESC;

-- Enable RLS (Row Level Security) if needed:
-- ALTER TABLE user_wallet_addresses ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view their own wallets" 
--   ON user_wallet_addresses FOR SELECT 
--   USING (user_id = auth.uid());
