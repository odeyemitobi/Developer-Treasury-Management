;; =============================================================================
;; DEVELOPER TREASURY MANAGEMENT SYSTEM - CORE CONTRACT
;; =============================================================================
;;
;; This contract provides the foundational treasury management functionality
;; for developer teams, DAOs, and organizations. It implements:
;;
;; 1. Multi-signature wallet functionality with configurable thresholds
;; 2. Member management with role-based permissions
;; 3. Proposal system for treasury decisions
;; 4. STX and SIP-010 token support
;; 5. Extensible architecture for future DeFi integrations
;;
;; The contract is designed to be the foundation for additional modules:
;; - Payment scheduling and vesting
;; - DeFi yield strategies
;; - Flash loan emergency access
;; - Governance and voting mechanisms
;;
;; =============================================================================

;; =============================================================================
;; CONSTANTS AND ERROR CODES
;; =============================================================================

;; Error codes for different failure scenarios
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_ALREADY_MEMBER (err u101))
(define-constant ERR_NOT_MEMBER (err u102))
(define-constant ERR_INVALID_THRESHOLD (err u103))
(define-constant ERR_PROPOSAL_NOT_FOUND (err u104))
(define-constant ERR_PROPOSAL_EXPIRED (err u105))
(define-constant ERR_ALREADY_VOTED (err u106))
(define-constant ERR_INSUFFICIENT_APPROVALS (err u107))
(define-constant ERR_PROPOSAL_ALREADY_EXECUTED (err u108))
(define-constant ERR_INVALID_AMOUNT (err u109))
(define-constant ERR_INSUFFICIENT_BALANCE (err u110))

;; Member roles for access control
(define-constant ROLE_ADMIN u1)
(define-constant ROLE_MEMBER u2)
(define-constant ROLE_VIEWER u3)

;; Proposal types for different treasury actions
(define-constant PROPOSAL_TYPE_TRANSFER u1)
(define-constant PROPOSAL_TYPE_ADD_MEMBER u2)
(define-constant PROPOSAL_TYPE_REMOVE_MEMBER u3)
(define-constant PROPOSAL_TYPE_CHANGE_THRESHOLD u4)

;; Time constants (in blocks)
(define-constant PROPOSAL_DURATION u1440) ;; ~10 days assuming 10min blocks
(define-constant MIN_THRESHOLD u1)
(define-constant MAX_MEMBERS u20)

;; =============================================================================
;; DATA STORAGE
;; =============================================================================

;; Treasury configuration
(define-data-var treasury-name (string-ascii 50) "Developer Treasury")
(define-data-var approval-threshold uint u2)
(define-data-var member-count uint u0)
(define-data-var proposal-nonce uint u0)
(define-data-var is-initialized bool false)

;; Member management - stores member info and roles
(define-map members
  { address: principal }
  { 
    role: uint,
    joined-at: uint,
    is-active: bool
  }
)

;; Proposal tracking - stores all treasury proposals
(define-map proposals
  { proposal-id: uint }
  {
    proposer: principal,
    proposal-type: uint,
    target: (optional principal),
    amount: (optional uint),
    token-contract: (optional principal),
    new-threshold: (optional uint),
    description: (string-ascii 200),
    created-at: uint,
    expires-at: uint,
    executed: bool,
    approval-count: uint
  }
)

;; Vote tracking - prevents double voting
(define-map proposal-votes
  { proposal-id: uint, voter: principal }
  { approved: bool, voted-at: uint }
)

;; Supported token contracts for treasury management
(define-map supported-tokens
  { contract: principal }
  { 
    symbol: (string-ascii 10),
    decimals: uint,
    enabled: bool
  }
)

;; =============================================================================
;; PRIVATE HELPER FUNCTIONS
;; =============================================================================

;; Check if caller has required role or higher
(define-private (has-role (required-role uint))
  (let ((member-info (map-get? members { address: tx-sender })))
    (match member-info
      member-data (and
        (get is-active member-data)
        (<= (get role member-data) required-role)
      )
      false
    )
  )
)

;; Get current block height for time-based operations
(define-private (get-current-height)
  block-height
)

;; Check if proposal is still valid (not expired)
(define-private (is-proposal-valid (proposal-id uint))
  (let ((proposal (map-get? proposals { proposal-id: proposal-id })))
    (match proposal
      proposal-data (and
        (not (get executed proposal-data))
        (< (get-current-height) (get expires-at proposal-data))
      )
      false
    )
  )
)

;; =============================================================================
;; INITIALIZATION AND SETUP
;; =============================================================================

;; Initialize the treasury with founding members
;; This can only be called once and sets up the initial governance structure
(define-public (initialize
  (name (string-ascii 50))
  (initial-threshold uint)
  (founding-member principal)
)
  (begin
    ;; Ensure contract hasn't been initialized
    (asserts! (not (var-get is-initialized)) ERR_NOT_AUTHORIZED)

    ;; Validate threshold
    (asserts! (>= initial-threshold MIN_THRESHOLD) ERR_INVALID_THRESHOLD)

    ;; Set treasury configuration
    (var-set treasury-name name)
    (var-set approval-threshold initial-threshold)
    (var-set is-initialized true)

    ;; Add founding member as admin
    (map-set members
      { address: founding-member }
      {
        role: ROLE_ADMIN,
        joined-at: (get-current-height),
        is-active: true
      }
    )
    (var-set member-count u1)

    (ok true)
  )
)

;; =============================================================================
;; MEMBER MANAGEMENT
;; =============================================================================

;; Add a new member to the treasury (requires proposal and approval)
(define-public (propose-add-member 
  (new-member principal)
  (role uint)
  (description (string-ascii 200))
)
  (begin
    ;; Only existing members can propose new members
    (asserts! (has-role ROLE_MEMBER) ERR_NOT_AUTHORIZED)
    
    ;; Check that target is not already a member
    (asserts! (is-none (map-get? members { address: new-member })) ERR_ALREADY_MEMBER)
    
    ;; Create proposal
    (let ((proposal-id (+ (var-get proposal-nonce) u1)))
      (var-set proposal-nonce proposal-id)
      
      (map-set proposals
        { proposal-id: proposal-id }
        {
          proposer: tx-sender,
          proposal-type: PROPOSAL_TYPE_ADD_MEMBER,
          target: (some new-member),
          amount: (some role),
          token-contract: none,
          new-threshold: none,
          description: description,
          created-at: (get-current-height),
          expires-at: (+ (get-current-height) PROPOSAL_DURATION),
          executed: false,
          approval-count: u0
        }
      )
      
      (ok proposal-id)
    )
  )
)

;; Remove a member from the treasury (requires proposal and approval)
(define-public (propose-remove-member
  (target-member principal)
  (description (string-ascii 200))
)
  (begin
    ;; Only admins can propose member removal
    (asserts! (has-role ROLE_ADMIN) ERR_NOT_AUTHORIZED)

    ;; Check that target is actually a member
    (asserts! (is-some (map-get? members { address: target-member })) ERR_NOT_MEMBER)

    ;; Create proposal
    (let ((proposal-id (+ (var-get proposal-nonce) u1)))
      (var-set proposal-nonce proposal-id)

      (map-set proposals
        { proposal-id: proposal-id }
        {
          proposer: tx-sender,
          proposal-type: PROPOSAL_TYPE_REMOVE_MEMBER,
          target: (some target-member),
          amount: none,
          token-contract: none,
          new-threshold: none,
          description: description,
          created-at: (get-current-height),
          expires-at: (+ (get-current-height) PROPOSAL_DURATION),
          executed: false,
          approval-count: u0
        }
      )

      (ok proposal-id)
    )
  )
)

;; =============================================================================
;; TREASURY OPERATIONS
;; =============================================================================

;; Propose a STX transfer from the treasury
(define-public (propose-stx-transfer
  (recipient principal)
  (amount uint)
  (description (string-ascii 200))
)
  (begin
    ;; Only members can propose transfers
    (asserts! (has-role ROLE_MEMBER) ERR_NOT_AUTHORIZED)

    ;; Validate amount
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)

    ;; Check treasury has sufficient balance
    (asserts! (>= (stx-get-balance (as-contract tx-sender)) amount) ERR_INSUFFICIENT_BALANCE)

    ;; Create proposal
    (let ((proposal-id (+ (var-get proposal-nonce) u1)))
      (var-set proposal-nonce proposal-id)

      (map-set proposals
        { proposal-id: proposal-id }
        {
          proposer: tx-sender,
          proposal-type: PROPOSAL_TYPE_TRANSFER,
          target: (some recipient),
          amount: (some amount),
          token-contract: none,
          new-threshold: none,
          description: description,
          created-at: (get-current-height),
          expires-at: (+ (get-current-height) PROPOSAL_DURATION),
          executed: false,
          approval-count: u0
        }
      )

      (ok proposal-id)
    )
  )
)

;; Propose changing the approval threshold
(define-public (propose-threshold-change
  (new-threshold uint)
  (description (string-ascii 200))
)
  (begin
    ;; Only admins can propose threshold changes
    (asserts! (has-role ROLE_ADMIN) ERR_NOT_AUTHORIZED)

    ;; Validate new threshold
    (asserts! (and
      (>= new-threshold MIN_THRESHOLD)
      (<= new-threshold (var-get member-count))
    ) ERR_INVALID_THRESHOLD)

    ;; Create proposal
    (let ((proposal-id (+ (var-get proposal-nonce) u1)))
      (var-set proposal-nonce proposal-id)

      (map-set proposals
        { proposal-id: proposal-id }
        {
          proposer: tx-sender,
          proposal-type: PROPOSAL_TYPE_CHANGE_THRESHOLD,
          target: none,
          amount: none,
          token-contract: none,
          new-threshold: (some new-threshold),
          description: description,
          created-at: (get-current-height),
          expires-at: (+ (get-current-height) PROPOSAL_DURATION),
          executed: false,
          approval-count: u0
        }
      )

      (ok proposal-id)
    )
  )
)

;; =============================================================================
;; VOTING AND EXECUTION
;; =============================================================================

;; Vote on a proposal (approve or reject)
(define-public (vote-on-proposal (proposal-id uint) (approve bool))
  (begin
    ;; Only members can vote
    (asserts! (has-role ROLE_MEMBER) ERR_NOT_AUTHORIZED)

    ;; Check proposal exists and is valid
    (asserts! (is-proposal-valid proposal-id) ERR_PROPOSAL_NOT_FOUND)

    ;; Check user hasn't already voted
    (asserts! (is-none (map-get? proposal-votes { proposal-id: proposal-id, voter: tx-sender })) ERR_ALREADY_VOTED)

    ;; Record vote
    (map-set proposal-votes
      { proposal-id: proposal-id, voter: tx-sender }
      { approved: approve, voted-at: (get-current-height) }
    )

    ;; Update approval count if vote is positive
    (if approve
      (let ((proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR_PROPOSAL_NOT_FOUND)))
        (map-set proposals
          { proposal-id: proposal-id }
          (merge proposal { approval-count: (+ (get approval-count proposal) u1) })
        )
      )
      true
    )

    (ok true)
  )
)



;; Execute STX transfer proposal
(define-public (execute-transfer-proposal (proposal-id uint))
  (let ((proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR_PROPOSAL_NOT_FOUND)))
    (begin
      ;; Check proposal is valid and not already executed
      (asserts! (is-proposal-valid proposal-id) ERR_PROPOSAL_EXPIRED)
      (asserts! (not (get executed proposal)) ERR_PROPOSAL_ALREADY_EXECUTED)
      (asserts! (is-eq (get proposal-type proposal) PROPOSAL_TYPE_TRANSFER) ERR_PROPOSAL_NOT_FOUND)

      ;; Check sufficient approvals
      (asserts! (>= (get approval-count proposal) (var-get approval-threshold)) ERR_INSUFFICIENT_APPROVALS)

      ;; Mark as executed
      (map-set proposals
        { proposal-id: proposal-id }
        (merge proposal { executed: true })
      )

      ;; Execute transfer
      (let (
        (recipient (unwrap! (get target proposal) ERR_PROPOSAL_NOT_FOUND))
        (amount (unwrap! (get amount proposal) ERR_PROPOSAL_NOT_FOUND))
      )
        (as-contract (stx-transfer? amount tx-sender recipient))
      )
    )
  )
)

;; Execute add member proposal
(define-public (execute-add-member-proposal (proposal-id uint))
  (let ((proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR_PROPOSAL_NOT_FOUND)))
    (begin
      ;; Check proposal is valid and not already executed
      (asserts! (is-proposal-valid proposal-id) ERR_PROPOSAL_EXPIRED)
      (asserts! (not (get executed proposal)) ERR_PROPOSAL_ALREADY_EXECUTED)
      (asserts! (is-eq (get proposal-type proposal) PROPOSAL_TYPE_ADD_MEMBER) ERR_PROPOSAL_NOT_FOUND)

      ;; Check sufficient approvals
      (asserts! (>= (get approval-count proposal) (var-get approval-threshold)) ERR_INSUFFICIENT_APPROVALS)

      ;; Mark as executed
      (map-set proposals
        { proposal-id: proposal-id }
        (merge proposal { executed: true })
      )

      ;; Execute add member
      (let (
        (new-member (unwrap! (get target proposal) ERR_PROPOSAL_NOT_FOUND))
        (role (unwrap! (get amount proposal) ERR_PROPOSAL_NOT_FOUND))
      )
        (begin
          (map-set members
            { address: new-member }
            {
              role: role,
              joined-at: (get-current-height),
              is-active: true
            }
          )
          (var-set member-count (+ (var-get member-count) u1))
          (ok true)
        )
      )
    )
  )
)

;; Execute remove member proposal
(define-public (execute-remove-member-proposal (proposal-id uint))
  (let ((proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR_PROPOSAL_NOT_FOUND)))
    (begin
      ;; Check proposal is valid and not already executed
      (asserts! (is-proposal-valid proposal-id) ERR_PROPOSAL_EXPIRED)
      (asserts! (not (get executed proposal)) ERR_PROPOSAL_ALREADY_EXECUTED)
      (asserts! (is-eq (get proposal-type proposal) PROPOSAL_TYPE_REMOVE_MEMBER) ERR_PROPOSAL_NOT_FOUND)

      ;; Check sufficient approvals
      (asserts! (>= (get approval-count proposal) (var-get approval-threshold)) ERR_INSUFFICIENT_APPROVALS)

      ;; Mark as executed
      (map-set proposals
        { proposal-id: proposal-id }
        (merge proposal { executed: true })
      )

      ;; Execute remove member
      (let ((target-member (unwrap! (get target proposal) ERR_PROPOSAL_NOT_FOUND)))
        (begin
          (map-delete members { address: target-member })
          (var-set member-count (- (var-get member-count) u1))
          (ok true)
        )
      )
    )
  )
)

;; Execute threshold change proposal
(define-public (execute-threshold-proposal (proposal-id uint))
  (let ((proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR_PROPOSAL_NOT_FOUND)))
    (begin
      ;; Check proposal is valid and not already executed
      (asserts! (is-proposal-valid proposal-id) ERR_PROPOSAL_EXPIRED)
      (asserts! (not (get executed proposal)) ERR_PROPOSAL_ALREADY_EXECUTED)
      (asserts! (is-eq (get proposal-type proposal) PROPOSAL_TYPE_CHANGE_THRESHOLD) ERR_PROPOSAL_NOT_FOUND)

      ;; Check sufficient approvals
      (asserts! (>= (get approval-count proposal) (var-get approval-threshold)) ERR_INSUFFICIENT_APPROVALS)

      ;; Mark as executed
      (map-set proposals
        { proposal-id: proposal-id }
        (merge proposal { executed: true })
      )

      ;; Execute threshold change
      (let ((new-threshold (unwrap! (get new-threshold proposal) ERR_PROPOSAL_NOT_FOUND)))
        (begin
          (var-set approval-threshold new-threshold)
          (ok true)
        )
      )
    )
  )
)



;; =============================================================================
;; READ-ONLY FUNCTIONS
;; =============================================================================

;; Get treasury information
(define-read-only (get-treasury-info)
  {
    name: (var-get treasury-name),
    threshold: (var-get approval-threshold),
    member-count: (var-get member-count),
    stx-balance: (stx-get-balance (as-contract tx-sender)),
    is-initialized: (var-get is-initialized)
  }
)

;; Get member information
(define-read-only (get-member-info (address principal))
  (map-get? members { address: address })
)

;; Get proposal information
(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals { proposal-id: proposal-id })
)

;; Get vote information
(define-read-only (get-vote (proposal-id uint) (voter principal))
  (map-get? proposal-votes { proposal-id: proposal-id, voter: voter })
)

;; Check if user is a member
(define-read-only (is-member (address principal))
  (is-some (map-get? members { address: address }))
)

;; Check if user has specific role
(define-read-only (has-role-check (address principal) (required-role uint))
  (let ((member-info (map-get? members { address: address })))
    (match member-info
      member-data (and
        (get is-active member-data)
        (<= (get role member-data) required-role)
      )
      false
    )
  )
)

;; Get current proposal nonce
(define-read-only (get-proposal-nonce)
  (var-get proposal-nonce)
)

;; Check if proposal can be executed
(define-read-only (can-execute-proposal (proposal-id uint))
  (let ((proposal (map-get? proposals { proposal-id: proposal-id })))
    (match proposal
      proposal-data (and
        (not (get executed proposal-data))
        (< (get-current-height) (get expires-at proposal-data))
        (>= (get approval-count proposal-data) (var-get approval-threshold))
      )
      false
    )
  )
)

;; =============================================================================
;; EMERGENCY FUNCTIONS
;; =============================================================================

;; Emergency pause function (for future upgrades)
;; This is a placeholder for emergency functionality that can be added later
(define-read-only (get-emergency-status)
  false ;; Always false for now, can be upgraded later
)

;; =============================================================================
;; CONTRACT EXTENSION HOOKS
;; =============================================================================

;; These functions provide hooks for future contract extensions
;; They can be called by authorized extension contracts

;; Hook for payment scheduler integration
(define-read-only (get-scheduled-payment-allowance (scheduler-contract principal))
  ;; Placeholder for future payment scheduler integration
  ;; Will return allowed spending limit for scheduler contract
  u0
)

;; Hook for yield strategy integration
(define-read-only (get-yield-strategy-allocation (strategy-contract principal))
  ;; Placeholder for future DeFi yield strategy integration
  ;; Will return allocated funds for yield strategies
  u0
)

;; Hook for flash loan integration
(define-read-only (get-flash-loan-authorization (loan-contract principal))
  ;; Placeholder for future flash loan integration
  ;; Will return authorization status for emergency flash loans
  false
)
