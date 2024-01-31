import React, { type ReactElement } from 'react'
import Head from 'next/head'
import { UserProvider } from '@/contexts/UserContext'
import '@/styles/globals.scss'

interface RootLayoutProps {
    readonly children: React.ReactNode
}

export default function RootLayout ({
    children
}: RootLayoutProps): ReactElement {
    return (
        <>
            <Head>
                <title>RainDate</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta charSet="utf-8" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="canonical" href="https://www.raindate.net" />
                <meta
                    name="description"
                    content="Let RainDate discover the perfect time for your plans. From one-on-one dates to large group gatherings, the perfect day is just one click away."
                />
                <meta
                    name="keywords"
                    content="event, planning, calendar, events, dashboard, availability, group scheduler, friends, holiday, vacation, plans, rally, RainDate, reindate, schedule, social gatherings, time, date, ocean, rain"
                />
            </Head>
            <UserProvider>
                {children}
            </UserProvider>
        </>
    )
}
