// components/chairman/multilingual-field.tsx
"use client"

import { Control, useController, FieldError } from "react-hook-form"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Language } from "@/types/chairman"

interface MultilingualFieldProps {
  control: Control<any>
  name: string
  label: string
  type?: "input" | "textarea"
  placeholder?: string
  required?: boolean
}

export const MultilingualField = ({
  control,
  name,
  label,
  type = "input",
  placeholder = "",
  required = false,
}: MultilingualFieldProps) => {
  const { field, fieldState } = useController({
    control,
    name,
  })

  // We safely cast fieldState.error to a Record for multilingual structure
  const errors = fieldState.error as Record<Language, FieldError> | undefined

  const renderField = (lang: Language) => (
    <FormItem>
      <FormLabel>
        {label} ({lang.toUpperCase()}){required && " *"}
      </FormLabel>

      <FormControl>
        {type === "textarea" ? (
          <Textarea
            placeholder={`${placeholder} (${lang})`}
            value={field.value?.[lang] || ""}
            onChange={(e) => {
              const newValue = { ...field.value, [lang]: e.target.value }
              field.onChange(newValue)
            }}
            className="min-h-[100px]"
          />
        ) : (
          <Input
            placeholder={`${placeholder} (${lang})`}
            value={field.value?.[lang] || ""}
            onChange={(e) => {
              const newValue = { ...field.value, [lang]: e.target.value }
              field.onChange(newValue)
            }}
          />
        )}
      </FormControl>

      {/* Safely show error message if exists */}
      {errors?.[lang]?.message && (
        <FormMessage>{errors[lang].message}</FormMessage>
      )}
    </FormItem>
  )

  return (
    <div className="space-y-4">
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ta">Tamil</TabsTrigger>
          <TabsTrigger value="si">Sinhala</TabsTrigger>
        </TabsList>

        {(["en", "ta", "si"] as const).map((lang) => (
          <TabsContent key={lang} value={lang} className="space-y-4">
            {renderField(lang)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
