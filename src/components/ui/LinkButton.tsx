import Link from 'next/link';

const LinkButton = ({ href, buttonText, symbol }: { href: string, buttonText: string, symbol?: React.JSX.Element }) => (
    <p>
        <Link href={href}>
            <button className="bg-blue-500 text-white flex items-center justify-center px-4 py-2 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50">
                <symbol/>{buttonText}
            </button>
        </Link>
    </p>
);

export default LinkButton;
