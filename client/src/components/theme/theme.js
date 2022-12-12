import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        background: {
            default: "#09162E",
            grid: "rgb(14, 28, 55)",
            pop:  "rgb(32, 46, 73)"
        },
        text: {
            primary: "#ffffff",
        },
        primary: {
            main: "#211f24",
        },
        secondary: {
            main: "#929fe4",
        },
        action: {
            main: "#0b0d22"
        },
        border: {
            main: "#6f6f6f"
        },
        cell: {
            main: "#211f24",
            secondary: "#384aff91",
            hover: "#393939"
        },
    },
    typography: {
        fontFamily: "Inter, Arial, sans-serif",
        allVariants: {
            color: "white",
        },
        h6: {
            fontWeight: "bold"
        },
        html: {
            background: "#000000",
        },
        b: {
            fontSize: "17px"
        },
        p: {
            fontSize: "17px"
        }
    },
    multilineColor:{
        color:'yellow'
    }
})