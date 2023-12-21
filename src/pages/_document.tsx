import Document, { type DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

class MyDocument extends Document {
    static async getInitialProps (ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render () {
        return (
            <Html lang="en">
                <Head>
                    <link
                        rel="preload"
                        href="https://fonts.googleapis.com/css2?family=Caveat&display=swap"
                        as="style"
                    />
                    <link
                        rel="preload"
                        href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap"
                        as="style"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Caveat&display=swap"
                        rel="stylesheet"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </Html>
        )
    }
}

export default MyDocument
