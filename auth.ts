import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { getClient } from "./lib/apollo-client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/quaries";
import { writeClient } from "./sanity/lib/write-client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // Handles sign-in logic
    async signIn({ user: { name, email, image }, account, profile }) {
      const client = getClient();

      try {
        // Query to check if the user already exists
        const { data } = await client.query({
          query: AUTHOR_BY_GITHUB_ID_QUERY,
          variables: { id: profile.id },
        });

        // Extract the first author from the result
        const existingUser = data.allAuthor?.[0];

        if (!existingUser) {
          // Create a new author if they don't exist
          await writeClient.create({
            _type: "author",
            id: profile.id,
            name,
            username: profile.login,
            email,
            image,
            bio: profile.bio || "",
          });
          console.log("New user created in Sanity.");
        } else {
          console.log("User already exists.");
        }

        return true; // Allow sign-in
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // Deny sign-in on error
      }
    },

    // Adds custom properties to the JWT token
    async jwt({ token, account, profile }) {
      if (account && profile) {
        try {
          const client = getClient();

          // Query to fetch the user
          const { data } = await client.query({
            query: AUTHOR_BY_GITHUB_ID_QUERY,
            variables: { id: profile.id },
          });

          // Extract the first user
          const user = data.allAuthor?.[0];

          if (user) {
            token.id = user._id; // Add user's ID to the token
          }
        } catch (error) {
          console.error("Error fetching user in JWT callback:", error);
        }
      }
      return token;
    },

    // Adds custom properties to the session object
    async session({ session, token }) {
      if (token?.id) {
        session.id = token.id; // Include user ID in the session
      }
      return session;
    },
  },
});
