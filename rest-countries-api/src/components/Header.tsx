import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";

import { Typography } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

interface HeaderProps {
  mode: string;
  onChangeMode: () => void;
}

const Header = ({ mode, onChangeMode }: HeaderProps) => {
  const isLightMode = mode.toLowerCase() === "light";
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: isLightMode ? "white" : "black",
        boxShadow:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h5"
            component="h1"
            sx={{ flexGrow: 1, color: "text.primary", fontWeight: 700 }}
          >
            Where in the world?
          </Typography>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ borderRadius: 0, color: "text.primary" }}
            onClick={onChangeMode}
          >
            {isLightMode ? (
              <DarkMode sx={{ mr: 1 }} />
            ) : (
              <LightMode sx={{ mr: 1 }} />
            )}
            <Typography
              variant="body2"
              component="p"
              sx={{
                flexGrow: 1,
                textTransform: "capitalize",
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {isLightMode ? "Dark" : "Light"} Mode
            </Typography>
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
