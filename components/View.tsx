import { getClient } from "@/lib/apollo-client";
import Ping from "./Ping";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/quaries";

const View = async ({ id }: { id: string }) => {
  const apolloClient = getClient();

  // Fetch data from Apollo Client
  const { data } = await apolloClient.query({
    query: STARTUP_VIEWS_QUERY,
    variables: { id },
  });
  const post = data?.allStartup[0] || [];

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">
          {post.views} {post.views > 1 ? "Views" : "View"}
        </span>
      </p>
    </div>
  );
};

export default View;
