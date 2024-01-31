import Link from 'next/link'

const LinkText = ({ href, buttonText, prefixText }:
{ href: string, buttonText: string, prefixText?: string | null }) => (
    <p className="text-center text-base mt-2.5">
        {prefixText ?? ''}{' '}
        <Link href={href}>
            <button type="button" className="text-Highlights cursor-pointer underline transition-color duration-300 hover:text-Highlights-hover">
                {buttonText}
            </button>
        </Link>
    </p>
)

export default LinkText
