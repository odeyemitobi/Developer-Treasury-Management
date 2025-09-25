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
});
