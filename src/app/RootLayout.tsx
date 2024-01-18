import React, { type ReactElement } from 'react';

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>): ReactElement {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                
                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />

                <title>Rain Date</title>
                <link rel="canonical" href="https://www.raindate.net" />
                <meta
                    name="description"
                    content="Raindate is a one-stop shop for all your event planning needs. With our app, you can view all your upcoming events, create and manage calendars, and see when other users are available. Plus, our event pages let you see more info about events, such as descriptions, dates, and locations."
                />
                <meta
                    name="keywords"
                    content="event planning, calendar, events, dashboard, availability, group scheduler, friends, holiday, vacation, plans, rally, reindate"
                />
                {/* Additional tags like stylesheets or scripts can be added here */}
            </head>
            <body>{children}</body>
        </html>
    );
}
