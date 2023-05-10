import axios from "axios";
import { Company } from "../components/PostEditor";
import { ERoutes } from "./endpointConstants";

interface Job {
  id: number;
  title: string;
}

export const getField = async (prefix: string): Promise<readonly string[]> => {
  const { API_BASE_URL, V1, COMPANIES_PREFIX, JOBS_PREFIX } = ERoutes;
  const REQUEST_URL = `${API_BASE_URL}${V1}${prefix}`;
  const response = await axios.get(REQUEST_URL);

  switch (prefix) {
    case COMPANIES_PREFIX:
      return response.data.map((company: Company) => company.name);
    case JOBS_PREFIX:
      return response.data.map((job: Job) => job.title);
    default:
      throw new Error("Not Implemented");
  }
};
