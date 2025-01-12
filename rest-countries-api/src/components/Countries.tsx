import {
  Box,
  Button,
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
import { Country, FetchCountriesParams } from "@/interfaces/Country";
import { useRouter } from "next/router";

const PAGE_SIZE = 12;

const Countries = () => {
  const router = useRouter();
  const [regionsLoaded, setRegionsLoaded] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [currentRegion, setCurrentRegion] = useState<string | null>(null);

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [lastFilter, setLastFilter] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchCountries = async ({
    sort,
    filter,
    limit,
    offset,
  }: FetchCountriesParams) => {
    // send get request with query params
    const countriesRes = await fetch(
      `/api/countries?sort=${sort}${
        filter === "" ? "" : `&${filter}`
      }&limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const countries = await countriesRes.json();
    const { data, hasMore } = countries;
    setHasMore(hasMore);
    return data;
  };

  const fetchRegions = async () => {
    const regionsRes = await fetch("/api/regions");
    const regionsBody = await regionsRes.json();
    return regionsBody;
  };

  useEffect(() => {
    (async () => {
      try {
        // Preload regions/options
        const regionsBody = await fetchRegions();
        if (!regionsBody) {
          throw new Error("Failed to fetch regions");
        }
        setRegions(regionsBody);
        setRegionsLoaded(true);

        // Fetch first page of countries
        setLoadingCountries(true);
        const countriesBody = await fetchCountries({
          sort: "",
          filter: "",
          limit: PAGE_SIZE,
          offset: 0,
        });
        if (!countriesBody) {
          throw new Error("Failed to fetch countries");
        }
        setCountries(countriesBody);
        setLoadingCountries(false);
      } catch (error) {
        console.error(error);
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

  const handleLoadMore = async (
    prev: Country[],
    parms: FetchCountriesParams
  ) => {
    const newCountries = await fetchCountries(parms);
    if (!newCountries) {
      throw new Error("Failed to fetch countries");
    }
    setCurrentPage(currentPage + 1);
    setCountries([...prev, ...newCountries]);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!regionsLoaded || loadingCountries) return;
      if (filter !== lastFilter) {
        // Perform any additional actions here if needed
        setLoadingCountries(true);
        setLastFilter(filter);
        // console.log("fetching countries", currentRegion, currentCountry);
        const countriesBody = await fetchCountries({
          sort: "",
          filter: filter || "",
          limit: PAGE_SIZE,
          offset: 0,
        });
        if (!countriesBody) {
          throw new Error("Failed to fetch countries");
        }
        setCurrentPage(0);
        setCountries(countriesBody);
        setLoadingCountries(false);
      }
    }, 500); // Check every half second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [filter, lastFilter]);

  useEffect(() => {
    // Format filter params
    const newFilter = [];
    if (currentRegion && currentRegion !== "") {
      newFilter.push(`region=${currentRegion}`);
    }
    if (currentCountry && currentCountry !== "") {
      newFilter.push(`name=${currentCountry}`);
    }
    setFilter(newFilter.join("&"));
  }, [currentCountry, currentRegion]);

  const handleRedirect = (code: string) => {
    router.push(`/${code}`);
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
          onSubmit={(e) => e.preventDefault()}
        >
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: 14, minWidth: 300 }}
            placeholder="Search for a country..."
            inputProps={{ "aria-label": "search for a country..." }}
            value={currentCountry || ""}
            onChange={(e) => setCurrentCountry(e.target.value)}
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
            aria-label={currentRegion || "Filter by Region"}
            onClick={handleClick}
            disabled={!regionsLoaded || loadingCountries}
          >
            <Typography
              variant="body1"
              component="p"
              sx={{ mr: 2, fontSize: 14 }}
            >
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

      <Grid2
        container
        spacing={{ xs: 2, md: 4, lg: 7 }}
        columns={{ sm: 4, md: 12, lg: 16 }}
      >
        {!loadingCountries &&
          countries.map((country: Country) => (
            <Grid2 key={country.name} size={{ sm: 2, md: 4, lg: 4 }}>
              <Card
                key={country.name}
                elevation={0}
                onClick={() => handleRedirect(country.alpha3Code)}
                sx={{
                  cursor: "pointer",
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
                      key={key}
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
                        {key === "population" &&
                          numberFormat(country.population.toString(), ",")}
                        {key === "region" && country.region}
                        {key === "capital" && country.capital}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid2>
          ))}
      </Grid2>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 2,
        }}
      >
        {loadingCountries && <CircularProgress color="secondary" size={30} />}
        {!loadingCountries && hasMore && (
          <Button
            onClick={() =>
              handleLoadMore(countries, {
                sort: "",
                filter: `region=${currentRegion || ""}&name=${
                  currentCountry || ""
                }`,
                limit: PAGE_SIZE,
                offset: (currentPage + 1) * PAGE_SIZE,
              })
            }
          >
            Load More
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Countries;
