export interface ResumeEntry {
  period: string
  role: string
  org: string
  detail: string
}

export const resumeContent = {
  experience: [
    {
      period: '2023 — Now',
      role: 'Senior Software Engineer',
      org: 'Example Labs',
      detail: 'Lead the real-time collaboration team. Cut sync latency 60% and shipped the editor used by 40k people daily.',
    },
    {
      period: '2021 — 2023',
      role: 'Software Engineer',
      org: 'Northbound',
      detail: 'Built the public API and developer portal from scratch. Owned billing, webhooks, and the TypeScript SDK.',
    },
    {
      period: '2019 — 2021',
      role: 'Frontend Developer',
      org: 'Studio Meridian',
      detail: 'Shipped marketing sites and product UIs for a dozen clients. Set up the component system the team still uses.',
    },
  ] as ResumeEntry[],
  education: [
    {
      period: '2015 — 2019',
      role: 'B.Sc. Computer Science',
      org: 'University of Toronto',
      detail: 'Focus on distributed systems and human-computer interaction. Graduated with high distinction.',
    },
  ] as ResumeEntry[],
  resumeUrl: '#',
}
