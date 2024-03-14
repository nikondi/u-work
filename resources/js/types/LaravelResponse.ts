export type ErrorResponse = {
    response?: {
        data?: {
            errors?: string[]
        } | string,
        message: string,
    },
}

export type Response<T = any> = {
    data?: T,
}
