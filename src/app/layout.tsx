import React, { type ReactElement } from 'react'
import { UserProvider } from '@/contexts/UserContext'
import '@/styles/globals.scss'
import { type Viewport, type Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        template: '%s | RainDate',
        default: 'RainDate' // a default is required when creating a template
    },
    description: 'Find the Time to Do Some Things',
    keywords: 'event, planning, calendar, events, dashboard, availability, group scheduler, friends, holiday, vacation, plans, rally, RainDate, reindate, schedule, social gatherings, time, date, ocean, rain',
    alternates: {
        canonical: 'https://www.raindate.net'
    },
    icons: {
        icon: '/favicon.ico'
    }
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
    // Also supported by less commonly used
    // interactiveWidget: 'resizes-visual',
}

interface RootLayoutProps {
    readonly children: React.ReactNode
}

export default function RootLayout ({
    children
}: RootLayoutProps): ReactElement {
    return (
        <html lang="en">
            <UserProvider>
                {children}
            </UserProvider>
        </html>
    )
}
