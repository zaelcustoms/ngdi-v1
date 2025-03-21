"use client";

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type {
  NGDIMetadataFormData,
  Form1Data,
  Form2Data,
  Form3Data,
} from "@/types/ngdi-metadata"

// Import the components from the barrel file
import {
  GeneralInfoForm,
  DataQualityForm,
  DistributionInfoForm,
  Steps,
} from "./index"
import { createMetadata, updateMetadata } from "@/app/actions/metadata"
import { InfoIcon } from "lucide-react"

interface MetadataFormProps {
  initialData?: NGDIMetadataFormData
  metadataId?: string
}

export function MetadataForm({ initialData, metadataId }: MetadataFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<NGDIMetadataFormData>>(
    initialData || {}
  )
  const router = useRouter()
  const totalSteps = 3
  const isEditing = !!metadataId

  const handleNext = (stepData: Form1Data | Form2Data) => {
    if (currentStep === 1) {
      setFormData((prev) => ({ ...prev, form1: stepData as Form1Data }))
    } else if (currentStep === 2) {
      setFormData((prev) => ({ ...prev, form2: stepData as Form2Data }))
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSave = async (data: Form3Data) => {
    try {
      setIsSubmitting(true)
      const finalFormData = {
        ...formData,
        form3: data,
      } as NGDIMetadataFormData

      let result

      if (isEditing && metadataId) {
        // Update existing metadata
        result = await updateMetadata(metadataId, finalFormData)
      } else {
        // Create new metadata
        result = await createMetadata(finalFormData)
      }

      if (result.success) {
        toast.success(
          `Metadata ${isEditing ? "updated" : "saved"} successfully`
        )
        router.push("/search/metadata")
      } else {
        if (result.details) {
          result.details.forEach((error: any) => {
            toast.error(`${error.path.join(".")}: ${error.message}`)
          })
        } else {
          toast.error(
            result.error ||
              `Failed to ${isEditing ? "update" : "save"} metadata`
          )
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error(
        `Error ${isEditing ? "updating" : "saving"} metadata:`,
        error
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full py-12 md:py-16">
      <div className="container max-w-5xl px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {isEditing ? "Edit" : "Add"} NGDI Metadata
            </h1>
            <p className="text-muted-foreground">
              {isEditing
                ? "Update the metadata record in the NGDI platform."
                : "Complete the form to add a new metadata record to the NGDI platform."}
            </p>
          </div>

          <Steps currentStep={currentStep} totalSteps={totalSteps} />

          <Card className="overflow-hidden border-border/40 shadow-sm">
            <CardHeader className="bg-muted/20 px-6 py-4">
              <CardTitle className="text-xl">
                {currentStep === 1 && "General Information"}
                {currentStep === 2 && "Data Quality & Processing"}
                {currentStep === 3 && "Distribution Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-6">
              {currentStep === 1 && (
                <GeneralInfoForm
                  onNext={handleNext}
                  initialData={formData.form1}
                />
              )}
              {currentStep === 2 && (
                <DataQualityForm
                  onNext={handleNext}
                  onBack={handlePrevious}
                  initialData={formData.form2}
                />
              )}
              {currentStep === 3 && (
                <DistributionInfoForm
                  onBack={handlePrevious}
                  onSave={handleSave}
                  isSubmitting={isSubmitting}
                  initialData={formData.form3}
                />
              )}
            </CardContent>
            <CardFooter className="border-t bg-muted/10 px-6 py-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <InfoIcon className="mr-2 h-4 w-4" />
                <p>
                  You can progress through the form with partial data, but final
                  validation will occur when saving the complete metadata
                  record.
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 