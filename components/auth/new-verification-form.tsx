"use client"

import { CardWrapper } from "@/components/auth/card-wrapper"
import { BeatLoader } from "react-spinners"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { newVerification } from "@/actions/new-verification"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const searchParams = useSearchParams()

    /** Gets the token query from the url */
    const token = searchParams.get("token")

    /** cache the function using useCallback */
    const onSubmit = useCallback(() => {
        /** React renders twice so it will throw an error because we removed the token
         *   This is a work around to fix it.
         */
        if (success || error) return

        /** If there is no token in the url, set the error message  */
        if (!token) {
            setError("Missing token!")
            return
        }

        /** If there is a token, verify that the token exist */
        newVerification(token)
            .then((data) => {
                setSuccess(data.success)
                setError(data.error)
            })
            .catch(() => {
                setError("Something went wrong!")
            })
    }, [token, success, error])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <CardWrapper
            headerLabel="Confirming your verification form."
            backButtonHref="/auth/login"
            backButtonLabel="Back to login">
            <div className="flex items-center w-full justify-center">
                {!success && !error && <BeatLoader />}
                <FormSuccess message={success} />
                {/** Only show the error message when its not successful  */}
                {!success && <FormError message={error} />}
            </div>
        </CardWrapper>
    )
}
