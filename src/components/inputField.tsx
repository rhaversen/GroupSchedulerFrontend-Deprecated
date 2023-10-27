import React, { type ReactElement, type ChangeEvent, type FC } from 'react'
import styles from './InputField.module.scss'

interface Props {
    type: string
    name: string
    label: string
    autoComplete: string
    value: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    errorMessage: string | null
    fieldIsValid: boolean
}
interface inputFieldCssProperties extends React.CSSProperties {
    '--input-border-color'?: string
    '--input-focus-border-color'?: string
}

const InputField: FC<Props> = ({
    type,
    name,
    label,
    autoComplete,
    value,
    onChange,
    errorMessage,
    fieldIsValid
}): ReactElement => {
    const inputStyle: inputFieldCssProperties = {
        '--input-border-color': !fieldIsValid ? 'red' : undefined,
        '--input-focus-border-color': !fieldIsValid ? 'brightred' : undefined
    }
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
                    style={inputStyle}
                />
                {(errorMessage !== null && errorMessage !== '') && (
                    <span className={styles.error}>
                        {errorMessage}
                    </span>
                )}
            </div>
        </div>
    )
}

export default InputField
