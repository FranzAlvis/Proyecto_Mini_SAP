import { ref, computed } from 'vue'

export function useValidation() {
  const errors = ref({})
  const isValidating = ref(false)

  // Validation rules
  const rules = {
    required: (value, fieldName = 'Campo') => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return `${fieldName} es requerido`
      }
      return null
    },

    minLength: (min) => (value, fieldName = 'Campo') => {
      if (value && value.length < min) {
        return `${fieldName} debe tener al menos ${min} caracteres`
      }
      return null
    },

    maxLength: (max) => (value, fieldName = 'Campo') => {
      if (value && value.length > max) {
        return `${fieldName} no puede tener más de ${max} caracteres`
      }
      return null
    },

    email: (value, fieldName = 'Email') => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        return `${fieldName} debe ser un email válido`
      }
      return null
    },

    numeric: (value, fieldName = 'Campo') => {
      if (value && isNaN(Number(value))) {
        return `${fieldName} debe ser un número válido`
      }
      return null
    },

    positiveNumber: (value, fieldName = 'Campo') => {
      if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
        return `${fieldName} debe ser un número positivo`
      }
      return null
    },

    min: (minValue) => (value, fieldName = 'Campo') => {
      if (value && Number(value) < minValue) {
        return `${fieldName} debe ser mayor o igual a ${minValue}`
      }
      return null
    },

    max: (maxValue) => (value, fieldName = 'Campo') => {
      if (value && Number(value) > maxValue) {
        return `${fieldName} debe ser menor o igual a ${maxValue}`
      }
      return null
    },

    username: (value, fieldName = 'Nombre de usuario') => {
      const usernameRegex = /^[a-zA-Z0-9._-]+$/
      if (value && !usernameRegex.test(value)) {
        return `${fieldName} solo puede contener letras, números, puntos, guiones y guiones bajos`
      }
      return null
    },

    password: (value, fieldName = 'Contraseña') => {
      if (value && value.length < 8) {
        return `${fieldName} debe tener al menos 8 caracteres`
      }
      if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return `${fieldName} debe contener al menos una mayúscula, una minúscula y un número`
      }
      return null
    },

    date: (value, fieldName = 'Fecha') => {
      if (value && isNaN(Date.parse(value))) {
        return `${fieldName} debe ser una fecha válida`
      }
      return null
    },

    futureDate: (value, fieldName = 'Fecha') => {
      if (value && new Date(value) <= new Date()) {
        return `${fieldName} debe ser una fecha futura`
      }
      return null
    }
  }

  // Validate a single field
  const validateField = (fieldName, value, fieldRules, customFieldName) => {
    const fieldErrors = []
    const displayName = customFieldName || fieldName

    for (const rule of fieldRules) {
      const error = rule(value, displayName)
      if (error) {
        fieldErrors.push(error)
      }
    }

    if (fieldErrors.length > 0) {
      errors.value[fieldName] = fieldErrors[0] // Show only first error
    } else {
      delete errors.value[fieldName]
    }

    return fieldErrors.length === 0
  }

  // Validate multiple fields
  const validate = (data, validationRules) => {
    isValidating.value = true
    errors.value = {}

    let isValid = true

    for (const [fieldName, fieldRules] of Object.entries(validationRules)) {
      const value = data[fieldName]
      const fieldValid = validateField(fieldName, value, fieldRules.rules, fieldRules.name)
      if (!fieldValid) {
        isValid = false
      }
    }

    isValidating.value = false
    return isValid
  }

  // Clear all errors
  const clearErrors = () => {
    errors.value = {}
  }

  // Clear specific field error
  const clearFieldError = (fieldName) => {
    delete errors.value[fieldName]
  }

  // Check if form has errors
  const hasErrors = computed(() => Object.keys(errors.value).length > 0)

  // Get error for specific field
  const getFieldError = (fieldName) => errors.value[fieldName]

  // Check if specific field has error
  const hasFieldError = (fieldName) => !!errors.value[fieldName]

  return {
    errors,
    isValidating,
    hasErrors,
    rules,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasFieldError
  }
}
