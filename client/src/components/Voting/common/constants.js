const Sessions = {
    RegisteringVoters: "RegisteringVoters",
    ProposalsRegistrationStarted: "ProposalsRegistrationStarted",
    ProposalsRegistrationEnded: "ProposalsRegistrationEnded",
    VotingSessionStarted: "VotingSessionStarted",
    VotingSessionEnded: "VotingSessionEnded",
    VotesTallied: "VotesTallied"
}

const SessionCodes = {
    "0": Sessions.RegisteringVoters,
    "1": Sessions.ProposalsRegistrationStarted,
    "2": Sessions.ProposalsRegistrationEnded,
    "3": Sessions.VotingSessionStarted,
    "4": Sessions.VotingSessionEnded,
    "5": Sessions.VotesTallied
}

const addressPattern = /^0x[a-fA-F0-9]{40}$/;

export { Sessions, SessionCodes, addressPattern };