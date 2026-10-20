import mongoose from 'mongoose'

const siteSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'public', unique: true },
    brandName: { type: String, default: 'Cloudeasy Devops Portal' },
    ownerName: { type: String, default: 'Divyanshu Tiwari' },
    headline: { type: String, default: 'Projects, secrets, APIs, and servers in one workspace.' },
    lead: {
      type: String,
      default: 'A DevOps workspace made by Divyanshu Tiwari. Read the notes below, then sign in when you are ready to work.',
    },
    blogTitle: { type: String, default: 'Public posts' },
    logoUrl: { type: String, default: '' },
  },
  { timestamps: true },
)

export const Site = mongoose.models.Site || mongoose.model('Site', siteSchema)
