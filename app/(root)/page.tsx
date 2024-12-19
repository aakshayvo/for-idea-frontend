import StartupCard from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";
import { GET_STARTUPS } from "@/sanity/lib/quaries";
import { getClient } from "@/lib/apollo-client";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const apolloClient = getClient();

  // Fetch data from Apollo Client
  const { data } = await apolloClient.query({
    query: GET_STARTUPS,
  });

  const posts = data?.allStartup || [];

  // Filter data only if a search query exists
  const filteredData = query
    ? posts.filter((startup: any) => {
        const searchTerms = query.toLowerCase();
        const titleMatch = startup.title.toLowerCase().includes(searchTerms);
        const categoryMatch = startup.category
          .toLowerCase()
          .includes(searchTerms);
        const authorMatch = startup.author?.name
          ?.toLowerCase()
          .includes(searchTerms);

        return titleMatch || categoryMatch || authorMatch;
      })
    : posts;

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect With Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual
          Competitions.
        </p>
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search Results: ${query}` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {filteredData.length > 0 ? (
            filteredData.map((post: any, index: number) => (
              <StartupCard key={index} post={post} />
            ))
          ) : (
            <p className="no-results">No Startups Found</p>
          )}
        </ul>
      </section>
    </>
  );
}
