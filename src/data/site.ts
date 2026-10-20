export interface SiteContent {
  brandName: string
  ownerName: string
  headline: string
  lead: string
  blogTitle: string
  logoUrl: string
}

export const defaultSite: SiteContent = {
  brandName: 'Cloudeasy Devops Portal',
  ownerName: 'Divyanshu Tiwari',
  headline: 'Projects, secrets, APIs, and servers in one workspace.',
  lead: 'A DevOps workspace made by Divyanshu Tiwari. Read the notes below, then sign in when you are ready to work.',
  blogTitle: 'Public posts',
  logoUrl: '',
}
