import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckIcon from '@mui/icons-material/Check';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Box, Typography } from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
import VotingContext from '../../../contexts/VotingContext/VotingContext';
import AddressAvatar from '../../AddressAvatar';
import CircularIndeterminate from '../../CircularIndeterminate';
import { AddressBox, RoundedGrid, TypographyPointer } from '../../styles';
import { addressPattern, Sessions } from '../common/constants';
import RegisterModal from '../RegisterModal';
import VotersDialog from './VoterPopover';

function Voters() {

    const { state: { contract, accounts }, userSettings: { isOwner, currentSession } } = useContext(VotingContext);
    const [voters, setVoters] = useState([]);
    const [registerVoter, setRegisterVoter] = useState('');
    const [addressError, setAddressError] = useState(false);
    const [selectedVoter, setSelectedVoter] = useState('');
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);

    const openPopoverVoter = Boolean(anchorEl);


    const fetchVoters = useCallback(async () => {
        let voters = []
        const votedEvents = await contract.getPastEvents('Voted', {
            fromBlock: 0,
            toBlock: 'latest'
        })

        const registrationEvents = await contract.getPastEvents('VoterRegistered', {
            fromBlock: 0,
            toBlock: 'latest'
        })

        votedEvents.forEach((event) => {
            voters[event.returnValues.voter] = { address: event.returnValues.voter, proposalId: event.returnValues.proposalId, hasVoted: true, proposalDescription: null }
        });

        registrationEvents.forEach((event) => {
            const address = event.returnValues.voterAddress;
            if (voters[address] === undefined) {
                voters[address] = { address: address, proposalsId: null, hasVoted: false, proposalDescription: null }
            }
        })

        setVoters(voters)
    }, [contract])

    useEffect(() => {
        if (contract !== null) {
            fetchVoters()
        }
    }, [contract, fetchVoters]);

    const onInputChange = (event) => {
        setRegisterVoter(event.target.value);
    };

    const onMouseEnterVoter = async (event, key) => {

        const voter = voters[key];

        const getProposal = async (voter) => {
            if (voter.hasVoted && voter.proposalDescription == null) {
                return contract.methods.getOneProposal(voter.proposalId).call({ from: accounts[0] }).then((proposal) => proposal.description);
            }
            return voter.proposalDescription;
        }

        const promises = await Promise.all([getProposal(voter), new Promise(resolve => setTimeout(resolve, 0))]);
        voter.proposalDescription = promises[0];

        setSelectedVoter(voter);

        setAnchorEl(event.target);
    }

    const handleVoterPopoverClose = () => {
        setAnchorEl(null)
    }

    const handleCloseRegisterModal = () => {
        setOpen(false);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (addressPattern.test(registerVoter)) {
            setAddressError(false);
            setLoading(true);
            await contract.methods.addVoter(registerVoter).send({ from: accounts[0] });
        } else {
            setAddressError(true);
        }
        fetchVoters();
        handleCloseRegisterModal();
        setLoading(false);
        handleCloseRegisterModal();
    }

    const addVoterIcon =
        <AddCircleIcon color='text' className='admin' fontSize='medium' onClick={e => setOpen(true)} />

    return (
        <>
            <RoundedGrid>
                <Box className='boxHeader'>
                    <Typography variant='h6'>Voters</Typography>
                    {
                        !isOwner || currentSession !== Sessions.RegisteringVoters ? null : addVoterIcon
                    }
                </Box>
                <Box className='content'>
                    {Object.values(voters).map((row) => {
                        return (
                            <AddressBox
                                p={1.5}
                                key={row.address}
                                sx={{ display: 'flex', gap: '5px', cursor: 'pointer'}}
                            >
                                {
                                    row.hasVoted ? <CheckIcon color='success' /> : null
                                }

                                <AddressAvatar address={row.address}>
                                    <PersonOutlineIcon />
                                </AddressAvatar>
                                <TypographyPointer
                                    variant='p'
                                    fontSize={13}
                                    fontWeight='bold'
                                    onClick={e => onMouseEnterVoter(e, row.address)}
                                    onMouseOut={e => handleVoterPopoverClose(e)}
                                    >
                                        {row.address}
                                </TypographyPointer>
                            </AddressBox>
                        )
                    })}
                </Box>
            </RoundedGrid>

            <RegisterModal
                open={open}
                handleClose={handleCloseRegisterModal}
                handleSubmit={handleSubmit}
                onInputChange={onInputChange}
                addressError={addressError} />

            <VotersDialog
                open={openPopoverVoter}
                handleClose={handleVoterPopoverClose}
                voter={selectedVoter}
                anchorEl={anchorEl} />
                
            <CircularIndeterminate loading={loading}/>
        </>
    );
}

export default Voters;