import styles from '@/styles/userInput.module.scss'

const MessageDisplay = ({ message }: { message: string }) => (
    <div>
        <p className={styles.message}>{message}</p>
    </div>
)

export default MessageDisplay
