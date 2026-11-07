import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['Promo', 'Resep', 'Tips & Inspirasi']),
    publishDate: z.coerce.date(),
    status: z.enum(['published', 'draft']).default('published'),
    featured: z.boolean().default(false),
    excerpt: z.string(),
    thumbnail: z.string(),
    thumbnailAlt: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional()
  })
});

export const collections = { articles };
