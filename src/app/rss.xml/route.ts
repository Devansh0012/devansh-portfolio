import { NextResponse } from "next/server";
import RSS from "rss";
import { getAllPosts } from "@/lib/blog";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const posts = await getAllPosts();
  const siteUrl = "https://www.devanshdubey.com";

  const feed = new RSS({
    title: "Devansh Dubey — Engineering Log",
    description: "Stories and deep dives from Devansh's engineering journey. Deep dives from production incidents, design docs, hackathon sprints, and community workshops.",
    site_url: siteUrl,
    feed_url: `${siteUrl}/rss.xml`,
    language: "en",
    copyright: `Copyright ${new Date().getFullYear()} Devansh Dubey`,
    managingEditor: "Devansh Dubey",
    webMaster: "Devansh Dubey",
    generator: "Next.js + RSS",
    ttl: 60, // Cache for 60 minutes
  });

  // Fetch raw markdown content for each post
  const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

  for (const post of posts) {
    const filePath = path.join(BLOG_DIR, `${post.slug}.mdx`);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { content } = matter(fileContent);

    // Convert markdown to basic HTML-like format for RSS
    const contentHtml = content
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(.+)$/gm, (match) => {
        if (!match.startsWith("<")) return `<p>${match}</p>`;
        return match;
      });

    feed.item({
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      guid: `${siteUrl}/blog/${post.slug}`,
      categories: [post.category, ...post.tags],
      author: "Devansh Dubey",
      date: post.date,
      custom_elements: [
        { "content:encoded": `<![CDATA[${contentHtml}]]>` },
        { "dc:creator": "Devansh Dubey" },
      ],
    });
  }

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
