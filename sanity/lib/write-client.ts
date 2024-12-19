import "server-only"; //this code only runs on server

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, token } from "../env";

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token,
});

if (!writeClient.token) {
  throw new Error("Missing SANITY_WRITE_TOKEN in environment variables");
}
