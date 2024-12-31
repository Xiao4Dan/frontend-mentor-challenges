import type { NextApiRequest, NextApiResponse } from "next";
import CountryService from "../../services/country.service";
import { FetchCountriesParams } from "@/interfaces/Country";

export default async function CountriesHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    // req will have params of sort, filter, limit, offset
    const { sort, filter, limit, offset } = req.query;

    // use the sort and filter only if they are non-empty strings
    const queryParam: FetchCountriesParams = {};
    if (sort && sort !== "") {
      queryParam["sort"] = sort as string;
    }
    if (filter && filter !== "") {
      queryParam["filter"] = filter as string;
    }

    // use limit and offset only if they are valid numbers
    if (limit && !isNaN(parseInt(limit as string))) {
      queryParam["limit"] = parseInt(limit as string);
    }
    if (offset && !isNaN(parseInt(offset as string))) {
      queryParam["offset"] = parseInt(offset as string);
    }

    console.log(queryParam);

    const response = await CountryService.getCountries(queryParam);
    return res.status(200).json(response);
  } catch (err: any) {
    console.error("GetCountries errror", err);
    return res.status(500).send(err);
  }
}
