import { Box, Button, Typography } from "@mui/material";
import { CenteredModal } from "../../styles";


const SessionModal = (props) => {
    const { open, setOpen, handleSubmit } = props

    return (
        <CenteredModal
            open={open}
            onClose={e => setOpen(false)}>
            <Box width={350}
                height={120}
                bgcolor="white"
                borderRadius={2}
                >
                <Typography
                    variant="h6"
                    textAlign="center"
                    color="primary"
                    p={1.5}>Go to the next session ?
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <Box p={2} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: "10px" }}>
                        <Button onClick={handleSubmit} color="action" variant="contained" sx={{ fontWeight: "bold" }}>Yes</Button>
                        <Button onClick={() => setOpen(false)} color="action" variant="contained" sx={{ fontWeight: "bold" }}>No</Button>
                    </Box>
                </form>
            </Box>
        </CenteredModal>
    )
}

export default SessionModal;