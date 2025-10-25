# Developer Treasury Management System

A comprehensive treasury management solution for developer teams, DAOs, and organizations built on the Stacks blockchain. This project combines concepts from LearnWeb3's Stacks Developer Degree courses to create a practical, real-world treasury management system.

## Problem Statement

Developer teams (DAOs, startups, open-source projects) need a secure, automated way to:

- **Manage shared funds** with multi-signature security
- **Automate payments** to team members (salaries, bounties, vesting)
- **Earn yield** on idle treasury funds through DeFi integration
- **Handle emergencies** with flash loan capabilities for liquidity

## Architecture Overview

The system is designed with modularity in mind, starting with a core treasury contract that can be extended with additional functionality:

### Core Contract: `treasury-core.clar`

**Current Implementation:**

- ✅ Multi-signature wallet functionality
- ✅ Role-based member management (Admin, Member, Viewer)
- ✅ Proposal-based governance system
- ✅ STX transfer capabilities
- ✅ Configurable approval thresholds
- ✅ Time-based proposal expiration

**Future Extensions (Planned):**

- 🔄 Payment scheduling and vesting (`payment-scheduler.clar`)
- 🔄 DeFi yield strategies (`yield-strategy.clar`)
- 🔄 Flash loan emergency access (`emergency-access.clar`)
- 🔄 SIP-010 token support

## Features

### Multi-Signature Security

- Configurable approval thresholds (e.g., 2 of 3, 3 of 5)
- Role-based access control
- Proposal-based decision making
- Time-locked proposals with expiration

### Member Management

- Add/remove members through governance
- Role assignment (Admin, Member, Viewer)
- Member activity tracking
- Proposal voting rights

### Treasury Operations

- STX transfers with multi-sig approval
- Proposal creation and voting
- Execution after sufficient approvals
- Balance tracking and validation

### Governance System

- Proposal types: Transfer, Add Member, Remove Member, Change Threshold
- Voting mechanism with approval tracking
- Automatic execution after threshold met
- Proposal expiration for security

## Technical Implementation

### Smart Contract Structure

```clarity
;; Core data structures
- members: Role-based member management
- proposals: Governance proposal tracking
- proposal-votes: Vote tracking and validation
- supported-tokens: Future token support

;; Key functions
- initialize: Set up treasury with founding member
- propose-*: Create proposals for different actions
- vote-on-proposal: Vote on active proposals
- execute-*-proposal: Execute approved proposals
```

### Security Features

- **Access Control**: Role-based permissions for all operations
- **Double-Spend Protection**: Proposal execution tracking
- **Time Locks**: Proposals expire after set duration
- **Balance Validation**: Checks before allowing transfers
- **Vote Validation**: Prevents double voting

## Usage Examples

### 1. Initialize Treasury

```clarity
(contract-call? .treasury-core initialize
  "Dev Team Treasury"
  u2  ;; threshold
  'SP1234...FOUNDER)  ;; founding member
```

### 2. Propose STX Transfer

```clarity
(contract-call? .treasury-core propose-stx-transfer
  'SP5678...RECIPIENT
  u1000000  ;; 1 STX in microSTX
  "Payment to contractor")
```

### 3. Vote on Proposal

```clarity
(contract-call? .treasury-core vote-on-proposal
  u1    ;; proposal ID
  true) ;; approve
```

### 4. Execute Approved Proposal

```clarity
(contract-call? .treasury-core execute-transfer-proposal u1)
```

## Testing

The project includes comprehensive testing at multiple levels:

### Unit Tests (TypeScript)

Run TypeScript unit tests using Clarinet:

```bash
npm install
npm test
```

### Fuzz Testing (Rendezvous)

Run property-based and invariant tests using Rendezvous:

```bash
# Run property-based tests
npm run fuzz:test

# Run invariant tests
npm run fuzz:invariant

# Run all fuzz tests
npm run fuzz

# Run extended fuzz tests (1000 iterations)
npm run fuzz:extended

# Run all tests (unit + fuzz)
npm run test:all
```

For detailed information about fuzz testing, see [FUZZ_TESTING.md](./FUZZ_TESTING.md).

Test coverage includes:

- Contract initialization
- Member management
- Proposal creation and voting
- Execution logic
- Access control
- Error handling
- Property-based testing (random inputs)
- Invariant validation (state consistency)

## Development Setup

### Prerequisites

- [Clarinet](https://docs.hiro.so/clarinet) installed
- Node.js and npm for testing

### Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/odeyemitobi/Developer-Treasury-Management.git
   cd Developer-Treasury-Management
   ```

2. **Verify contract syntax**

   ```bash
   clarinet check
   ```

3. **Run tests**

   ```bash
   npm install
   npm test
   ```

4. **Deploy locally**

   ```bash
   clarinet integrate
   ```

## Learning Inspiration

This project synthesizes concepts from LearnWeb3's Stacks Developer Degree:

1. **Multisig Vaults**: Multi-signature security and governance
2. **Flash Loans**: Emergency liquidity mechanisms (planned)
3. **Lending Protocol**: DeFi yield strategies (planned)

## Roadmap

### Phase 1: Core Treasury ✅

- [x] Multi-signature wallet
- [x] Member management
- [x] Basic governance
- [x] STX transfers

### Phase 2: Payment Automation 🔄

- [ ] Scheduled payments
- [ ] Vesting schedules
- [ ] Bounty system
- [ ] SIP-010 token support

### Phase 3: DeFi Integration 🔄

- [ ] Yield farming strategies
- [ ] Lending protocol integration
- [ ] Automated rebalancing
- [ ] Risk management

### Phase 4: Emergency Features 🔄

- [ ] Flash loan integration
- [ ] Emergency pause mechanisms
- [ ] Arbitrage opportunities
- [ ] Advanced governance

## Contributing

This project is designed to be a foundation for real-world treasury management. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure `clarinet check` passes
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Links

- [GitHub Repository](https://github.com/odeyemitobi/Developer-Treasury-Management)
- [LearnWeb3 Stacks Course](https://learnweb3.io/degrees/stacks-developer-degree/)
- [Stacks Documentation](https://docs.stacks.co/)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)
