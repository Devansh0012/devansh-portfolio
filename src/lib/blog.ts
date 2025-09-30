import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { ReactElement } from "react";
import { mdxComponents } from "@/components/mdx/components";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  coverImage?: string;
  heroQuote?: string;
};

export type BlogSummary = BlogFrontmatter & {
  slug: string;
  readingTime: string;
};

export type BlogPost = BlogSummary & {
  content: ReactElement;
};

const parseReadingTime = (content: string) => {
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 190));
  return `${minutes} min read`;
};

export async function getAllPostSlugs() {
  await ensureBlogDirectory();
  const files = await fs.readdir(BLOG_DIR);
  return files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(/\.mdx$/, ""));
}

export async function getAllPosts(): Promise<BlogSummary[]> {
  const slugs = await getAllPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
      const file = await fs.readFile(filePath, "utf-8");
      const { data, content } = matter(file);
      const frontmatter = data as BlogFrontmatter;
      return {
        ...frontmatter,
        slug,
        readingTime: parseReadingTime(content),
      } satisfies BlogSummary;
    })
  );

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  await ensureBlogDirectory();
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf-8");
  const { content: body } = matter(source);
  const { content, frontmatter } = await compileMDX<BlogFrontmatter>({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { properties: { className: ["anchor-link"] } }],
        ],
      },
    },
  });

  return {
    ...frontmatter,
    slug,
    readingTime: parseReadingTime(body),
    content,
  } satisfies BlogPost;
}

async function ensureBlogDirectory() {
  try {
    await fs.access(BLOG_DIR);
  } catch {
    await fs.mkdir(BLOG_DIR, { recursive: true });
  }
}
