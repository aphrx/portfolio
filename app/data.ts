type Project = {
  name: string
  description: string
  link: string
  video: string
  id: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Buzzcut',
    description:
      'Turn your building’s intercom into a smart buzzer system.',
    link: 'https://buzzcut.io',
    video:
      'https://res.cloudinary.com/drgtt3xac/video/upload/v1746067464/Product_Documentation_Video_i7c2ta.mp4?_a=DATAdtAAZAA0',
    id: 'project1',
  },
  {
    name: 'Alphion',
    description: 'The only fitness app you\'ll need to achieve your goals!',
    link: 'https://github.com/aphrx/alphion',
    video:
      'https://res.cloudinary.com/drgtt3xac/video/upload/v1746069083/alphion_p11umk.mp4?_a=DATAdtAAZAA0',
    id: 'project2',
  },
] 

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Analyticsmart',
    title: 'Senior Software Developer',
    start: 'Feb 2024',
    end: 'Present',
    link: 'https://analyticsmart.com',
    id: 'work1',
  },
  {
    company: 'Analyticsmart',
    title: 'Software Developer',
    start: 'Jul 2021',
    end: 'Feb 2024',
    link: 'https://analyticsmart.com',
    id: 'work2',
  },
  {
    company: 'QA Consultants',
    title: 'Software Developer',
    start: 'May 2020',
    end: 'Jul 2021',
    link: 'https://qaconsultants.com',
    id: 'work3',
  },
  {
    company: 'Ontario Tech University',
    title: 'Research Assistant',
    start: 'May 2019',
    end: 'Apr 2020',
    link: 'https://ontariotechu.ca/',
    id: 'work4',
  },
  {
    company: 'CIBC',
    title: 'Application Developer',
    start: 'Jan 2018',
    end: 'Dec 2018',
    link: 'https://cibc.com',
    id: 'work5',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  // {
  //   title: 'Exploring the Intersection of Design, AI, and Design Engineering',
  //   description: 'How AI is changing the way we design',
  //   link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
  //   uid: 'blog-1',
  // },
  // {
  //   title: 'Why I left my job to start my own company',
  //   description:
  //     'A deep dive into my decision to leave my job and start my own company',
  //   link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
  //   uid: 'blog-2',
  // },
  // {
  //   title: 'What I learned from my first year of freelancing',
  //   description:
  //     'A look back at my first year of freelancing and what I learned',
  //   link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
  //   uid: 'blog-3',
  // },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/aphrx',
  },
  {
    label: 'Twitter',
    link: 'https://twitter.com/amalparames',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/amalnnath',
  },
  {
    label: 'Instagram',
    link: 'https://www.instagram.com/aphrx.me',
  },
]

export const EMAIL = 'amalnnath20@gmail.com'
