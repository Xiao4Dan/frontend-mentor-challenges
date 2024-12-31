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
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Country, FetchCountriesParams } from "@/interfaces/Country";

const PAGE_SIZE = 12;

const Countries = () => {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [currentRegion, setCurrentRegion] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchCountries = async ({ sort, filter, limit, offset }: FetchCountriesParams) => {
    // send get request with query params
    const countriesRes = await fetch(`/api/countries?sort=${sort}&filter=${filter}&limit=${limit}&offset=${offset}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const countriesBody = await countriesRes.json();
    if (countriesBody.length) {
      setCountries(countriesBody);
      console.log(countriesBody);
    }
  };

  const fetchRegions = async () => {
    const regionsRes = await fetch("/api/regions");
    const regionsBody = await regionsRes.json();
    if (regionsBody.length) {
      setRegions(regionsBody);
      console.log(regionsBody);
    }
  };

  useEffect(() => {
    (async function fetchData() {
      try {
        setLoading(true);
        await fetchCountries({ 
          sort: "", 
          filter: "", 
          limit: PAGE_SIZE, 
          offset: 0
        });
        await fetchRegions();
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
            aria-label={currentRegion || "Filter by Region"}
            onClick={handleClick}
            disabled={loading}
          >
            <Typography variant="body1" component="p" sx={{ mr: 2 }}>
              {currentRegion || "Filter by Region"}
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
            {regions.map((region) => (
              <MenuItem
                key={region}
                sx={{ width: 200 }}
                onClick={() => {
                  console.log(region);
                  setCurrentRegion(region);
                  handleClose();
                }}
              >
                {region}
              </MenuItem>
            ))}
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
                      key={key}
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
      <Typography variant="body2" component="p" sx={{ textAlign: "center" }}>
        load page {currentPage + 1}
      </Typography>
    </Container>
  );
};

export default Countries;
