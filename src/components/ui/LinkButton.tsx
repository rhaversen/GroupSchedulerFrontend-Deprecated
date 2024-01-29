import Link from 'next/link'
import styles from '@/styles/userInput.module.scss'

const LinkButton = ({ href, buttonText, prefixText }: { href: string, buttonText: string, prefixText?: string | null }) => (
    <p className={styles.redirectPrompt}>
        {prefixText ?? ''}{' '}
        <Link href={href}>
            <button className={styles.redirectLink}>{buttonText}</button>
        </Link>
    </p>
)

export default LinkButton
