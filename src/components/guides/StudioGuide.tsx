import type { ReactNode } from 'react'

import { Action } from '@/components/ui/Action'

export function StudioGuide({
  guide,
  enquiry,
  children,
}: {
  guide: { title: string; intro: string; sections: { title: string; text: string }[] }
  enquiry: string
  children?: ReactNode
}) {
  return (
    <main id="main">
      <header className="grid-bg px-site py-section">
        <h1 className="max-w-[920px] text-display">{guide.title}</h1>
        <p className="mt-6 max-w-[660px] text-lg">{guide.intro}</p>
        <Action href={enquiry} className="mt-7">Discuss your tattoo</Action>
      </header>
      <div className="px-site py-section">
        <div className="grid gap-10 md:grid-cols-2">
          {guide.sections.map(({ title, text }) => (
            <section key={title}>
              <h2 className="text-h2-sm">{title}</h2>
              <p className="mt-4 max-w-[590px]">{text}</p>
            </section>
          ))}
        </div>
        {children}
      </div>
    </main>
  )
}
