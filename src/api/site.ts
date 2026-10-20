import { apiFetch, authFetch } from './http'
import { defaultSite, type SiteContent } from '../data/site'

export async function fetchSite() {
  const data = await apiFetch<{ site: SiteContent }>('/api/site')
  return { ...defaultSite, ...data.site }
}

export async function saveSite(site: SiteContent) {
  const data = await authFetch<{ site: SiteContent }>('/api/site', {
    method: 'PUT',
    body: JSON.stringify(site),
  })
  return { ...defaultSite, ...data.site }
}
