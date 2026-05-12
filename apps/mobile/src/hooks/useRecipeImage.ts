/**
 * useRecipeImage — resolves an image URL for any recipe/activity/festival.
 * Provider is controlled by EXPO_PUBLIC_IMAGE_PROVIDER env var.
 * Never call image providers directly from screen components — use this hook.
 */

import { useQuery } from '@tanstack/react-query';

type ImageProvider = 'unsplash' | 'pexels' | 'supabase' | 'ai';
type ImageCategory = 'meal' | 'activity' | 'festival' | 'decor';

interface RecipeImageResult {
  uri: string;
  credit?: string;      // Unsplash requires photographer attribution
  blurhash?: string;
}

const UNSPLASH_SEARCH_QUERIES: Record<ImageCategory, (name: string) => string> = {
  meal: (name) => `${name} Indian food`,
  activity: () => 'children craft activity',
  festival: (name) => `${name} celebration`,
  decor: (name) => `${name} Indian decoration`,
};

async function fetchUnsplashImage(name: string, category: ImageCategory): Promise<RecipeImageResult> {
  const accessKey = process.env['EXPO_PUBLIC_UNSPLASH_ACCESS_KEY'];
  if (!accessKey) throw new Error('EXPO_PUBLIC_UNSPLASH_ACCESS_KEY not set');

  const query = UNSPLASH_SEARCH_QUERIES[category](name);
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&w=520&q=80`;

  const res = await fetch(url, { headers: { Authorization: `Client-ID ${accessKey}` } });
  if (!res.ok) throw new Error(`Unsplash error: ${res.status}`);

  const json = await res.json() as { results: Array<{ urls: { regular: string }; user: { name: string }; blur_hash?: string }> };
  const photo = json.results[0];
  if (!photo) throw new Error('No image found');

  return {
    uri: `${photo.urls.regular}&w=520&q=80`,
    credit: photo.user.name,
    blurhash: photo.blur_hash,
  };
}

async function fetchSupabaseImage(name: string): Promise<RecipeImageResult> {
  const baseUrl = process.env['EXPO_PUBLIC_SUPABASE_URL'];
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return {
    uri: `${baseUrl}/storage/v1/object/public/recipe-images/${slug}.webp`,
  };
}

export function useRecipeImage(name: string, category: ImageCategory) {
  const provider = (process.env['EXPO_PUBLIC_IMAGE_PROVIDER'] ?? 'unsplash') as ImageProvider;

  return useQuery<RecipeImageResult, Error>({
    queryKey: ['recipeImage', provider, name, category],
    queryFn: async () => {
      switch (provider) {
        case 'unsplash':
          return fetchUnsplashImage(name, category);
        case 'supabase':
          return fetchSupabaseImage(name);
        default:
          return fetchUnsplashImage(name, category);
      }
    },
    staleTime: 1000 * 60 * 60 * 4, // 4 hours — align with API cache TTL
    retry: 1,
  });
}
