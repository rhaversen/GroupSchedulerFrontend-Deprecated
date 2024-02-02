import { type Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Log In',
    alternates: {
        canonical: 'https://www.raindate.net/login'
    }
}

export default function LoginLayout ({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return <section>{children}</section>
}
