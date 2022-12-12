import { Box, Grid, Modal, styled, Typography } from "@mui/material";
import { theme } from "../theme/theme";

const RoundedGrid = styled(Grid)({
    backgroundColor: theme.palette.background.grid,
    borderRadius: ".75rem",
    "& .MuiTypography-h4": {
        fontWeight: "bold"
    },
    "& .boxHeader": {
        padding: "10px 15px 10px 15px",
        display: "flex",
        justifyContent: "space-between",
        fontWeight: "bold",
    },
    "& .content .line": {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 15px 10px 15px",
        borderColor: theme.palette.border.main,
        alignSelf:"center"
    },
    "& .MuiTypography-b": {
        color: theme.palette.secondary.main
    },
    "& .admin:hover": {
        cursor: "pointer"
    }
})

const AddressBox = styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: "5px",
});

const TypographyPointer = styled(Typography)({
    '&:hover': {
        cursor: "pointer"
    }
})

const CenteredModal = styled(Modal)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
})

export { RoundedGrid, AddressBox, TypographyPointer, CenteredModal };

