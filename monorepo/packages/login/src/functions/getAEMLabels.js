/* comment import {
  AEM_CONTENT_FRAGMENT_ENDPOINT,
  AEM_CONTENT_FRAGMENT_GRAPHQL_QUERY,
} from "../constants";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Basic ${btoa("admin:syedameen")}`,
};

export const getLablesForLoginForm = async () => {
  const response = await fetch(AEM_CONTENT_FRAGMENT_ENDPOINT, {
    headers,
    method: "POST",
    body: JSON.stringify({ query: AEM_CONTENT_FRAGMENT_GRAPHQL_QUERY }),
  });
  return response.json();
};
*/
