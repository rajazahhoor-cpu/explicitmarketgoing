import React, { useState } from 'react';
import { Edit2, Trash2, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { Wallet, BankAccount } from '../lib/types';

interface WalletBankManagementTabProps {
  wallets: Wallet[];
  bankAccounts: BankAccount[];
  allUsers: any[];
  addWallet: (userId: string, address: string, label: string, type: 'DEPOSIT' | 'PURCHASE', currency: string, network?: string) => Promise<void>;
  editWallet: (walletId: string, updates: Partial<Wallet>) => Promise<void>;
  removeWallet: (walletId: string) => Promise<void>;
  addBankAccount: (accountName: string, accountNumber: string, bankName: string, routingNumber: string, accountType: 'CHECKING' | 'SAVINGS', currency: string, country: string, type: 'DEPOSIT' | 'WITHDRAWAL', swiftCode?: string, iban?: string) => void;
  editBankAccount: (accountId: string, updates: Partial<BankAccount>) => void;
  removeBankAccount: (accountId: string) => void;
  toggleBankAccountStatus: (accountId: string) => void;
}

export function WalletBankManagementTab({
  wallets,
  bankAccounts,
  allUsers,
  addWallet,
  editWallet,
  removeWallet,
  addBankAccount,
  editBankAccount,
  removeBankAccount,
  toggleBankAccountStatus
}: WalletBankManagementTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'bank' | 'wallets'>('bank');
  const [bankForm, setBankForm] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    routingNumber: '',
    swiftCode: '',
    iban: '',
    accountType: 'CHECKING' as 'CHECKING' | 'SAVINGS',
    currency: 'USD',
    country: '',
    type: 'DEPOSIT' as 'DEPOSIT' | 'WITHDRAWAL'
  });

  const [editingBankId, setEditingBankId] = useState<string | null>(null);

  const [walletForm, setWalletForm] = useState({
    userId: '',
    address: '',
    label: '',
    type: 'DEPOSIT' as 'DEPOSIT' | 'PURCHASE',
    currency: 'USD',
    network: ''
  });

  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);

  const updateBankFormField = (field: string, value: any) => {
    setBankForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddBankAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    if (bankForm.accountName && bankForm.accountNumber && bankForm.bankName && bankForm.routingNumber && bankForm.currency && bankForm.country) {
      if (editingBankId) {
        editBankAccount(editingBankId, {
          accountName: bankForm.accountName,
          accountNumber: bankForm.accountNumber,
          bankName: bankForm.bankName,
          routingNumber: bankForm.routingNumber,
          swiftCode: bankForm.swiftCode,
          iban: bankForm.iban,
          accountType: bankForm.accountType,
          currency: bankForm.currency,
          country: bankForm.country,
          type: bankForm.type
        });
        setEditingBankId(null);
      } else {
        addBankAccount(
          bankForm.accountName,
          bankForm.accountNumber,
          bankForm.bankName,
          bankForm.routingNumber,
          bankForm.accountType,
          bankForm.currency,
          bankForm.country,
          bankForm.type,
          bankForm.swiftCode || undefined,
          bankForm.iban || undefined
        );
      }
      resetBankForm();
    }
  };

  const resetBankForm = () => {
    setBankForm({
      accountName: '',
      accountNumber: '',
      bankName: '',
      routingNumber: '',
      swiftCode: '',
      iban: '',
      accountType: 'CHECKING',
      currency: 'USD',
      country: '',
      type: 'DEPOSIT'
    });
    setEditingBankId(null);
  };

  const handleEditBankAccount = (account: BankAccount) => {
    setBankForm({
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      bankName: account.bankName,
      routingNumber: account.routingNumber,
      swiftCode: account.swiftCode || '',
      iban: account.iban || '',
      accountType: account.accountType,
      currency: account.currency,
      country: account.country,
      type: account.type
    });
    setEditingBankId(account.id);
  };

  const updateWalletFormField = (field: string, value: any) => {
    setWalletForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddWallet = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🟢 [WALLET] handleAddWallet clicked');
    console.log('🟢 [WALLET] Form data:', {
      userId: walletForm.userId,
      address: walletForm.address,
      label: walletForm.label,
      type: walletForm.type,
      currency: walletForm.currency,
      network: walletForm.network
    });

    if (!walletForm.userId) {
      console.error('🔴 [WALLET] Missing userId!');
      alert('Please select a user');
      return;
    }
    if (!walletForm.address) {
      console.error('🔴 [WALLET] Missing address!');
      alert('Please enter an address');
      return;
    }
    if (!walletForm.label) {
      console.error('🔴 [WALLET] Missing label!');
      alert('Please enter a label');
      return;
    }
    if (!walletForm.currency) {
      console.error('🔴 [WALLET] Missing currency!');
      alert('Please select a currency');
      return;
    }

    console.log('✅ [WALLET] All validations passed, proceeding...');

    if (editingWalletId) {
      console.log('🟡 [WALLET] EDIT MODE - walletId:', editingWalletId);
      await editWallet(editingWalletId, {
        userId: walletForm.userId,
        address: walletForm.address,
        label: walletForm.label,
        type: walletForm.type,
        currency: walletForm.currency,
        network: walletForm.network || undefined
      });
      setEditingWalletId(null);
      console.log('✅ [WALLET] Edit completed');
    } else {
      console.log('🟢 [WALLET] ADD MODE - calling addWallet with:', {
        userId: walletForm.userId,
        address: walletForm.address,
        label: walletForm.label,
        type: walletForm.type,
        currency: walletForm.currency,
        network: walletForm.network
      });
      const result = await addWallet(
        walletForm.userId,
        walletForm.address,
        walletForm.label,
        walletForm.type,
        walletForm.currency,
        walletForm.network || undefined
      );
      console.log('✅ [WALLET] addWallet returned:', result);
    }
    resetWalletForm();
    console.log('✅ [WALLET] Form reset complete');
  };

  const resetWalletForm = () => {
    setWalletForm({
      userId: '',
      address: '',
      label: '',
      type: 'DEPOSIT',
      currency: 'USD',
      network: ''
    });
    setEditingWalletId(null);
  };

  const handleEditWallet = (wallet: Wallet) => {
    setWalletForm({
      userId: wallet.userId,
      address: wallet.address,
      label: wallet.label,
      type: wallet.type,
      currency: wallet.currency,
      network: wallet.network || ''
    });
    setEditingWalletId(wallet.id);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-2 bg-[#161b22] p-1 rounded border border-[#21262d]">
        {['bank', 'wallets'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab as 'bank' | 'wallets')}
            className={`flex-1 px-4 py-2 text-sm font-bold rounded transition-all capitalize ${
              activeSubTab === tab
                ? 'bg-[#2962ff] text-white'
                : 'text-[#8b949e] hover:text-white'
            }`}
          >
            {tab === 'bank' ? 'Bank Accounts' : 'Wallet Addresses'}
          </button>
        ))}
      </div>

      {/* Bank Accounts Section */}
      {activeSubTab === 'bank' && (
        <div className="space-y-6">
          {/* Create Bank Account Form */}
          <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">Create New Bank Account</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">Account Name</label>
                <input
                  type="text"
                  placeholder="Primary Business Account"
                  value={bankForm.accountName}
                  onChange={(e) => updateBankFormField('accountName', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBankAccount(e as any)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">Bank Name</label>
                <input
                  type="text"
                  placeholder="Chase Bank"
                  value={bankForm.bankName}
                  onChange={(e) => updateBankFormField('bankName', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBankAccount(e as any)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">Account Number</label>
                <input
                  type="text"
                  placeholder="1234567890"
                  value={bankForm.accountNumber}
                  onChange={(e) => updateBankFormField('accountNumber', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBankAccount(e as any)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">Routing Number</label>
                <input
                  type="text"
                  placeholder="021000021"
                  value={bankForm.routingNumber}
                  onChange={(e) => updateBankFormField('routingNumber', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBankAccount(e as any)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">SWIFT Code (Optional)</label>
                <input
                  type="text"
                  placeholder="CHASUS33"
                  value={bankForm.swiftCode}
                  onChange={(e) => updateBankFormField('swiftCode', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBankAccount(e as any)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">IBAN (Optional)</label>
                <input
                  type="text"
                  placeholder="DE89370400440532013000"
                  value={bankForm.iban}
                  onChange={(e) => updateBankFormField('iban', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBankAccount(e as any)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">Account Type</label>
                <select
                  value={bankForm.accountType}
                  onChange={(e) => updateBankFormField('accountType', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                >
                  <option value="CHECKING">Checking</option>
                  <option value="SAVINGS">Savings</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">Currency</label>
                <select
                  value={bankForm.currency}
                  onChange={(e) => updateBankFormField('currency', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">Country</label>
                <input
                  type="text"
                  placeholder="United States"
                  value={bankForm.country}
                  onChange={(e) => updateBankFormField('country', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBankAccount(e as any)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">Account Type</label>
                <select
                  value={bankForm.type}
                  onChange={(e) => updateBankFormField('type', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                >
                  <option value="DEPOSIT">Deposit</option>
                  <option value="WITHDRAWAL">Withdrawal</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddBankAccount}
                type="button"
                className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {editingBankId ? 'Update Bank Account' : 'Create Bank Account'}
              </button>
              {editingBankId && (
                <button
                  onClick={resetBankForm}
                  type="button"
                  className="px-6 py-2.5 bg-[#ef5350]/20 text-[#ef5350] hover:bg-[#ef5350]/30 font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Bank Accounts List */}
          <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Bank Accounts ({bankAccounts.length})</h3>
            
            {bankAccounts.length > 0 ? (
              <div className="space-y-3">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 hover:border-yellow-500 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-bold text-white">{account.accountName}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            account.isActive
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {account.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            account.type === 'DEPOSIT'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {account.type}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                          <div>
                            <span className="text-xs text-[#8b949e]">Bank</span>
                            <p className="text-white font-bold">{account.bankName}</p>
                          </div>
                          <div>
                            <span className="text-xs text-[#8b949e]">Account Number</span>
                            <p className="font-mono text-yellow-400 font-bold">****{account.accountNumber.slice(-4)}</p>
                          </div>
                          <div>
                            <span className="text-xs text-[#8b949e]">Type</span>
                            <p className="text-white font-bold">{account.accountType}</p>
                          </div>
                          <div>
                            <span className="text-xs text-[#8b949e]">Currency</span>
                            <p className="text-white font-bold">{account.currency}</p>
                          </div>
                          <div>
                            <span className="text-xs text-[#8b949e]">Country</span>
                            <p className="text-white font-bold">{account.country}</p>
                          </div>
                          <div>
                            <span className="text-xs text-[#8b949e]">Routing</span>
                            <p className="font-mono text-[#8b949e] text-sm">{account.routingNumber}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleBankAccountStatus(account.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            account.isActive
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          }`}
                          title={account.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {account.isActive ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditBankAccount(account)}
                          className="p-2 bg-[#2962ff]/20 text-[#2962ff] hover:bg-[#2962ff]/30 rounded-lg transition-colors"
                          title="Edit account"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this bank account?')) {
                              removeBankAccount(account.id);
                            }
                          }}
                          className="p-2 bg-[#ef5350]/20 text-[#ef5350] hover:bg-[#ef5350]/30 rounded-lg transition-colors"
                          title="Delete account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-[#21262d] rounded-lg">
                <p className="text-[#8b949e]">No bank accounts configured yet. Create one above to get started!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wallets Section */}
      {activeSubTab === 'wallets' && (
        <div className="space-y-6">
          {/* Create Wallet Form */}
          <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">Create New Wallet Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">User</label>
                <select
                  value={walletForm.userId}
                  onChange={(e) => updateWalletFormField('userId', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                >
                  <option value="">Select user</option>
                  {allUsers.map((user) => (
                    <option key={user.id} value={user.id}>{user.email}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">Label</label>
                <input
                  type="text"
                  placeholder="Main BTC Wallet"
                  value={walletForm.label}
                  onChange={(e) => updateWalletFormField('label', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddWallet(e as any)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">Wallet Address</label>
                <input
                  type="text"
                  placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                  value={walletForm.address}
                  onChange={(e) => updateWalletFormField('address', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddWallet(e as any)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">Currency</label>
                <select
                  value={walletForm.currency}
                  onChange={(e) => updateWalletFormField('currency', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">Network (Optional)</label>
                <input
                  type="text"
                  placeholder="ERC20, TRC20, BEP20, etc."
                  value={walletForm.network}
                  onChange={(e) => updateWalletFormField('network', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddWallet(e as any)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#8b949e] uppercase mb-2 block">Type</label>
                <select
                  value={walletForm.type}
                  onChange={(e) => updateWalletFormField('type', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
                >
                  <option value="DEPOSIT">Deposit</option>
                  <option value="PURCHASE">Purchase</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddWallet}
                type="button"
                className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {editingWalletId ? 'Update Wallet' : 'Create Wallet'}
              </button>
              {editingWalletId && (
                <button
                  onClick={resetWalletForm}
                  type="button"
                  className="px-6 py-2.5 bg-[#ef5350]/20 text-[#ef5350] hover:bg-[#ef5350]/30 font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Wallet Addresses List */}
          <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Wallet Addresses ({wallets.length})</h3>
          
          {wallets.length > 0 ? (
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 hover:border-yellow-500 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-white">{wallet.label}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          wallet.type === 'DEPOSIT'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {wallet.type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        <div>
                          <span className="text-xs text-[#8b949e]">Address</span>
                          <p className="font-mono text-yellow-400 text-sm break-all">{wallet.address}</p>
                        </div>
                        <div>
                          <span className="text-xs text-[#8b949e]">Currency / Network</span>
                          <p className="text-white font-bold">{wallet.currency} {wallet.network && `(${wallet.network})`}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditWallet(wallet)}
                        className="p-2 bg-[#2962ff]/20 text-[#2962ff] hover:bg-[#2962ff]/30 rounded-lg transition-colors"
                        title="Edit wallet"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this wallet?')) {
                            await removeWallet(wallet.id);
                          }
                        }}
                        className="p-2 bg-[#ef5350]/20 text-[#ef5350] hover:bg-[#ef5350]/30 rounded-lg transition-colors"
                        title="Delete wallet"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-[#21262d] rounded-lg">
              <p className="text-[#8b949e]">No wallet addresses configured yet. Create one above to get started!</p>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
