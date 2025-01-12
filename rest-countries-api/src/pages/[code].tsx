import { Country } from "@/interfaces/Country";
import {
  Box,
  Button,
  Container,
  Grid2,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

interface BorderCountry {
  name: string;
  alpha3Code: string;
}

const CountryPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const [country, setCountry] = useState<Country | null>(null);

  const [borderCountries, setBorderCountries] = useState<BorderCountry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (code) {
      // Fetch country data based on the id
      fetchCountryData(code as string);
    }
  }, [code]);

  const fetchCountryData = async (countryId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/countries/${countryId}`);
      const data = await response.json();
      if (data?.borders?.length) {
        const borderCountries = await Promise.all(
          data.borders.map(async (border: string) => {
            const response = await fetch(`/api/countries/${border}`);
            return response.json();
          })
        );
        setBorderCountries(borderCountries);
      }
      setCountry(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };

  if (!country) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      maxWidth="lg"
      component="main"
      sx={{ display: "flex", flexDirection: "column", my: 6, gap: 6 }}
    >
      <Button
        variant="contained"
        sx={{ width: "min-content" }}
        onClick={() => router.back()}
      >
        <KeyboardBackspaceIcon />
        <Typography variant="body1" sx={{ pl: 1, textTransform: "capitalize" }}>
          Back
        </Typography>
      </Button>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 6,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={country.flag}
          alt={`${country.name} flag`}
          sx={{ width: "50%" }}
        />
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            justifyContent: "start",
            alignItems: "start",
          }}
        >
          <Typography variant="h2" textAlign="left">
            {country.name}
          </Typography>
          <Grid2 container spacing={1}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="body1">
                <strong>Native Name:</strong> {country.nativeName}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="body1">
                <strong>Top Level Domain:</strong> {country.topLevelDomain}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="body1">
                <strong>Population:</strong> {country.population}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="body1">
                <strong>Currencies:</strong>{" "}
                {country.currencies.map((currency) => currency.name).join(", ")}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="body1">
                <strong>Region:</strong> {country.region}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="body1">
                <strong>Languages:</strong>{" "}
                {country.languages.map((language) => language.name).join(", ")}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="body1">
                <strong>Sub Region:</strong> {country.subregion}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="body1">
                <strong>Capital:</strong> {country.capital}
              </Typography>
            </Grid2>
          </Grid2>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              justifyContent: "start",
              alignItems: "start",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body1">
              <strong>Border Countries:</strong>
            </Typography>
            {borderCountries?.length &&
              borderCountries.map((border: BorderCountry) => (
                <Link key={border.alpha3Code} href={`/${border.alpha3Code}`}>
                  <Button variant="contained">{border.name}</Button>
                </Link>
              ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default CountryPage;
