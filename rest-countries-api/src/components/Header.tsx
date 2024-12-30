import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Typography } from "@mui/material";
import { DarkMode } from "@mui/icons-material";
// import Sitemark from './SitemarkIcon';
// import ColorModeIconDropdown from '.././theme/ColorModeIconDropdown';

// const StyledToolbar = styled(Toolbar)(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   flexShrink: 0,
//   borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
//   backdropFilter: "blur(24px)",
//   border: "1px solid",
//   borderColor: (theme.vars || theme).palette.divider,
//   backgroundColor: theme.vars
//     ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
//     : alpha(theme.palette.background.default, 0.4),
//   boxShadow: (theme.vars || theme).shadows[1],
//   padding: "8px 12px",
// }));

const Header = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1 }}
            fontWeight={700}
          >
            Where in the world?
          </Typography>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ borderRadius: 0 }}
          >
            <DarkMode sx={{ mr: 1 }} />
            <Typography variant="body2" component="p" sx={{ flexGrow: 1 }}>
              Dark Mode
            </Typography>
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
