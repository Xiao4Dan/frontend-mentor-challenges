import {
  Box,
  Card,
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
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
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

  const numberFormat = (_number: string, _sep: string) => {
    return _number
      .replace(
        new RegExp(
          "^(\\d{" +
            (_number.length % 3 ? _number.length % 3 : 0) +
            "})(\\d{3})",
          "g"
        ),
        "$1 $2"
      )
      .replace(/(\d{3})+?/gi, "$1 ")
      .trim()
      .replace(/ /gi, _sep);
  };

  return (
    <Container
      maxWidth="lg"
      component="main"
      sx={{ display: "flex", flexDirection: "column", my: 6, gap: 6 }}
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
        <Paper
          component="form"
          sx={{
            p: "5px 15px",
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
          }}
          elevation={0}
        >
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: 14, minWidth: 300 }}
            placeholder="Search for a country..."
            inputProps={{ "aria-label": "search for a country..." }}
          />
        </Paper>

        <Paper
          sx={{
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
          }}
          elevation={0}
        >
          <IconButton
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            type="button"
            sx={{
              py: 1.5,
              px: 2,
              width: 200,
              borderRadius: 0,
              justifyContent: "space-between",
            }}
            aria-label="Filter by Region"
            onClick={handleClick}
          >
            <Typography
              variant="body1"
              component="p"
              sx={{ mr: 2, fontSize: 14 }}
            >
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
            <MenuItem sx={{ width: 200, fontSize: 14 }} onClick={handleClose}>
              Profile
            </MenuItem>
            <MenuItem sx={{ width: 200, fontSize: 14 }} onClick={handleClose}>
              My account
            </MenuItem>
            <MenuItem sx={{ width: 200, fontSize: 14 }} onClick={handleClose}>
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
        spacing={{ xs: 2, md: 4, lg: 7 }}
        columns={{ sm: 4, md: 12, lg: 16 }}
      >
        {!loading &&
          countries.map((country: any) => (
            <Grid2 key={country.name} size={{ sm: 2, md: 4, lg: 4 }}>
              <Card
                key={country.name}
                elevation={0}
                sx={{
                  boxShadow:
                    "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);",
                }}
              >
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height={140}
                  image={country.flags.png}
                />
                <CardContent sx={{ minHeight: "160px" }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h6"
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
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
                        sx={{
                          fontWeight: 600,
                          mr: 1,
                          textTransform: "capitalize",
                        }}
                      >
                        {key}:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {key === "population"
                          ? numberFormat(country[key].toString(), ",")
                          : country[key]}
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
