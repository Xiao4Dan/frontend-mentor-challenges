import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid2,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { MouseEventHandler, useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Countries = () => {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    (async function fetchData() {
      try {
        setLoading(true);
        const countriesRes = await fetch("/api/countries");
        const body = await countriesRes.json();
        if (body.length) {
          setCountries(body);
          console.log(body);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <Container
      maxWidth="lg"
      component="main"
      sx={{ display: "flex", flexDirection: "column", my: 4, gap: 4 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <Paper component="form" sx={{ p: "2px 4px" }}>
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search for a country"
            inputProps={{ "aria-label": "search for a country" }}
          />
        </Paper>

        <Paper>
          <IconButton
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            type="button"
            sx={{ py: 1.5, px: 2, width: 200 }}
            aria-label="Filter by Region"
            onClick={handleClick}
          >
            <Typography variant="body1" component="p" sx={{ mr: 2 }}>
              Filter by Region
            </Typography>
            <KeyboardArrowDownIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ width: 250, display: "block", mt: 1 }}
          >
            <MenuItem sx={{ width: 200 }} onClick={handleClose}>
              Profile
            </MenuItem>
            <MenuItem sx={{ width: 200 }} onClick={handleClose}>
              My account
            </MenuItem>
            <MenuItem sx={{ width: 200 }} onClick={handleClose}>
              Logout
            </MenuItem>
          </Menu>
        </Paper>
      </Box>

      {loading && (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress color="secondary" size="30px" value={25} />
        </Box>
      )}

      <Grid2
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ sm: 4, md: 12, lg: 16 }}
      >
        {!loading &&
          countries.map((country: any) => (
            <Grid2 key={country.name} size={{ sm: 2, md: 4, lg: 4 }}>
              <Card key={country.name}>
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="140"
                  image={country.flags.png}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h5">
                    {country.name}
                  </Typography>
                  {["population", "region", "capital"].map((key: string) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, mr: 1 }}
                      >
                        {key}:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {country[key]}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid2>
          ))}
      </Grid2>
    </Container>
  );
};

export default Countries;
