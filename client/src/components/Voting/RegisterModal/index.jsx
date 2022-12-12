import { Box, TextField, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import * as React from 'react';
import { CenteredModal } from '../../styles';
import { theme } from '../../theme/theme';

function RegisterModal(props) {
    const { open, handleClose, handleSubmit, onInputChange, addressError } = props
    
    return (
        <CenteredModal
            open={open}
            onClose={handleClose}>
            <Box width={500} minHeight={100} bgcolor="white" borderRadius={5}>
                <Typography
                    variant='h4'
                    color='primary'
                    fontWeight="bold"
                    textAlign='center'
                    p={1.5}>Register voter
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <Box p={2} sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <TextField
                            id="voterRegister"
                            multiline
                            inputProps={{ style: { color: theme.palette.primary.main, fontWeight: "bold", fontSize: "13px" } }}
                            row={3}
                            placeholder="Address"
                            variant="standard"
                            onChange={onInputChange}
                        />
                        <Button onClick={handleSubmit} color="action" variant="contained" sx={{ fontWeight: "bold" }}>Register</Button>
                        {
                            addressError ? <Alert severity="error">Please provide a <strong>correct</strong> address</Alert> : null
                        }
                    </Box>
                </form>
            </Box>
        </CenteredModal>
    )
}

export default RegisterModal;