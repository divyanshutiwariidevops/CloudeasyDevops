export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  minutes: number
  body: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-cloudeasy-devops-portal',
    title: 'Why we built Cloudeasy Devops Portal',
    excerpt: 'One workspace for projects, secrets, APIs, and server access, so the team stops hunting through chats and shared drives.',
    date: '2026-10-12',
    tags: ['Product', 'Workflow'],
    minutes: 4,
    body: [
      'Most teams already have the pieces: a password manager, a notes doc, a terminal history, and a folder of API collections. The problem is that none of those pieces know about each other.',
      'Cloudeasy Devops Portal keeps the daily DevOps surface in one place. Projects sit next to the secrets they need, API checks live beside the environments they hit, and server access stays with the people who are allowed to use it.',
      'The portal is built for operators who switch context all day. Open the workspace, find the project, and continue the task without rebuilding the map from scratch.',
    ],
  },
  {
    slug: 'secrets-without-shared-env-files',
    title: 'Keep secrets out of shared .env files',
    excerpt: 'A small habit that stops credentials from landing in chat threads, screenshots, and old zip backups.',
    date: '2026-10-08',
    tags: ['Secrets', 'Security'],
    minutes: 5,
    body: [
      'A .env file is fine on one machine. It becomes a liability the moment it is pasted into a ticket or forwarded so someone else can “just try the API”.',
      'Store the variable in the portal vault, name the environment, and share access through a role instead of a file. The person who needs the value can reveal it when they are signed in. Everyone else never sees the raw secret.',
      'Rotate the value in one record. The next person who opens the project gets the current secret, not last quarter’s copy from a download folder.',
    ],
  },
  {
    slug: 'api-studio-before-you-deploy',
    title: 'Run the API check before you deploy',
    excerpt: 'Save the request, the expected status, and the environment so the next release starts from a known call.',
    date: '2026-09-28',
    tags: ['API', 'Release'],
    minutes: 4,
    body: [
      'A deploy is calmer when the request you care about is already saved. Method, path, headers, and a sample body should not live only in someone’s local client.',
      'API Studio is the place to keep that call with the project. Run it against staging, confirm the status, then run the same request against production after the rollout.',
      'When the response changes, the saved example is the baseline. You can see what moved without reconstructing the call from memory.',
    ],
  },
  {
    slug: 'ssh-access-you-can-explain',
    title: 'Server access you can explain later',
    excerpt: 'Write down the host, the purpose, and who should connect, before the emergency starts.',
    date: '2026-09-18',
    tags: ['Servers', 'Access'],
    minutes: 3,
    body: [
      'Emergency SSH usually starts with a search through old messages for an IP and a username. That search is the outage.',
      'Record the host with the project it belongs to, the reason it exists, and the role that may connect. When something breaks, the person on call opens the project and finds the path in.',
      'Access notes are not a substitute for keys and least privilege. They are how the team remembers which door is the right one.',
    ],
  },
  {
    slug: 'document-while-you-build',
    title: 'Document the system while you are building it',
    excerpt: 'Short notes written during the change are more useful than a wiki page written a month later.',
    date: '2026-09-04',
    tags: ['Docs', 'Workflow'],
    minutes: 4,
    body: [
      'The best diagram is the one drawn while the ports and hostnames are still fresh. Waiting for a quiet afternoon usually means the quiet afternoon never comes.',
      'Keep the note next to the project: what changed, which environment it touched, and what to check if it fails. Future you will not remember the temporary workaround.',
      'Cloudeasy Devops Portal treats documentation as part of the workspace, not a separate site you have to remember to update.',
    ],
  },
  {
    slug: 'bookmarks-for-on-call',
    title: 'Bookmarks that survive the on-call week',
    excerpt: 'Dashboards, status pages, and runbooks belong in Quick Access, not in a personal browser profile.',
    date: '2026-08-22',
    tags: ['On-call', 'Workflow'],
    minutes: 3,
    body: [
      'Browser bookmarks leave with the laptop. The next person on call should not need your Chrome profile to find the metrics board.',
      'Put the link in Quick Access with a plain name: what it is, and when you open it. Staging logs, the status page, the billing console, the deploy board.',
      'A shared list is shorter than a personal one, and that is the point. Only the links the team actually uses during an incident.',
    ],
  },
  {
    slug: 'invite-the-right-role',
    title: 'Invite people with the role they actually need',
    excerpt: 'Admin is not the default. Viewers, operators, and admins should see different doors.',
    date: '2026-08-09',
    tags: ['Access', 'Team'],
    minutes: 4,
    body: [
      'A new teammate does not need every secret on day one. Start with the projects they will touch and the role that matches the work.',
      'Viewers can read. Operators can run the daily tools. Admins can invite people and change access. Mixing those jobs makes every login more powerful than it should be.',
      'When someone changes teams, change the role in the portal. Do not leave an old admin invite sitting in an inbox.',
    ],
  },
  {
    slug: 'a-drive-for-the-files-that-are-not-code',
    title: 'A drive for the files that are not code',
    excerpt: 'Exports, diagrams, and certificates need a home that is not a random desktop folder.',
    date: '2026-07-27',
    tags: ['Drive', 'Projects'],
    minutes: 3,
    body: [
      'Not every artifact belongs in git. A signed diagram, a CSV export, or a certificate bundle still has to be findable next month.',
      'Personal Drive keeps those files with the portal account that owns them. Name the file for the project and the date, and the next search finds it.',
      'If the file contains a secret, store the secret in the vault and keep only the non-secret artifact in the drive.',
    ],
  },
]

export function findPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

export function formatPostDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
