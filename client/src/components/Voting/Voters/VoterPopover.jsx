import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Box, Popover, styled, Typography } from '@mui/material';
import AddressAvatar from '../../AddressAvatar';
import { theme } from '../../theme/theme';

const PopoverStyled = styled(Popover)({
    ".MuiPaper-root": {
        backgroundColor: "inherit"
    }
})

function VoterPopover(props) {

    const { open, voter, anchorEl, handleClose } = props;

    return (
        <PopoverStyled            
            id="voter-popover"
            sx={{
                pointerEvents: 'none'
              }}
            onClose={handleClose}
            disableRestoreFocus
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
            <Box p={1} sx={{
                backgroundColor: theme.palette.background.pop
            }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    pb: "5px"
                }}>

                    <AddressAvatar address={voter.address}>
                        <PersonOutlineIcon />
                    </AddressAvatar>
                    <Typography variant="p" fontSize={13} fontWeight="bold">
                        {voter.address}
                    </Typography>
                </Box>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                }}>
                    {
                        voter.hasVoted ?
                            <>
                                <CheckIcon color="success" /><Typography variant="p" fontSize={13}>Voted for <strong>{voter.proposalDescription}</strong></Typography>
                            </>
                            :
                            <>
                                <ClearIcon color="error" /><Typography variant="p" fontSize={13}>Not voted yet</Typography>
                            </>
                    }
                </Box>
            </Box>

        </PopoverStyled>
    )
}

export default VoterPopover;