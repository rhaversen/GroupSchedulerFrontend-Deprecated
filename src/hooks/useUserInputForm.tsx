import type React from 'react'
import { useEffect, useState, type ChangeEvent } from 'react'

type Validations = Record<string, { validate: (value: string, password?: string) => boolean }>

interface UseUserInputFormReturn {
    values: Record<string, any>
    errors: Record<string, string>
    fieldIsValid: Record<string, boolean>
    formIsValid: boolean
    isTouched: Record<string, boolean>
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const useUserInputForm = (initialValues: Record<string, string | boolean>, validations: Validations): UseUserInputFormReturn => {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})
    const [fieldIsValid, setFieldIsValid] = useState<Record<string, boolean>>({})
    const [formIsValid, setFormIsValid] = useState(false)
    const [isTouched, setIsTouched] = useState<Record<string, boolean>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, type } = e.target
        const value = type === 'checkbox' ? e.target.checked : e.target.value
        setIsTouched((prev) => ({ ...prev, [name]: true }))
        setValues((prev) => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        const validationErrors: Record<string, string | false | JSX.Element> = { ...errors }
        const inputIsValid = { ...fieldIsValid }

        for (const key in validations) {
            if (values[key] !== undefined && isTouched[key]) {
                const isValidInput = validations[key].validate(
                    values[key],
                    values.password
                )

                if (isValidInput) {
                    inputIsValid[key] = true
                    validationErrors[key] = ''
                } else {
                    inputIsValid[key] = false
                    validationErrors[key] = isValidInput
                }
            }
        }

        setFieldIsValid(inputIsValid)
        setErrors(validationErrors)

        const allFieldsValid = Object.keys(validations).every((key) => {
            return inputIsValid[key]
        })

        setFormIsValid(allFieldsValid)
    }, [values, validations, errors, fieldIsValid, isTouched])

    return {
        values,
        errors,
        fieldIsValid,
        formIsValid,
        isTouched,
        handleChange
    }
}

export default useUserInputForm
