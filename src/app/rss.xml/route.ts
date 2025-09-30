import { NextResponse } from "next/server";
import RSS from "rss";
import { getAllPosts } from "@/lib/blog";

export async function GET() {
  const posts = await getAllPosts();
  const siteUrl = "https://www.devanshdubey.com";
  const feed = new RSS({
    title: "Devansh Dubey — Engineering Log",
    description: "Stories and deep dives from Devansh's engineering journey.",
    site_url: siteUrl,
    feed_url: `${siteUrl}/rss.xml`,
    language: "en",
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      date: post.date,
      categories: [post.category, ...post.tags],
    });
  });

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
