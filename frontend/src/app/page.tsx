'use client';

import { WalletConnect } from '@/components/WalletConnect';
import { TreasuryOverview } from '@/components/TreasuryOverview';
import { MemberList } from '@/components/MemberList';
import { CreateProposal } from '@/components/CreateProposal';
import { ProposalList } from '@/components/ProposalList';
import InitializeTreasury from '@/components/InitializeTreasury';
import { useTreasuryInfo } from '@/hooks/useTreasury';
import { MdAccountBalance, MdDashboard, MdHowToVote } from 'react-icons/md';
import { useState } from 'react';

export default function Home() {
  const { treasuryInfo, isLoading } = useTreasuryInfo();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'proposals'>('dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-black relative overflow-hidden">
      {/* Animated background gradient mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-30" style={{ background: 'var(--gradient-mesh)' }}></div>

      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-xl sticky top-0 z-50 shadow-xl relative">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative group cursor-pointer">
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-all duration-300 animate-pulse"></div>
                <div className="relative p-2.5 sm:p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <MdAccountBalance className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Developer Treasury
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium hidden sm:block">
                  Multi-signature treasury on Stacks
                </p>
              </div>
            </div>

            {/* Navigation & Wallet */}
            <div className="flex items-center gap-4">
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12 relative z-10">
        {/* Show initialization form if treasury is not initialized */}
        {!isLoading && !treasuryInfo?.isInitialized ? (
          <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <InitializeTreasury />
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Treasury Overview - Full Width */}
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <TreasuryOverview />
            </div>

            {/* Mobile Navigation Tabs */}
            <div className="flex lg:hidden gap-2 sm:gap-3 bg-[#0a0a0a] p-2 rounded-xl border border-[#1a1a1a]">
              <button
                onClick={() => setActiveSection('dashboard')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeSection === 'dashboard'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg'
                    : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                <MdDashboard size={18} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveSection('proposals')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeSection === 'proposals'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg'
                    : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                <MdHowToVote size={18} />
                <span>Proposals</span>
              </button>
            </div>

            {/* Mobile View - Conditional Rendering */}
            <div className="lg:hidden space-y-6">
              {activeSection === 'dashboard' ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <MemberList />
                  <CreateProposal />
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <ProposalList />
                </div>
              )}
            </div>

            {/* Desktop View - Grid Layout */}
            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8 animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: '100ms' }}>
              {/* Left Column */}
              <div className="space-y-6 xl:space-y-8">
                <MemberList />
                <CreateProposal />
              </div>

              {/* Right Column - Spans 2 columns on XL screens */}
              <div className="lg:col-span-1 xl:col-span-2">
                <ProposalList />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer - Enhanced Design */}
      <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl mt-auto relative z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* About */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg shadow-lg shadow-blue-500/30">
                  <MdAccountBalance size={20} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-base sm:text-lg">About</h3>
              </div>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-md">
                A comprehensive treasury management solution for developer teams, DAOs, and organizations built on Stacks blockchain.
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-white font-bold mb-4 text-base sm:text-lg">Features</h3>
              <ul className="text-neutral-400 text-sm space-y-2.5">
                <li className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span>Multi-signature security</span>
                </li>
                <li className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span>Role-based access control</span>
                </li>
                <li className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span>Proposal-based governance</span>
                </li>
                <li className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span>STX transfer management</span>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-bold mb-4 text-base sm:text-lg">Resources</h3>
              <ul className="text-neutral-400 text-sm space-y-2.5">
                <li>
                  <a
                    href="https://github.com/odeyemitobi/Developer-Treasury-Management"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200 group"
                  >
                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full group-hover:bg-blue-400 transition-all group-hover:scale-125"></div>
                    <span>GitHub Repository</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.stacks.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200 group"
                  >
                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full group-hover:bg-blue-400 transition-all group-hover:scale-125"></div>
                    <span>Stacks Documentation</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#1a1a1a]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
              <p className="text-neutral-500 text-xs sm:text-sm order-2 sm:order-1">
                © 2025 Developer Treasury Management. Built on Stacks blockchain.
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 order-1 sm:order-2">
                <span>Powered by</span>
                <span className="text-blue-500 font-bold bg-blue-500/10 px-2 py-1 rounded">Clarity</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
