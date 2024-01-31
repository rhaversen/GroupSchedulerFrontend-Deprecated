import Link from 'next/link'

const LinkText = ({ href, buttonText }:
{ href: string, buttonText: string }) => (
    <p className="text-center text-middle m-2.5 flex justify-around w-full">
        <Link href={href}>
            <button type="button" className="text-white cursor-pointer transition-color duration-300 hover:underline">
                {buttonText}
            </button>
        </Link>
    </p>
)

export default LinkText
