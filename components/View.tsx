import { getClient } from "@/lib/apollo-client";
import Ping from "./Ping";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/quaries";
import { writeClient } from "@/sanity/lib/write-client";
import { after } from "next/server";

const View = async ({ id }: { id: string }) => {
  const apolloClient = getClient();

  // Fetch data from Apollo Client
  const { data } = await apolloClient.query({
    query: STARTUP_VIEWS_QUERY,
    variables: { id },
  });
  const post = data?.allStartup[0] || [];

  //write operations
  after(async () => {
    //after allows you to schedule work to be executed after a response is finished.
    await writeClient
      .patch(id) // 1. Select the document to update
      .set({ views: post.views + 1 }) // 2. Update the "views" field
      .commit(); // 3. Commit the changes to the database
  });

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
//the speciality of this component is only this component is get updated and rest of the page remains static.
