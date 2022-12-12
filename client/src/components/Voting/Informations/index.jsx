import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Box, Typography, Link } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import VotingContext from "../../../contexts/VotingContext/VotingContext";
import AddressAvatar from '../../AddressAvatar';
import CircularIndeterminate from '../../CircularIndeterminate';
import { AddressBox, RoundedGrid } from "../../styles";
import { Sessions } from "../common/constants";
import SessionModal from '../SessionsModal';


const Informations = () => {
    const { state: { contract, accounts },
        userSettings: { isOwner, isRegistered, currentSession, fetchCurrentSession, owner } } = useContext(VotingContext);
    const [open, setOpen] = useState(false);
    const [winner, setWinner] = useState({});
    const [loading, setLoading] = useState(false);
    const contractLink = `https://goerli.etherscan.io/address/${contract.options.address}`

    const fetchWinner = useCallback(async () => {
        const winner = await contract.methods.winningProposalID().call();
        const proposal = await contract.methods.getOneProposal(winner).call({ from: accounts[0] });
        setWinner({ description: proposal.description, voteCount: proposal.voteCount });
    }, [contract, accounts]);

    const handleSubmit = () => {
        nextSession()
    }

    useEffect(() => {
        if (contract != null) {
            if (currentSession === Sessions.VotesTallied && isRegistered) {
                fetchWinner();
            }
        }
    }, [contract, currentSession, isRegistered, fetchWinner]);

    const nextSession = async () => {
        setLoading(true);
        switch (currentSession) {
            case Sessions.RegisteringVoters:
                await contract.methods.startProposalsRegistering().send({ from: accounts[0] })
                break
            case Sessions.ProposalsRegistrationStarted:
                await contract.methods.endProposalsRegistering().send({ from: accounts[0] })
                break
            case Sessions.ProposalsRegistrationEnded:
                await contract.methods.startVotingSession().send({ from: accounts[0] })
                break
            case Sessions.VotingSessionStarted:
                await contract.methods.endVotingSession().send({ from: accounts[0] })
                break;
            case Sessions.VotingSessionEnded:
                await contract.methods.tallyVotes().send({ from: accounts[0] })
                break;
            default:
                console.error("Session not recognized: ", currentSession)
        }
        fetchCurrentSession();
        setLoading(false);
        setOpen(false);

    };

    const nextSessionIcon =
        <ArrowCircleRightOutlinedIcon className="admin" color="text" fontSize="medium" onClick={e => setOpen(true)} />

    return (
        <>
            <RoundedGrid>
                <Box className="boxHeader">
                    <Typography variant="h6">Informations</Typography>
                    {
                        !isOwner || currentSession === Sessions.VotesTallied ? null : nextSessionIcon
                    }
                </Box>
                <Box className="content">
                    <Box className="line">
                        <Typography variant="b">Contract address</Typography>
                        <Link href={contractLink} fontSize={13} fontWeight="bold" alignSelf="center" color="inherit">{contract.options.address}</Link>
                    </Box>
                    <Box className="line">
                        <Typography variant="b">Owner</Typography>
                        <AddressBox
                            // sx={{cursor: "pointer"}}
                         >
                            <AddressAvatar address={owner} >
                                <PersonOutlineIcon  />
                            </AddressAvatar>
                            <Typography variant="p" fontSize={13} fontWeight="bold" alignSelf="center">{owner}</Typography>
                        </AddressBox>
                    </Box>
                    <Box className="line">
                        <Typography variant="b">Current session</Typography>
                        <Typography variant="p"  fontSize={13} fontWeight="bold" alignSelf="center">{currentSession}</Typography>
                    </Box>
                    {currentSession === Sessions.VotesTallied ?
                        <Box className="line">
                            <Typography variant="b">Winning proposal</Typography>
                            <Typography variant="p"  fontSize={13} fontWeight="bold" alignSelf="center" >{winner.description}</Typography>
                        </Box> : null}

                </Box>
            </RoundedGrid>
            <SessionModal
                open={open}
                setOpen={setOpen}
                handleSubmit={handleSubmit} />
            <CircularIndeterminate loading={loading} />
        </>
    )
}

export default Informations;
