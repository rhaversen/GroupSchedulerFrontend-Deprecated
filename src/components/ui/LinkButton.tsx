import Link from 'next/link';

const LinkButton = ({ href, buttonText, prefixText }: { href: string, buttonText: string, prefixText?: string | null }) => (
    <p className="text-center text-base mt-2.5">
        {prefixText ?? ''}{' '}
        <Link href={href}>
            <button className="text-blue-500 cursor-pointer underline transition-color duration-300 hover:text-blue-700">
                {buttonText}
            </button>
        </Link>
    </p>
);

export default LinkButton;
