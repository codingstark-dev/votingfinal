import { useCallback, useEffect, useState } from "react";
import { SessionCodes } from "../../components/Voting/common/constants";
import useEth from "../EthContext/useEth";
import VotingContext from "./VotingContext";

function VotingProvider({ children }) {
    const { state, state: { contract, accounts }, dispatch } = useEth();
    
    const [isOwner, setIsOwner] = useState(false);
    const [owner, setOwner] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [currentSession, setCurrentSession] = useState(null);

    const fetchIsOwner = useCallback(async () => {
        try {
            const owner = await contract.methods.owner().call();
            console.log(accounts[0]);
            setIsOwner(owner === accounts[0]);
        } catch (e) {
            console.log("Error fetching owner: ", e);
        }
    }, [contract, accounts]);

    const fetchVoter = useCallback(async () => {
        try {
            const voter = await contract.methods.getVoter(accounts[0]).call({ from: accounts[0] });
            if (voter.isRegistered) {
                setIsRegistered(true);
            }
            if (voter.hasVoted) {
                setHasVoted(true);
            }
        } catch (e) {
            setIsRegistered(false);
            setHasVoted(false);
        }
    }, [accounts, contract]);

    const fetchOwner = useCallback(async () => {
        const owner = await contract.methods.owner().call();
        setOwner(owner);
    }, [contract]);

    useEffect(() => {
        if (contract !== null) {
            fetchIsOwner();
            fetchVoter();
            fetchOwner();
        }
    }, [contract, accounts, fetchIsOwner, fetchVoter, fetchOwner]);

    const fetchCurrentSession = useCallback(async () => {
        const session = await contract.methods.workflowStatus().call();
        setCurrentSession(SessionCodes[session]);
    }, [contract]);

    useEffect(() => {
        if (contract !== null) {
            fetchCurrentSession();
        }
    }, [contract, accounts, fetchCurrentSession]);

    const wrapperHasVoted = useCallback((voted) => {
        setHasVoted(voted);
    }, [setHasVoted]);

    const userSettings = {
        isOwner,
        owner,
        isRegistered,
        currentSession,
        fetchCurrentSession,
        hasVoted,
        setHasVoted,
        wrapperHasVoted
    };

    return (
        <VotingContext.Provider value={{
            state,
            dispatch,
            userSettings
        }}>
            {children}
        </VotingContext.Provider>
    );
}

export default VotingProvider;
