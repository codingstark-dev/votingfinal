import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { AppBar, Grid, Toolbar, Typography } from "@mui/material";
import * as React from 'react';
import { useContext, useEffect, useState } from "react";
import VotingContext from "../../contexts/VotingContext/VotingContext";
import AddressAvatar from "../AddressAvatar";
import { AddressBox } from "../styles";
import { theme } from '../theme/theme';

function Navbar() {

    const { state: { contract, accounts } } = useContext(VotingContext);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        setIsConnected(contract != null)
    }, [contract])

    return (
        <AppBar position="sticky" style={{ borderBottom: "none", backgroundColor: theme.palette.background.default}}>
            <Toolbar>
                <Grid container
                    justifyContent="space-between"
                    sx={{ mx: "auto", maxWidth: "1000px" }}
                >
                    <Typography variant="h4" fontSize={24}>E-voting</Typography>
                    {
                        isConnected ?
                            <AddressBox aria-describedby="connected-address" >
                                <AddressAvatar address={accounts[0]}>
                                    <PersonOutlineIcon />
                                </AddressAvatar>
                                <Typography variant='p' fontSize={14} fontWeight="bold">
                                    {accounts[0].substring(0, 6) + "..." + accounts[0].substring(38, accounts[0].length)}
                                </Typography>

                            </AddressBox>
                            : null
                    }
                </Grid>

            </Toolbar>
        </AppBar>
    )
}

export default Navbar;