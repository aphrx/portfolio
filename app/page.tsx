'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import { Code2, InfoIcon, MessageCircle, Sparkles, Terminal, XIcon } from 'lucide-react'
import { Spotlight } from '@/components/ui/spotlight'
import { Magnetic } from '@/components/ui/magnetic'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog'
import { cn } from '@/lib/utils'
import {
  PROJECTS,
  WORK_EXPERIENCE,
  EMAIL,
  SOCIAL_LINKS,
} from './data'

const MODES = [
  {
    id: 'overview',
    label: 'Showcase',
  },
  {
    id: 'chat',
    label: 'Chat View',
  },
  {
    id: 'cli',
    label: 'CLI Mode',
  },
] as const

type Mode = (typeof MODES)[number]['id']

const MODE_ICONS: Record<Mode, LucideIcon> = {
  overview: Sparkles,
  chat: MessageCircle,
  cli: Code2,
}

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

type ProjectVideoProps = {
  src: string
}

const CLI_PROMPT = 'amal@portfolio'
const CLI_WELCOME = [
  'Welcome to Amal\'s terminal view.',
  'Type `help` to list the available commands.',
]

type HistoryItem = {
  type: 'system' | 'command' | 'output'
  value: string[]
}

type ChatMessage = {
  id: string
  sender: 'client' | 'amal'
  text: string
  timestamp: string
}

const EXPERIENCE_RESPONSES: string[][] = [
  [
    'Day job is Senior Backend at Koyfin keeping real-time analytics snappy on ClickHouse + Kafka.',
    'Before that I was building AI forecasting dashboards at Analyticsmart and a lot of QA infra at QA Consultants/Ontario Tech.',
  ],
  [
    'Most recently I re-architected Koyfin’s API layer; prior to that I led internal tooling at Analyticsmart.',
    'Earlier I cut my teeth automating large regression suites at QA Consultants and building research prototypes at Ontario Tech.',
  ],
]

const SKILL_RESPONSES: string[][] = [
  [
    'Everyday stack: Node.js, GraphQL, tRPC, ClickHouse, Kafka, and a healthy dose of AWS (ECS/Lambda/Terraform).',
    'On the product surface I like Motion + Next.js and Tailwind for fast UI loops.',
  ],
  [
    'I reach for Postgres, Redis, and sometimes dbt when the data story matters.',
    'Infra wise it’s IaC-first—Terraform, Docker, and observability with Grafana/Tempo/Loki.',
  ],
]

const AVAILABILITY_RESPONSES: string[][] = [
  [
    'I’m full-time at Koyfin so consulting happens evenings/weekends.',
    'Scoped backend or infra work usually wraps in ~2–3 weeks once the requirements are crisp.',
  ],
  [
    'Calendar fills up fast, but I keep a couple micro-engagement slots each month.',
    'If you have a live deadline just give me the date and I’ll say if it’s realistic.',
  ],
]

const RATE_RESPONSES: string[][] = [
  [
    'Advisory chats start around $250/hr.',
    'Project work tends to start at $6k/week, but I size it after understanding the integrations.',
  ],
  [
    'Short mentorship/architecture sessions are hourly; deeper builds are weekly retainers.',
    'Happy to be upfront once I know scope + timeline.',
  ],
]

const CONTACT_RESPONSES: string[][] = [
  [
    `Drop a line at ${EMAIL} and I’ll reply within a day.`,
    'If you prefer async, I’m also active on GitHub and LinkedIn.',
  ],
  [
    `Email works best (${EMAIL}), but I also check DMs on Twitter/LinkedIn regularly.`,
  ],
]

const FALLBACK_RESPONSES: string[][] = [
  [
    'Can definitely chat about experience, stack, availability, or rates.',
    'Ask me anything and I’ll give you the relevant details.',
  ],
  [
    'I can riff on past roles, what I’m building now, or how I partner with teams.',
    'Hit me with a topic and I’ll share specifics.',
  ],
]

const randomChoice = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

function ProjectVideo({ src }: ProjectVideoProps) {
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }}
    >
      <MorphingDialogTrigger>
        <video
          src={src}
          autoPlay
          loop
          muted
          className="aspect-video w-full cursor-zoom-in rounded-xl"
        />
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative aspect-video rounded-2xl bg-zinc-50 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50">
          <video
            src={src}
            autoPlay
            loop
            muted
            className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh]"
          />
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

function MagneticSocialLink({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        rel="noopener noreferrer"
        target="_blank"
        className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </Magnetic>
  )
}

function ModeSwitcher({
  activeMode,
  onModeChange,
  orientation = 'vertical',
}: {
  activeMode: Mode
  onModeChange: (mode: Mode) => void
  orientation?: 'vertical' | 'horizontal'
}) {
  const stackClass = orientation === 'horizontal' ? 'flex-row' : 'flex-col'
  const cardWidthClass =
    orientation === 'horizontal' ? 'flex-1' : 'w-full'

  return (
    <div className={cn('flex gap-3', stackClass, orientation === 'horizontal' && 'w-full')}>
      {MODES.map((modeOption) => {
        const Icon = MODE_ICONS[modeOption.id]
        const isActive = activeMode === modeOption.id

        return (
          <div key={modeOption.id} className={cn('relative', cardWidthClass)}>
            <div className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(24,24,27,0.35),_transparent_65%)] blur-3xl opacity-60 dark:bg-[radial-gradient(circle,_rgba(244,244,245,0.45),_transparent_70%)]" />
              </div>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onModeChange(modeOption.id)}
                className={cn(
                  'flex h-full w-full items-center gap-3 rounded-[15px] px-5 py-4 text-left text-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-200',
                  orientation === 'horizontal' ? 'justify-center text-center' : 'justify-start',
                  isActive
                    ? 'bg-white/95 text-zinc-900 shadow-lg ring-1 ring-black/5 dark:bg-zinc-950/95 dark:text-white dark:ring-white/5'
                    : 'bg-white/70 text-zinc-600 dark:bg-zinc-950/70 dark:text-zinc-400',
                )}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span>{modeOption.label}</span>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function OverviewContent() {
  return (
    <div className="space-y-24">
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <div className="flex-1">
          <p className="text-zinc-600 dark:text-zinc-400">
            Building robust backend systems and cloud solutions that power intuitive, scalable, and user-focused applications.
          </p>
        </div>
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h3 className="mb-5 text-lg font-medium">Selected Projects</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <div key={project.name} className="space-y-2">
              <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                <ProjectVideo src={project.video} />
              </div>
              <div className="px-1">
                <a
                  className="font-base group relative inline-block font-[450] text-zinc-900 dark:text-zinc-50"
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.name}
                  <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full"></span>
                </a>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h3 className="mb-5 text-lg font-medium">Work Experience</h3>
        <div className="flex flex-col space-y-2">
          {WORK_EXPERIENCE.map((job) => (
            <a
              className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30"
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              key={job.id}
            >
              <Spotlight
                className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
                size={64}
              />
              <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
                <div className="relative flex w-full flex-row justify-between">
                  <div>
                    <h4 className="font-normal dark:text-zinc-100">{job.title}</h4>
                    <p className="text-zinc-500 dark:text-zinc-400">{job.company}</p>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {job.start} - {job.end}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h3 className="mb-5 text-lg font-medium">Connect</h3>
        <p className="mb-5 text-zinc-600 dark:text-zinc-400">
          Feel free to contact me at{' '}
          <a className="underline dark:text-zinc-300" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </p>
        <div className="flex items-center justify-start space-x-3">
          {SOCIAL_LINKS.map((link) => (
            <MagneticSocialLink key={link.label} link={link.link}>
              {link.label}
            </MagneticSocialLink>
          ))}
        </div>
      </motion.section>
    </div>
  )
}

function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messageTimeoutsRef = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      messageTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  const formatTimestamp = () =>
    new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const getAutoResponse = (text: string): string[] => {
    const normalized = text.toLowerCase()
    if (
      normalized.includes('experience') ||
      normalized.includes('koyfin') ||
      normalized.includes('analyticsmart')
    ) {
      return randomChoice(EXPERIENCE_RESPONSES)
    }
    if (
      normalized.includes('skill') ||
      normalized.includes('stack') ||
      normalized.includes('tech')
    ) {
      return randomChoice(SKILL_RESPONSES)
    }
    if (normalized.includes('availability') || normalized.includes('timeline')) {
      return randomChoice(AVAILABILITY_RESPONSES)
    }
    if (normalized.includes('rate') || normalized.includes('budget')) {
      return randomChoice(RATE_RESPONSES)
    }
    if (normalized.includes('contact') || normalized.includes('email')) {
      return randomChoice(CONTACT_RESPONSES)
    }
    return randomChoice(FALLBACK_RESPONSES)
  }

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const clientMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'client',
      text: trimmed,
      timestamp: formatTimestamp(),
    }
    setMessages((prev) => [...prev, clientMessage])
    setInput('')

    setIsTyping(true)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    messageTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    messageTimeoutsRef.current = []
    const replies = getAutoResponse(trimmed)
    typingTimeoutRef.current = setTimeout(() => {
      replies.forEach((reply, index) => {
        const timeout = setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              sender: 'amal',
              text: reply,
              timestamp: formatTimestamp(),
            },
          ])
          if (index === replies.length - 1) {
            setIsTyping(false)
          }
        }, index * 900)
        messageTimeoutsRef.current.push(timeout)
      })
    }, 600 + Math.random() * 400)
  }

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTo({
        top: logRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, isTyping])

  return (
    <div className="relative mx-auto w-full max-w-2xl space-y-4">
      <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <span className="font-medium text-zinc-900 dark:text-white">Chat with Amal (Bot)</span>
        <button
          type="button"
          onClick={() => setShowInfo((prev) => !prev)}
          aria-pressed={showInfo}
          aria-expanded={showInfo}
          className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <InfoIcon className="h-3.5 w-3.5" />
          <span className="sr-only">Toggle recognized topics</span>
        </button>
      </div>
      {showInfo && (
        <div className="absolute right-0 top-8 z-10 w-64 rounded-2xl border border-zinc-200 bg-white p-4 text-xs text-zinc-600 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Resume topics
          </p>
          <ul className="space-y-1 text-[0.78rem]">
            <li className="rounded-lg bg-zinc-50 px-2 py-1 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-200">
              Experience (Koyfin, Analyticsmart, QA Consultants…)
            </li>
            <li className="rounded-lg bg-zinc-50 px-2 py-1 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-200">
              Skills & stack (Node, ClickHouse, AWS…)
            </li>
            <li className="rounded-lg bg-zinc-50 px-2 py-1 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-200">
              Availability & timelines
            </li>
            <li className="rounded-lg bg-zinc-50 px-2 py-1 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-200">
              Rates & contact info
            </li>
          </ul>
        </div>
      )}

      <div
        ref={logRef}
        className="mt-4 h-[28rem] space-y-4 overflow-y-auto pr-2"
      >
        {messages.length === 0 && (
          <div className="space-y-3 rounded-2xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-300">
            <p>Start a conversation with Amal.</p>
            <p className="text-xs">
              Try asking about <span className="font-medium text-zinc-600 dark:text-zinc-200">projects</span>,{' '}
              <span className="font-medium text-zinc-600 dark:text-zinc-200">timelines</span>,{' '}
              <span className="font-medium text-zinc-600 dark:text-zinc-200">rates</span>, or{' '}
              <span className="font-medium text-zinc-600 dark:text-zinc-200">availability</span>.
            </p>
          </div>
        )}
        {messages.map((message, index) => {
          const isClient = message.sender === 'client'
          const nextMessage = messages[index + 1]
          const showTimestamp = !nextMessage || nextMessage.sender !== message.sender
          return (
            <div
              key={message.id}
              className={cn('flex flex-col gap-1', isClient ? 'items-end self-end' : 'items-start')}
            >
              <p
                className={cn(
                  'inline-flex max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow',
                  isClient
                    ? 'rounded-br-sm bg-gradient-to-r from-[#3a83ff] to-[#2173ff] text-white'
                    : 'rounded-bl-sm bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
                )}
                >
                  {message.text}
                </p>
                {showTimestamp && (
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    {message.timestamp}
                  </span>
                )}
              </div>
            )
          })}
        {isTyping && (
          <div className="flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm text-zinc-500 shadow dark:bg-zinc-800">
              <span className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.2s]" />
              </span>
              Amal is typing…
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <input
          className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
          placeholder="Ask Amal about your idea…"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleSend()
            }
          }}
        />
        <button
          type="button"
          className="rounded-full bg-[#007AFF] px-4 py-1.5 text-sm font-medium text-white shadow disabled:opacity-50"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}


function CliResume() {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'system', value: CLI_WELCOME },
  ])
  const [input, setInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const previousBodyOverflow = useRef<string>('')

  const commands = useMemo<Record<string, string[]>>(() => {
    const base: Record<string, string[]> = {
      about: [
        'Name: Amal Parameswaran',
        'Role: Senior Backend Engineer',
        'Focus: Distributed systems, data platforms, DX tooling.',
      ],
      projects: PROJECTS.map(
        (project) => `- ${project.name}: ${project.description}`,
      ),
      experience: WORK_EXPERIENCE.slice(0, 4).map(
        (job) => `- ${job.title} @ ${job.company} (${job.start} - ${job.end})`,
      ),
      contact: [
        `Email: ${EMAIL}`,
        ...SOCIAL_LINKS.map((link) => `${link.label}: ${link.link}`),
      ],
    }

    return {
      ...base,
      help: [
        'Available commands:',
        ...Object.keys(base).map((command) => `- ${command}`),
        '- clear',
      ],
    }
  }, [])

  useEffect(() => {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [history])

  const handleCommand = (command: string) => {
    const trimmed = command.trim()
    if (!trimmed) return

    const normalized = trimmed.toLowerCase()

  if (normalized === 'clear') {
    setHistory([])
    setInput('')
    inputRef.current?.focus()
    return
  }

    const response = commands[normalized]

    setHistory((prev) => [
      ...prev,
      { type: 'command', value: [`${CLI_PROMPT}$ ${trimmed}`] },
      {
        type: 'output',
        value:
          response ?? [
            `Command \"${normalized}\" not found.`,
            'Try `help` to see what is available.',
          ],
      },
    ])
    setInput('')
    inputRef.current?.focus()
  }

  useEffect(() => {
    previousBodyOverflow.current = document.body.style.overflow
    return () => {
      document.body.style.overflow = previousBodyOverflow.current
    }
  }, [])

  useEffect(() => {
    if (isExpanded) {
      previousBodyOverflow.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previousBodyOverflow.current
    }
  }, [isExpanded])

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  const logAreaClasses = cn(
    'space-y-3 overflow-y-auto px-4 py-4 text-sm',
    isExpanded ? 'flex-1' : 'h-80',
  )

  const containerClasses = cn(
    'flex flex-col overflow-hidden rounded-3xl border border-zinc-900/70 bg-[#0d0f17] text-zinc-100 shadow-[0_25px_70px_rgba(0,0,0,0.45)] ring-1 ring-black/50',
    isExpanded
      ? 'fixed inset-6 z-50 mx-auto flex w-auto max-w-5xl flex-col'
      : '',
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [isExpanded])

  return (
    <div className={cn(isExpanded ? 'min-h-[28rem]' : '')}>
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 cursor-default bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}
      <div className={containerClasses}>
        <div className="flex items-center justify-between border-b border-white/5 bg-zinc-900/40 px-4 py-3 text-xs uppercase tracking-[0.2em] text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="inline-flex gap-1.5">
              {['#ff5f56', '#ffbd2e'].map((color) => (
                <span
                  key={color}
                  className="h-3 w-3 rounded-full border border-black/20"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
              ))}
              <button
                type="button"
                onClick={handleToggleExpand}
                className="h-3 w-3 rounded-full border border-black/20 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0d0f17]"
                style={{ backgroundColor: '#27c93f' }}
                aria-pressed={isExpanded}
                aria-label={isExpanded ? 'Exit full screen' : 'Enter full screen'}
              />
            </span>
            <span className="flex items-center gap-2 text-[11px] normal-case tracking-normal text-zinc-300">
              <Terminal className="h-3.5 w-3.5 text-zinc-400" />
              Amal CLI
            </span>
          </div>
          <span className="text-[11px] text-zinc-500">
            {isExpanded ? 'fullscreen' : 'shell v1.0'}
          </span>
        </div>
        <div ref={outputRef} className={logAreaClasses} role="log" aria-live="polite">
          {history.length === 0 && (
            <div className="text-zinc-500">
              Session cleared. Type <code>help</code> to begin.
            </div>
          )}
          {history.map((entry, index) => (
            <div key={`${entry.type}-${index}`} className="whitespace-pre-wrap">
              {entry.value.map((line) => (
                <p
                  key={line}
                  className={
                    entry.type === 'command'
                      ? 'text-emerald-300'
                      : entry.type === 'system'
                        ? 'text-zinc-400'
                        : 'text-zinc-100'
                  }
                >
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
        <form
          className="flex items-center gap-2 border-t border-zinc-900/60 px-4 py-3 text-sm"
          onSubmit={(event) => {
            event.preventDefault()
            handleCommand(input)
          }}
        >
          <span className="text-emerald-300">{CLI_PROMPT}$</span>
          <input
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label="CLI command input"
            ref={inputRef}
          />
        </form>
      </div>
    </div>
  )
}

export default function Personal() {
  const [mode, setMode] = useState<Mode>('overview')

  return (
    <motion.main
      className="space-y-10"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <div className="relative">
        <div
          className="pointer-events-none fixed top-32 z-20 hidden xl:block"
          style={{ left: 'max(1.5rem, calc((100vw - 640px) / 2 - 280px))' }}
        >
          <div className="pointer-events-auto w-64">
            <ModeSwitcher activeMode={mode} onModeChange={(value) => setMode(value)} />
          </div>
        </div>

        <div className="space-y-10">
          {mode === 'overview' && <OverviewContent />}
          {mode === 'chat' && <ChatView />}
          {mode === 'cli' && <CliResume />}
        </div>
      </div>
    </motion.main>
  )
}
