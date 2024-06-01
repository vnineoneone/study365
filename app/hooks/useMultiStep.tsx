import { ReactElement, useState } from "react"

export function useMultistepForm(steps: ReactElement[], currentStepIndex: number, setCurrentStepIndex: any) {
    function next() {
        setCurrentStepIndex((i: number) => {
            if (i >= steps.length - 1) return i
            return i + 1
        })
    }

    function back() {
        setCurrentStepIndex((i: number) => {
            if (i <= 0) return i
            return i - 1
        })
    }

    function goTo(index: number) {
        setCurrentStepIndex(index)
    }

    return {
        step: steps[currentStepIndex],
        steps,
        isFirstStep: currentStepIndex === 0,
        isLastStep: currentStepIndex === steps.length - 1,
        goTo,
        next,
        back,
    }
}