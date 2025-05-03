'use client'
import { useState } from 'react'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="font-medium text-black dark:text-white">
            Amal Parameswaran
          </Link>
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            className="text-zinc-600 dark:text-zinc-500"
            delay={0.5}
          >
            Software Engineer
          </TextEffect>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-zinc-300 dark:ring-zinc-700"
        >
          <Image
            src="/profile.png"
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </button>
      </header>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <Image
            src="/profile.jpg"
            alt="Profile Enlarged"
            width={300}
            height={300}
            className="rounded-full object-cover border-4 border-white"
          />
        </div>
      )}
    </>
  )
}
