import { Typography } from "@mui/material";

function NoticeNotRegistered({ registered }) {
  return (
    <>
      {
        !registered ?
          <Typography variant="p">
            ⚠️ You are not registered in the current session: you can't access to session information.
          </Typography>
          : null
      }
    </>
  );
}

export default NoticeNotRegistered;
