import type { NextApiRequest, NextApiResponse } from "next";
import CountryService from "../../services/country.service";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const response = await CountryService.getCountries();
    return res.status(200).json(response);
  } catch (err: any) {
    console.error("GetCountries errror", err);
    return res.status(500).send(err);
  }
}
