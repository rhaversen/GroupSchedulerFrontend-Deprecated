import { useEffect, useState } from 'react'

interface Validation {
    isValid: (values: Record<string, string | boolean>) => boolean
    errors: (values: Record<string, string | boolean>) => string | null
}

  type Validations = Record<string, Validation>

interface UseUserInputFormReturnType {
    values: Record<string, string | boolean>
    errors: Record<string, string | null>
    fieldIsValid: Record<string, boolean>
    formIsValid: boolean
    isTouched: Record<string, boolean>
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const useUserInputForm = (
    initialValues: Record<string, string | boolean>,
    validations: Validations
): UseUserInputFormReturnType => {
    const initialFieldState = Object.fromEntries(
        Object.keys(initialValues).map((name) => [name, false])
    )
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState<Record<string, string | null>>({})
    const [formIsValid, setFormIsValid] = useState(false)
    const [fieldIsValid, setFieldIsValid] = useState(initialFieldState)
    const [isTouched, setIsTouched] = useState(initialFieldState)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, type } = e.target
        let value: string | boolean
        if (type === 'checkbox') {
            value = e.target.checked
        } else {
            value = e.target.value
        }
        setIsTouched((prev) => ({ ...prev, [name]: true }))
        setValues((prev) => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        const validationErrors: Record<string, string | null> = {}
        const validFields: Record<string, boolean> = {}

        for (const key in values) {
            const validation = validations[key]
            validFields[key] = validation.isValid(values)
            validationErrors[key] = validation.errors(values)
        }

        setFieldIsValid(validFields)
        setErrors(validationErrors)
        setFormIsValid(Object.values(validFields).every(Boolean))
    }, [values, isTouched, validations])

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
