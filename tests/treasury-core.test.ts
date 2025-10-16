import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

// Test suite for the Developer Treasury Management System
describe("Treasury Core Contract", () => {
  let accounts: Map<string, string>;
  let deployerAddress: string;
  let member1Address: string;
  let member2Address: string;
  let member3Address: string;
  let nonMemberAddress: string;

  beforeEach(() => {
    // Setup test accounts
    accounts = simnet.getAccounts();
    deployerAddress = accounts.get("deployer")!;
    member1Address = accounts.get("wallet_1")!;
    member2Address = accounts.get("wallet_2")!;
    member3Address = accounts.get("wallet_3")!;
    nonMemberAddress = accounts.get("wallet_4")!;
  });

  describe("Contract Initialization", () => {
    it("should initialize treasury with founding member", () => {
      // Initialize treasury with 1 founding member and threshold of 1
      const initResult = simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Dev Team Treasury"),
          Cl.uint(1), // threshold
          Cl.principal(deployerAddress) // founding member
        ],
        deployerAddress
      );

      expect(initResult.result).toBeOk(Cl.bool(true));

      // Check treasury info
      const treasuryInfo = simnet.callReadOnlyFn(
        "treasury-core",
        "get-treasury-info",
        [],
        deployerAddress
      );

      expect(treasuryInfo.result).toEqual(
        Cl.tuple({
          name: Cl.stringAscii("Dev Team Treasury"),
          threshold: Cl.uint(1),
          "member-count": Cl.uint(1),
          "stx-balance": Cl.uint(0),
          "is-initialized": Cl.bool(true)
        })
      );
    });

    it("should not allow double initialization", () => {
      // First initialization
      simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(1),
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );

      // Second initialization should fail
      const secondInit = simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Another Treasury"),
          Cl.uint(1),
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );

      expect(secondInit.result).toBeErr(Cl.uint(100)); // ERR_NOT_AUTHORIZED
    });

    it("should validate threshold during initialization", () => {
      // Threshold too low (below MIN_THRESHOLD)
      const invalidInit = simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(0), // threshold below minimum
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );

      expect(invalidInit.result).toBeErr(Cl.uint(103)); // ERR_INVALID_THRESHOLD
    });
  });

  describe("Member Management", () => {
    beforeEach(() => {
      // Initialize treasury for each test
      simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(1), // threshold of 1 for easier testing
          Cl.principal(deployerAddress) // single founding member
        ],
        deployerAddress
      );
    });

    it("should allow members to propose adding new members", () => {
      const proposalResult = simnet.callPublicFn(
        "treasury-core",
        "propose-add-member",
        [
          Cl.principal(member1Address),
          Cl.uint(2), // ROLE_MEMBER
          Cl.stringAscii("Adding new team member")
        ],
        deployerAddress // Use deployerAddress as caller since they are the founding member
      );

      expect(proposalResult.result).toBeOk(Cl.uint(1)); // First proposal ID

      // Check proposal was created
      const proposal = simnet.callReadOnlyFn(
        "treasury-core",
        "get-proposal",
        [Cl.uint(1)],
        deployerAddress
      );

      expect(proposal.result).not.toBeNone();
    });

    it("should not allow non-members to propose", () => {
      const proposalResult = simnet.callPublicFn(
        "treasury-core",
        "propose-add-member",
        [
          Cl.principal(member3Address),
          Cl.uint(2),
          Cl.stringAscii("Unauthorized proposal")
        ],
        nonMemberAddress
      );

      expect(proposalResult.result).toBeErr(Cl.uint(100)); // ERR_NOT_AUTHORIZED
    });

    it("should not allow adding existing members", () => {
      const proposalResult = simnet.callPublicFn(
        "treasury-core",
        "propose-add-member",
        [
          Cl.principal(deployerAddress), // Already a member (the founding member)
          Cl.uint(2),
          Cl.stringAscii("Adding existing member")
        ],
        deployerAddress
      );

      expect(proposalResult.result).toBeErr(Cl.uint(101)); // ERR_ALREADY_MEMBER
    });
  });

  describe("Treasury Operations", () => {
    beforeEach(() => {
      // Initialize treasury and add some STX
      simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(1),
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );

      // Transfer some STX to the treasury contract
      simnet.transferSTX(1000000, `${deployerAddress}.treasury-core`, deployerAddress);
    });

    it("should allow proposing STX transfers", () => {
      const proposalResult = simnet.callPublicFn(
        "treasury-core",
        "propose-stx-transfer",
        [
          Cl.principal(member3Address),
          Cl.uint(100000),
          Cl.stringAscii("Payment to contractor")
        ],
        deployerAddress // Use deployerAddress as caller since they are the founding member
      );

      expect(proposalResult.result).toBeOk(Cl.uint(1));
    });

    it("should not allow transfers exceeding balance", () => {
      const proposalResult = simnet.callPublicFn(
        "treasury-core",
        "propose-stx-transfer",
        [
          Cl.principal(member3Address),
          Cl.uint(2000000), // More than treasury balance
          Cl.stringAscii("Excessive payment")
        ],
        deployerAddress // Use deployerAddress as caller since they are the founding member
      );

      expect(proposalResult.result).toBeErr(Cl.uint(110)); // ERR_INSUFFICIENT_BALANCE
    });
  });

  describe("Voting and Execution", () => {
    beforeEach(() => {
      // Setup treasury with STX balance
      simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(1),
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );

      simnet.transferSTX(1000000, `${deployerAddress}.treasury-core`, deployerAddress);
    });

    it("should allow voting on proposals", () => {
      // Create a proposal
      simnet.callPublicFn(
        "treasury-core",
        "propose-stx-transfer",
        [
          Cl.principal(member3Address),
          Cl.uint(100000),
          Cl.stringAscii("Test payment")
        ],
        deployerAddress
      );

      // Vote on the proposal
      const voteResult = simnet.callPublicFn(
        "treasury-core",
        "vote-on-proposal",
        [Cl.uint(1), Cl.bool(true)],
        deployerAddress
      );

      expect(voteResult.result).toBeOk(Cl.bool(true));

      // Check vote was recorded
      const vote = simnet.callReadOnlyFn(
        "treasury-core",
        "get-vote",
        [Cl.uint(1), Cl.principal(deployerAddress)],
        deployerAddress
      );

      expect(vote.result).not.toBeNone();
    });

    it("should execute proposals with sufficient approvals", () => {
      // Create proposal
      simnet.callPublicFn(
        "treasury-core",
        "propose-stx-transfer",
        [
          Cl.principal(member3Address),
          Cl.uint(100000),
          Cl.stringAscii("Test payment")
        ],
        deployerAddress
      );

      // Get vote from 1 member (meets threshold of 1)
      simnet.callPublicFn(
        "treasury-core",
        "vote-on-proposal",
        [Cl.uint(1), Cl.bool(true)],
        deployerAddress
      );

      // Execute proposal
      const executeResult = simnet.callPublicFn(
        "treasury-core",
        "execute-transfer-proposal",
        [Cl.uint(1)],
        deployerAddress
      );

      expect(executeResult.result).toBeOk(Cl.bool(true));
    });

    it("should not execute proposals without sufficient approvals", () => {
      // Create proposal
      simnet.callPublicFn(
        "treasury-core",
        "propose-stx-transfer",
        [
          Cl.principal(member3Address),
          Cl.uint(100000),
          Cl.stringAscii("Test payment")
        ],
        deployerAddress
      );

      // Don't vote on the proposal (0 votes, below threshold of 1)

      // Try to execute without any votes
      const executeResult = simnet.callPublicFn(
        "treasury-core",
        "execute-transfer-proposal",
        [Cl.uint(1)],
        deployerAddress
      );

      expect(executeResult.result).toBeErr(Cl.uint(107)); // ERR_INSUFFICIENT_APPROVALS
    });
  });

  describe("Read-Only Functions", () => {
    it("should return correct member information", () => {
      // Initialize treasury
      simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(1),
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );

      // Check member info
      const memberInfo = simnet.callReadOnlyFn(
        "treasury-core",
        "get-member-info",
        [Cl.principal(deployerAddress)],
        deployerAddress
      );

      expect(memberInfo.result).not.toBeNone();

      // Check is-member function
      const isMember = simnet.callReadOnlyFn(
        "treasury-core",
        "is-member",
        [Cl.principal(deployerAddress)],
        deployerAddress
      );

      expect(isMember.result).toStrictEqual(Cl.bool(true));

      // Check non-member
      const isNotMember = simnet.callReadOnlyFn(
        "treasury-core",
        "is-member",
        [Cl.principal(nonMemberAddress)],
        deployerAddress
      );

      expect(isNotMember.result).toStrictEqual(Cl.bool(false));

      // Check role system
      const hasAdminRole = simnet.callReadOnlyFn(
        "treasury-core",
        "has-role-check",
        [Cl.principal(deployerAddress), Cl.uint(1)], // ROLE_ADMIN
        deployerAddress
      );

      expect(hasAdminRole.result).toStrictEqual(Cl.bool(true));

      const hasMemberRole = simnet.callReadOnlyFn(
        "treasury-core",
        "has-role-check",
        [Cl.principal(deployerAddress), Cl.uint(2)], // ROLE_MEMBER
        deployerAddress
      );

      expect(hasMemberRole.result).toStrictEqual(Cl.bool(true)); // Admin should have member privileges
    });
  });

  describe("Proposal Expiration", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(2),
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );

      simnet.transferSTX(1000000, `${deployerAddress}.treasury-core`, deployerAddress);
    });

    it("should not allow voting on expired proposals", () => {
      // Create a proposal
      simnet.callPublicFn(
        "treasury-core",
        "propose-stx-transfer",
        [
          Cl.principal(member3Address),
          Cl.uint(100000),
          Cl.stringAscii("Test payment")
        ],
        deployerAddress
      );

      // Mine blocks to expire the proposal (PROPOSAL_DURATION = 1440 blocks)
      simnet.mineEmptyBlocks(1441);

      // Try to vote on expired proposal - should fail with ERR_PROPOSAL_NOT_FOUND (u104)
      // because the proposal is no longer valid
      const voteResult = simnet.callPublicFn(
        "treasury-core",
        "vote-on-proposal",
        [Cl.uint(1), Cl.bool(true)],
        deployerAddress
      );

      expect(voteResult.result).toBeErr(Cl.uint(104)); // ERR_PROPOSAL_NOT_FOUND
    });
  });

  describe("Double Voting Prevention", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(1),
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );

      simnet.transferSTX(1000000, `${deployerAddress}.treasury-core`, deployerAddress);
    });

    it("should prevent double voting on same proposal", () => {
      // Create a proposal
      simnet.callPublicFn(
        "treasury-core",
        "propose-stx-transfer",
        [
          Cl.principal(member3Address),
          Cl.uint(100000),
          Cl.stringAscii("Test payment")
        ],
        deployerAddress
      );

      // First vote
      const firstVote = simnet.callPublicFn(
        "treasury-core",
        "vote-on-proposal",
        [Cl.uint(1), Cl.bool(true)],
        deployerAddress
      );

      expect(firstVote.result).toBeOk(Cl.bool(true));

      // Second vote attempt
      const secondVote = simnet.callPublicFn(
        "treasury-core",
        "vote-on-proposal",
        [Cl.uint(1), Cl.bool(true)],
        deployerAddress
      );

      expect(secondVote.result).toBeErr(Cl.uint(106)); // ERR_ALREADY_VOTED
    });
  });

  describe("Threshold Management", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(1),
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );

      // Add another member first so we can increase threshold
      simnet.callPublicFn(
        "treasury-core",
        "propose-add-member",
        [
          Cl.principal(member1Address),
          Cl.uint(2),
          Cl.stringAscii("Add member")
        ],
        deployerAddress
      );

      simnet.callPublicFn(
        "treasury-core",
        "vote-on-proposal",
        [Cl.uint(1), Cl.bool(true)],
        deployerAddress
      );

      simnet.callPublicFn(
        "treasury-core",
        "execute-add-member-proposal",
        [Cl.uint(1)],
        deployerAddress
      );
    });

    it("should allow proposing threshold changes", () => {
      const proposalResult = simnet.callPublicFn(
        "treasury-core",
        "propose-threshold-change",
        [
          Cl.uint(2), // Now we have 2 members, so threshold of 2 is valid
          Cl.stringAscii("Increase approval threshold")
        ],
        deployerAddress
      );

      expect(proposalResult.result).toBeOk(Cl.uint(2));
    });

    it("should not allow invalid threshold changes", () => {
      const proposalResult = simnet.callPublicFn(
        "treasury-core",
        "propose-threshold-change",
        [
          Cl.uint(0), // Below minimum
          Cl.stringAscii("Invalid threshold")
        ],
        deployerAddress
      );

      expect(proposalResult.result).toBeErr(Cl.uint(103)); // ERR_INVALID_THRESHOLD
    });
  });

  describe("Multiple Members and Voting", () => {
    beforeEach(() => {
      // Initialize with threshold of 2
      simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(2),
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );

      // Add member1
      simnet.callPublicFn(
        "treasury-core",
        "propose-add-member",
        [
          Cl.principal(member1Address),
          Cl.uint(2),
          Cl.stringAscii("Add member 1")
        ],
        deployerAddress
      );

      simnet.callPublicFn(
        "treasury-core",
        "vote-on-proposal",
        [Cl.uint(1), Cl.bool(true)],
        deployerAddress
      );

      simnet.callPublicFn(
        "treasury-core",
        "execute-add-member-proposal",
        [Cl.uint(1)],
        deployerAddress
      );

      // Add member2
      simnet.callPublicFn(
        "treasury-core",
        "propose-add-member",
        [
          Cl.principal(member2Address),
          Cl.uint(2),
          Cl.stringAscii("Add member 2")
        ],
        deployerAddress
      );

      simnet.callPublicFn(
        "treasury-core",
        "vote-on-proposal",
        [Cl.uint(2), Cl.bool(true)],
        deployerAddress
      );

      simnet.callPublicFn(
        "treasury-core",
        "execute-add-member-proposal",
        [Cl.uint(2)],
        deployerAddress
      );

      simnet.transferSTX(1000000, `${deployerAddress}.treasury-core`, deployerAddress);
    });

    it("should require multiple approvals for execution", () => {
      // Create transfer proposal
      simnet.callPublicFn(
        "treasury-core",
        "propose-stx-transfer",
        [
          Cl.principal(member3Address),
          Cl.uint(100000),
          Cl.stringAscii("Test payment")
        ],
        deployerAddress
      );

      // Vote from deployer (1 vote, need 2)
      simnet.callPublicFn(
        "treasury-core",
        "vote-on-proposal",
        [Cl.uint(3), Cl.bool(true)],
        deployerAddress
      );

      // Try to execute with only 1 vote - should fail with insufficient approvals
      const executeResult = simnet.callPublicFn(
        "treasury-core",
        "execute-transfer-proposal",
        [Cl.uint(3)],
        deployerAddress
      );

      expect(executeResult.result).toBeErr(Cl.uint(107)); // ERR_INSUFFICIENT_APPROVALS
    });
  });

  describe("Proposal Not Found", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(1),
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );
    });

    it("should return error for non-existent proposal", () => {
      const voteResult = simnet.callPublicFn(
        "treasury-core",
        "vote-on-proposal",
        [Cl.uint(999), Cl.bool(true)],
        deployerAddress
      );

      expect(voteResult.result).toBeErr(Cl.uint(104)); // ERR_PROPOSAL_NOT_FOUND
    });
  });

  describe("Remove Member Functionality", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(1),
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );

      // Add a member
      simnet.callPublicFn(
        "treasury-core",
        "propose-add-member",
        [
          Cl.principal(member1Address),
          Cl.uint(2),
          Cl.stringAscii("Add member")
        ],
        deployerAddress
      );

      simnet.callPublicFn(
        "treasury-core",
        "vote-on-proposal",
        [Cl.uint(1), Cl.bool(true)],
        deployerAddress
      );

      simnet.callPublicFn(
        "treasury-core",
        "execute-add-member-proposal",
        [Cl.uint(1)],
        deployerAddress
      );
    });

    it("should allow removing members", () => {
      const proposalResult = simnet.callPublicFn(
        "treasury-core",
        "propose-remove-member",
        [
          Cl.principal(member1Address),
          Cl.stringAscii("Remove member")
        ],
        deployerAddress
      );

      expect(proposalResult.result).toBeOk(Cl.uint(2));
    });

    it("should not allow removing non-existent members", () => {
      const proposalResult = simnet.callPublicFn(
        "treasury-core",
        "propose-remove-member",
        [
          Cl.principal(nonMemberAddress),
          Cl.stringAscii("Remove non-member")
        ],
        deployerAddress
      );

      expect(proposalResult.result).toBeErr(Cl.uint(102)); // ERR_NOT_MEMBER
    });

    it("should not allow non-admins to propose member removal", () => {
      const proposalResult = simnet.callPublicFn(
        "treasury-core",
        "propose-remove-member",
        [
          Cl.principal(member1Address),
          Cl.stringAscii("Remove member")
        ],
        member1Address // Non-admin trying to remove
      );

      expect(proposalResult.result).toBeErr(Cl.uint(100)); // ERR_NOT_AUTHORIZED
    });
  });

  describe("Invalid Amount Handling", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(1),
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );

      simnet.transferSTX(1000000, `${deployerAddress}.treasury-core`, deployerAddress);
    });

    it("should not allow zero amount transfers", () => {
      const proposalResult = simnet.callPublicFn(
        "treasury-core",
        "propose-stx-transfer",
        [
          Cl.principal(member3Address),
          Cl.uint(0),
          Cl.stringAscii("Zero transfer")
        ],
        deployerAddress
      );

      expect(proposalResult.result).toBeErr(Cl.uint(109)); // ERR_INVALID_AMOUNT
    });
  });

  describe("Proposal Already Executed", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "treasury-core",
        "initialize",
        [
          Cl.stringAscii("Test Treasury"),
          Cl.uint(1),
          Cl.principal(deployerAddress)
        ],
        deployerAddress
      );

      simnet.transferSTX(1000000, `${deployerAddress}.treasury-core`, deployerAddress);
    });

    it("should not allow executing same proposal twice", () => {
      // Create and execute proposal
      simnet.callPublicFn(
        "treasury-core",
        "propose-stx-transfer",
        [
          Cl.principal(member3Address),
          Cl.uint(100000),
          Cl.stringAscii("Test payment")
        ],
        deployerAddress
      );

      simnet.callPublicFn(
        "treasury-core",
        "vote-on-proposal",
        [Cl.uint(1), Cl.bool(true)],
        deployerAddress
      );

      const firstExecution = simnet.callPublicFn(
        "treasury-core",
        "execute-transfer-proposal",
        [Cl.uint(1)],
        deployerAddress
      );

      expect(firstExecution.result).toBeOk(Cl.bool(true));

      // Try to execute again - should fail because proposal is no longer valid (expired)
      const secondExecution = simnet.callPublicFn(
        "treasury-core",
        "execute-transfer-proposal",
        [Cl.uint(1)],
        deployerAddress
      );

      expect(secondExecution.result).toBeErr(Cl.uint(105)); // ERR_PROPOSAL_EXPIRED (proposal is no longer valid after execution)
    });
  });
});
