import React, { type ReactElement } from 'react'

export default function RootLayout ({
    children
}: {
    children: React.ReactNode
}): ReactElement {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico"/>
            </head>

            <body>{children}</body>
        </html>
    )
}
