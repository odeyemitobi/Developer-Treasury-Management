'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useContractWrite } from '@/hooks/useContractWrite';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { Modal } from './ui/Modal';
import { EmptyState } from './ui/EmptyState';
import { ROLES, PROPOSAL_TYPES } from '@/types/treasury';
import { stxToMicroStx, isValidStacksAddress } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { MdAdd, MdSend, MdPersonAdd, MdPersonRemove, MdSettings, MdDescription } from 'react-icons/md';

type ProposalFormType = 'transfer' | 'add-member' | 'remove-member' | 'change-threshold';

export function CreateProposal() {
  const { address, userSession } = useWallet();
  const contractWrite = useContractWrite(userSession);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalType, setProposalType] = useState<ProposalFormType>('transfer');
  
  // Form states
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [newMember, setNewMember] = useState('');
  const [role, setRole] = useState(ROLES.MEMBER.toString());
  const [targetMember, setTargetMember] = useState('');
  const [newThreshold, setNewThreshold] = useState('');
  const [description, setDescription] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setRecipient('');
    setAmount('');
    setNewMember('');
    setRole(ROLES.MEMBER.toString());
    setTargetMember('');
    setNewThreshold('');
    setDescription('');
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (proposalType === 'transfer') {
      if (!recipient.trim()) {
        newErrors.recipient = 'Recipient address is required';
      } else if (!isValidStacksAddress(recipient)) {
        newErrors.recipient = 'Invalid Stacks address';
      }
      if (!amount || parseFloat(amount) <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      }
    }

    if (proposalType === 'add-member') {
      if (!newMember.trim()) {
        newErrors.newMember = 'Member address is required';
      } else if (!isValidStacksAddress(newMember)) {
        newErrors.newMember = 'Invalid Stacks address';
      }
    }

    if (proposalType === 'remove-member') {
      if (!targetMember.trim()) {
        newErrors.targetMember = 'Member address is required';
      } else if (!isValidStacksAddress(targetMember)) {
        newErrors.targetMember = 'Invalid Stacks address';
      }
    }

    if (proposalType === 'change-threshold') {
      if (!newThreshold || parseInt(newThreshold) < 1) {
        newErrors.newThreshold = 'Threshold must be at least 1';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (proposalType === 'transfer') {
        await contractWrite.proposeStxTransfer(
          recipient,
          stxToMicroStx(parseFloat(amount)),
          description
        );
      } else if (proposalType === 'add-member') {
        await contractWrite.proposeAddMember(
          newMember,
          parseInt(role),
          description
        );
      } else if (proposalType === 'remove-member') {
        await contractWrite.proposeRemoveMember(
          targetMember,
          description
        );
      } else if (proposalType === 'change-threshold') {
        await contractWrite.proposeThresholdChange(
          parseInt(newThreshold),
          description
        );
      }

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  if (!address) {
    return (
      <Card title="Create Proposal" subtitle="Connect to create proposals" variant="elevated">
        <EmptyState
          icon={<MdDescription size={56} />}
          title="Wallet not connected"
          description="Connect your wallet to create proposals"
        />
      </Card>
    );
  }

  const proposalTypes = [
    { type: 'transfer', icon: MdSend, label: 'STX Transfer', color: 'orange', description: 'Send STX from treasury' },
    { type: 'add-member', icon: MdPersonAdd, label: 'Add Member', color: 'green', description: 'Add new member' },
    { type: 'remove-member', icon: MdPersonRemove, label: 'Remove Member', color: 'red', description: 'Remove member' },
    { type: 'change-threshold', icon: MdSettings, label: 'Change Threshold', color: 'amber', description: 'Update threshold' },
  ];

  return (
    <>
      <Card
        title="Create Proposal"
        subtitle="Submit a new proposal for treasury governance"
        variant="elevated"
        action={
          <Button onClick={() => setIsModalOpen(true)} variant="primary" size="sm" className="shadow-lg hover:shadow-orange-500/30">
            <MdAdd size={20} />
            <span className="hidden sm:inline">New Proposal</span>
            <span className="sm:hidden">New</span>
          </Button>
        }
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {proposalTypes.map(({ type, icon: Icon, label, color, description }) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setProposalType(type as ProposalFormType);
                setIsModalOpen(true);
              }}
              className={cn(
                'group relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-300',
                'hover:scale-105 hover:shadow-xl',
                'bg-gradient-to-br from-[#0a0a0a] to-[#111111] border-[#1a1a1a] hover:border-[#2a2a2a]',
                'flex flex-col items-center gap-3 text-center'
              )}
            >
              {/* Hover glow effect */}
              <div className={cn(
                'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl',
                color === 'orange' && 'bg-orange-500',
                color === 'green' && 'bg-green-500',
                color === 'red' && 'bg-red-500',
                color === 'amber' && 'bg-amber-500'
              )}></div>

              <div
                className={cn(
                  'relative p-3 sm:p-4 rounded-xl bg-gradient-to-br shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl',
                  color === 'orange' && 'from-orange-600 to-orange-500 shadow-orange-500/40 group-hover:shadow-orange-500/60',
                  color === 'green' && 'from-green-600 to-green-500 shadow-green-500/40 group-hover:shadow-green-500/60',
                  color === 'red' && 'from-red-600 to-red-500 shadow-red-500/40 group-hover:shadow-red-500/60',
                  color === 'amber' && 'from-amber-600 to-amber-500 shadow-amber-500/40 group-hover:shadow-amber-500/60'
                )}
              >
                <Icon size={28} className="text-white" />
              </div>
              <div className="relative space-y-1">
                <span className="text-sm font-bold text-white block">{label}</span>
                <span className="text-xs text-neutral-400 block">{description}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Create New Proposal"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Proposal Type Selector */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Proposal Type</label>
            <div className="grid grid-cols-2 gap-3">
              {proposalTypes.map(({ type, icon: Icon, label, color }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setProposalType(type as ProposalFormType);
                    setErrors({});
                  }}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all duration-200',
                    'flex items-center gap-3',
                    proposalType === type
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#2a2a2a]'
                  )}
                >
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      color === 'orange' && 'bg-orange-600',
                      color === 'green' && 'bg-green-600',
                      color === 'red' && 'bg-red-600',
                      color === 'amber' && 'bg-amber-600'
                    )}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {proposalType === 'transfer' && (
            <>
              <Input
                label="Recipient Address"
                placeholder="SP..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                error={errors.recipient}
              />
              <Input
                label="Amount (STX)"
                type="number"
                step="0.000001"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={errors.amount}
              />
            </>
          )}

          {proposalType === 'add-member' && (
            <>
              <Input
                label="New Member Address"
                placeholder="SP..."
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                error={errors.newMember}
              />
              <Select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value={ROLES.ADMIN}>Admin</option>
                <option value={ROLES.MEMBER}>Member</option>
                <option value={ROLES.VIEWER}>Viewer</option>
              </Select>
            </>
          )}

          {proposalType === 'remove-member' && (
            <Input
              label="Member Address to Remove"
              placeholder="SP..."
              value={targetMember}
              onChange={(e) => setTargetMember(e.target.value)}
              error={errors.targetMember}
            />
          )}

          {proposalType === 'change-threshold' && (
            <Input
              label="New Approval Threshold"
              type="number"
              min="1"
              placeholder="2"
              value={newThreshold}
              onChange={(e) => setNewThreshold(e.target.value)}
              error={errors.newThreshold}
              helperText="Number of approvals required to execute proposals"
            />
          )}

          <Textarea
            label="Description"
            placeholder="Describe the purpose of this proposal..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            maxLength={200}
          />

          <div className="flex gap-3 justify-end pt-6 border-t border-[#1a1a1a]">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={contractWrite.isLoading}
            >
              <MdAdd size={18} />
              Create Proposal
            </Button>
          </div>

          {contractWrite.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
              <p className="text-red-400 text-sm leading-relaxed">❌ {contractWrite.error}</p>
            </div>
          )}
        </form>
      </Modal>
    </>
  );
}

