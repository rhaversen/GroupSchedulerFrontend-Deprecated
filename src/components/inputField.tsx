import React, { type ReactElement, type ChangeEvent, type FC } from 'react'
import styles from './InputField.module.scss'

interface Props {
    type: string
    name: string
    label: string
    autoComplete: string
    value: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    errorMessage?: string
    color?: string
}

const InputField: FC<Props> = ({
    type,
    name,
    label,
    autoComplete,
    value,
    onChange,
    errorMessage,
    color
}): ReactElement => {
    return (
        <div className={styles.labelContainer}>
            <label className={styles.label}>{label}</label>
            <div className={styles.inputContainer}>
                <input
                    className={styles.input}
                    type={type}
                    name={name}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                />
                <div className={styles.errorContainer}>
                    {(errorMessage !== null && errorMessage !== '') && (
                        <span className={styles.error} style={{ color }}>
                            {errorMessage}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default InputField
