export type StartPostResponse = {
    success: boolean,
    id: number,
}

export type SessionGetResponse = {
    id: number,
    target: number,
    board: string,
    colors: string,
}

export type SessionPutRequest = {
    board: string
}

export type SessionPutResponse = {
    success: boolean,
    id: number,
    message: string,
    board: string,
    colors: string
}

export type GuessBounds = {
    start: number,
    end: number,
}