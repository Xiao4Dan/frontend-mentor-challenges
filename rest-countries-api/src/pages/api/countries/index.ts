import type { NextApiRequest, NextApiResponse } from "next";
import CountryService from "../../../services/country.service";
import { FetchCountriesParams } from "@/interfaces/Country";

export default async function CountriesHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    // req will have params of sort, filter, limit, offset
    const { sort, region, name, limit, offset } = req.query;

    // use the sort and filter only if they are non-empty strings
    const queryParam: FetchCountriesParams = {};
    if (sort && sort !== "") {
      queryParam["sort"] = sort as string;
    }
    if (region && region !== "") {
      queryParam["region"] = region as string;
    }
    if (name && name !== "") {
      queryParam["name"] = name as string;
    }

    // use limit and offset only if they are valid numbers
    if (limit && !isNaN(parseInt(limit as string))) {
      queryParam["limit"] = parseInt(limit as string) + 1;
    }
    if (offset && !isNaN(parseInt(offset as string))) {
      queryParam["offset"] = parseInt(offset as string);
    }

    const response = await CountryService.getCountries(queryParam);
    const hasMore = response.length === parseInt(limit as string) + 1;
    if (hasMore) {
      response.pop();
    }
    return res.status(200).json({ data: response, hasMore });
  } catch (err: any) {
    console.error("GetCountries errror", err);
    return res.status(500).send(err);
  }
}
