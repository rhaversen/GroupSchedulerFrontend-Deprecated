import { type Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calendar',
    alternates: {
        canonical: 'https://www.raindate.net/calendar'
    }
}

export default function CalendarLayout ({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return <section>{children}</section>
}
