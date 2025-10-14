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
import { ROLES, PROPOSAL_TYPES } from '@/types/treasury';
import { stxToMicroStx, isValidStacksAddress } from '@/lib/utils';
import { MdAdd } from 'react-icons/md';

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
      <Card title="Create Proposal">
        <div className="text-center py-8">
          <p className="text-gray-400">Connect your wallet to create proposals</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card
        title="Create Proposal"
        subtitle="Submit a new proposal for treasury governance"
        action={
          <Button onClick={() => setIsModalOpen(true)} variant="primary" size="sm">
            <MdAdd size={20} />
            New Proposal
          </Button>
        }
      >
        <div className="text-center py-8 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-gray-400 mb-4">
            Click the button above to create a new proposal
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">STX</div>
              <div className="text-sm text-gray-500">Transfer</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">+</div>
              <div className="text-sm text-gray-500">Add Member</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">-</div>
              <div className="text-sm text-gray-500">Remove Member</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">#</div>
              <div className="text-sm text-gray-500">Change Threshold</div>
            </div>
          </div>
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
          <Select
            label="Proposal Type"
            value={proposalType}
            onChange={(e) => {
              setProposalType(e.target.value as ProposalFormType);
              setErrors({});
            }}
          >
            <option value="transfer">STX Transfer</option>
            <option value="add-member">Add Member</option>
            <option value="remove-member">Remove Member</option>
            <option value="change-threshold">Change Threshold</option>
          </Select>

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

          <div className="flex gap-3 justify-end pt-4">
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
              Create Proposal
            </Button>
          </div>

          {contractWrite.error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
              <p className="text-red-400 text-sm">{contractWrite.error}</p>
            </div>
          )}
        </form>
      </Modal>
    </>
  );
}

