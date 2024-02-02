import { type Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard',
    alternates: {
        canonical: 'https://www.raindate.net/dashboard'
    }
}

export default function DashboardLayout ({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return <section>{children}</section>
}
