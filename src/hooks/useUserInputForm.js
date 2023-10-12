import { useEffect, useState } from 'react'

const useUserInputForm = (initialValues, validations) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState({})
  const [formIsValid, setFormIsValid] = useState(false)
  const [isTouched, setIsTouched] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setIsTouched(prev => ({ ...prev, [name]: true }))
    setValues(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const validationErrors = { ...errors }
    const inputIsValid = { ...isValid }

    for (const key in validations) {
      if (values[key] !== undefined && isTouched[key]) {
        const validationResult = validations[key].validate(values[key], values.password)
        if (validationResult === true) {
          inputIsValid[key] = true
          validationErrors[key] = ''
        } else {
          inputIsValid[key] = false
          validationErrors[key] = validationResult
        }
      }
    }

    setIsValid(inputIsValid)
    setErrors(validationErrors)

    const allFieldsValid = Object.keys(validations).every(key => {
      return inputIsValid[key]
    })

    setFormIsValid(allFieldsValid)
  }, [values])

  return {
    values,
    errors,
    isValid,
    formIsValid,
    isTouched,
    handleChange
  }
}

export default useUserInputForm
