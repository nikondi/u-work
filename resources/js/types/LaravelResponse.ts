export type ErrorResponse = {
    response?: {
        data?: {
            errors?: string[]
        } | string,
        message: string,
    },
}

export type Response = {
    data?: any,
}
