import { createApi } from 'unsplash-js'

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
})

export async function getUnsplashImage(query: string): Promise<string | null> {
  try {
    const result = await unsplash.search.getPhotos({ query, perPage: 1 })
    const photo = result.response?.results?.[0]
    return photo?.urls?.regular || null
  } catch {
    return null
  }
}
