import { Typography } from "@mui/material";

function NoticeNoArtifact() {
  return (
    <Typography p={10} variant="h4">
      ⚠️ Cannot find <span className="code">Voting</span> contract artifact.
    </Typography>
  );
}

export default NoticeNoArtifact;
