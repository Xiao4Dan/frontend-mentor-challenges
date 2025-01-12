import type { NextApiRequest, NextApiResponse } from "next";
import CountryService from "../../../services/country.service";
import { Country, FetchCountriesParams } from "@/interfaces/Country";

export default async function CountryHandler(
  req: NextApiRequest,
  res: NextApiResponse<Country | { message: string }>
) {
  try {
    // req will have params of sort, filter, limit, offset
    const { code, includeFields } = req.query;

    // check if code is a string
    if (typeof code !== "string" || code.length <= 0) {
      return res.status(400).json({ message: "Invalid code" });
    }

    // validate if includeFields is a string array
    let fields: string[] = [];
    if (includeFields && Array.isArray(includeFields)) {
      fields = includeFields;
    }

    const response = await CountryService.getCountryByAlpha3Code(code, fields);
    return res.status(200).json(response);
  } catch (err: any) {
    console.error("GetCountries errror", err);
    return res.status(500).send(err);
  }
}
