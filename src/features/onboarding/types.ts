export interface FormData {
  goals: string[]
  background: string
  learningStyle: string
  topics: string[]
}

export interface StepProps {
  onNext: () => void
  onBack: () => void
  formData: FormData
  updateFormData: (key: keyof FormData, value: string | string[]) => void
}
