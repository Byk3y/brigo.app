import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    readTime: string;
    excerpt: string;
    content: string;
    author: {
        name: string;
        avatar: string;
    };
}

export function getAllPosts(): BlogPost[] {
    // Get file names under /content/blog
    const fileNames = fs.readdirSync(postsDirectory);

    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map((fileName) => {
            // Remove ".md" from file name to get slug
            const slug = fileName.replace(/\.md$/, "");

            // Read markdown file as string
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents);

            // Combine the data with the slug
            return {
                slug,
                content: matterResult.content,
                ...(matterResult.data as {
                    title: string;
                    date: string;
                    readTime: string;
                    excerpt: string;
                    author: { name: string; avatar: string };
                }),
            };
        });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getPostBySlug(slug: string): BlogPost | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);

        return {
            slug,
            content: matterResult.content,
            ...(matterResult.data as {
                title: string;
                date: string;
                readTime: string;
                excerpt: string;
                author: { name: string; avatar: string };
            }),
        };
    } catch (e) {
        return null;
    }
}
