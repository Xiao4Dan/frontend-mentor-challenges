import type { NextApiRequest, NextApiResponse } from "next";
import CountryService from "../../services/country.service";

type ResponseData = {
  message: string;
};

export default async function RegionsHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const response = await CountryService.getRegions();
    return res.status(200).json(response);
  } catch (err: any) {
    console.error("GetRegions errror", err);
    return res.status(500).send(err);
  }
}
