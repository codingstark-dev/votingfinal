// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/*
 * @author Philippe Paulos
 * @notice Voting contract
 
 * This contract is used to manage a voting session, allowing people to propose and vote for ideas
 * The session is managed by the owner of the contract
 */
contract Voting is Ownable {
    uint8 public winningProposalID;
    uint8 numProposals;
    Proposal[100] proposalsArray;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint8 votedProposalId;
    }

    struct Proposal {
        string description;
        uint8 voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    mapping(address => Voter) voters;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint8 proposalId);
    event Voted(address voter, uint8 proposalId);

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    /**
     * @dev Gets the Voter struct of a given `_addr`
     * @param _addr searched address
     * @return Voter
     *
     * Requirements:
     *
     * - `address` cannot be a non voter
     */
    function getVoter(address _addr)
        external
        view
        onlyVoters
        returns (Voter memory)
    {
        return voters[_addr];
    }

    /**
     * @dev Gets the Proposal struct for a given `_id`
     * @param _id searched `proposalId`
     * @return Proposal
     *
     * Requirements:
     *
     * - `address` cannot be a non voter
     */
    function getOneProposal(uint8 _id)
        external
        view
        onlyVoters
        returns (Proposal memory)
    {
        return proposalsArray[_id];
    }

    /**
     * @dev Adds a new voter `_addr` to the session
     * @param _addr address to register
     *
     *
     * Emits a {VoterRegistered} event.
     *
     * Requirements:
     *
     * - `address` cannot be already registered
     * - `msg.sender` should be the owner
     * - `worklowStatus` should be WorkflowStatus.RegisteringVoters
     */
    function addVoter(address _addr) external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Voters registration is not open yet"
        );
        require(voters[_addr].isRegistered != true, "Already registered");

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    /**
     * @dev Adds a proposal named `desc` to the session
     * @param _desc description of the new proposal
     *
     * Emits a {ProposalRegistered} event.
     *
     * Requirements:
     *
     * - `_desc` cannot be empty
     * - `msg.sender` should be a voter
     * - `worklowStatus` should be WorkflowStatus.ProposalsRegistrationStarted
     */
    function addProposal(string calldata _desc) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Proposals are not allowed yet"
        );
        require(
            keccak256(abi.encode(_desc)) != keccak256(abi.encode("")),
            "Vous ne pouvez pas ne rien proposer"
        ); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray[numProposals] = proposal;
        numProposals += 1;
        emit ProposalRegistered(numProposals - 1);
    }

    /**
     * @dev Vote for an existing `_id`
     * @param _id `proposalId` to vote for
     *
     * Emits a {Voted} event.
     *
     * Requirements:
     *
     * - `_id` should exists
     * - `msg.sender` should be a voter
     * - `worklowStatus` should be WorkflowStatus.VotingSessionStarted
     * - `msg.sender` should be owner
     */
    function setVote(uint8 _id) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < numProposals, "Proposal not found");

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    /**
     * @dev Sets the `workflowStatus` to `ProposalsRegistrationStarted`
     *
     * Emits a {WorkflowStatusChange} event.
     *
     * Requirements:
     *
     * - `workflowStatus` should be WorkflowStatus.RegisteringVoters
     * - `msg.sender` should be owner
     */
    function startProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Registering proposals cant be started now"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        Proposal memory proposal;
        proposal.description = "GENESIS";
        numProposals += 1;
        proposalsArray[0] = proposal;

        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    /**
     * @dev Sets the `workflowStatus` to `ProposalsRegistrationEnded`
     *
     * Emits a {WorkflowStatusChange} event.
     *
     * Requirements:
     *
     * - `workflowStatus` should be WorkflowStatus.ProposalsRegistrationStarted
     * - `msg.sender` should be owner
     */
    function endProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Registering proposals havent started yet"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    /**
     * @dev Sets the `workflowStatus` to `VotingSessionStarted`
     *
     * Emits a {WorkflowStatusChange} event.
     *
     * Requirements:
     *
     * - `workflowStatus` should be WorkflowStatus.ProposalsRegistrationEnded
     * - `msg.sender` should be owner
     */
    function startVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationEnded,
            "Registering proposals phase is not finished"
        );
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    /**
     * @dev Sets the `workflowStatus` to `VotingSessionEnded`
     *
     * Emits a {WorkflowStatusChange} event.
     *
     * Requirements:
     *
     * - `workflowStatus` should be WorkflowStatus.VotingSessionStarted
     * - `msg.sender` should be owner
     */
    function endVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
    }

    /**
     * @dev Tally the winner setting the `winningProposalId`
     *
     * Emits a {WorkflowStatusChange} event.
     *
     * Requirements:
     *
     * - `workflowStatus` should be WorkflowStatus.VotingSessionEnded
     * - `msg.sender` should be owner
     */
    function tallyVotes() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionEnded,
            "Current status is not voting session ended"
        );
        uint8 _winningProposalId;
        for (uint8 p = 0; p < numProposals; p++) {
            if (
                proposalsArray[p].voteCount >
                proposalsArray[_winningProposalId].voteCount
            ) {
                _winningProposalId = p;
            }
        }
        winningProposalID = _winningProposalId;

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
    }
}
