'use client';

import { WalletConnect } from '@/components/WalletConnect';
import { TreasuryOverview } from '@/components/TreasuryOverview';
import { MemberList } from '@/components/MemberList';
import { CreateProposal } from '@/components/CreateProposal';
import { ProposalList } from '@/components/ProposalList';
import InitializeTreasury from '@/components/InitializeTreasury';
import { useTreasuryInfo } from '@/hooks/useTreasury';
import { MdAccountBalance } from 'react-icons/md';

export default function Home() {
  const { treasuryInfo, isLoading } = useTreasuryInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <MdAccountBalance size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Developer Treasury
                </h1>
                <p className="text-sm text-gray-400">
                  Multi-signature treasury management on Stacks
                </p>
              </div>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show initialization form if treasury is not initialized */}
        {!isLoading && !treasuryInfo?.isInitialized ? (
          <div className="max-w-2xl mx-auto">
            <InitializeTreasury />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Treasury Overview */}
            <TreasuryOverview />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Member Info */}
            <MemberList />

            {/* Create Proposal */}
            <CreateProposal />
          </div>

            {/* Proposals List */}
            <ProposalList />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-3">About</h3>
              <p className="text-gray-400 text-sm">
                A comprehensive treasury management solution for developer teams, DAOs, and organizations.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Features</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Multi-signature security</li>
                <li>• Role-based access control</li>
                <li>• Proposal-based governance</li>
                <li>• STX transfer management</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Resources</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>
                  <a
                    href="https://github.com/odeyemitobi/Developer-Treasury-Management"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.stacks.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Stacks Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© 2025 Developer Treasury Management. Built on Stacks blockchain.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
