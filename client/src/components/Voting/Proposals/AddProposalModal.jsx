import { Box, Button, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import VotingContext from "../../../contexts/VotingContext/VotingContext";
import { CenteredModal } from "../../styles";
import { theme } from "../../theme/theme";
import CircularIndeterminate from "../../CircularIndeterminate";

const AddProposalModal = (props) => {
  const { open, setOpen, fetchProposals } = props;

  const [proposal, setProposal] = useState("");
  const {
    state: { contract, accounts },
  } = useContext(VotingContext);
  const [loading, setLoading] = useState(false);

  const onInputChange = (event) => {
    setProposal(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await contract.methods.addProposal(proposal).send({ from: accounts[0] });
    fetchProposals();
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <CenteredModal open={open} onClose={(e) => setOpen(false)}>
        <Box width={300} minHeight={100} bgcolor="white" borderRadius={2}>
          <Typography
            variant="h4"
            color="primary"
            fontWeight="bold"
            textAlign="center"
            p={1.5}
          >
            Add proposal
          </Typography>
          <form noValidate onSubmit={handleSubmit}>
            <Box
              p={2}
              sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <TextField
                id="proposalsDescription"
                multiline
                inputProps={{
                  style: {
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    fontSize: "13px",
                  },
                }}
                row={3}
                placeholder="Description"
                variant="standard"
                onChange={onInputChange}
              />
              <Button
                onClick={handleSubmit}
                color="action"
                variant="contained"
                sx={{ fontWeight: "bold" }}
              >
                Propose
              </Button>
            </Box>
          </form>
        </Box>
      </CenteredModal>
      <CircularIndeterminate loading={loading} />
    </>
  );
};

export default AddProposalModal;
