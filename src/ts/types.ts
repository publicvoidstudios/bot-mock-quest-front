export type Message = {
    id: number,
    body: string,
    author_id: number,
    was_read: boolean
    status: TaskStatus
}

export type Task = {
    id: number,
    name: string,
    description: string,
    roles: Role[],
    ask_later: number[] | null,
    declined: number[] | null,
    assigned_to: number | null,
    author_id: number,
    created_at: string,
    timeout: number,
    status?: TaskStatus,
    message_id?: number
}

export type User = {
    id: number,
    username: string,
    role: Role,
    hashed_password: string,
    messages: Message[],
    tasks: Task[]
}

export type Role = 'frontend' | 'backend' | 'fullstack' | 'designer' | 'qa' | 'admin' | 'guest' | 'user';

export type TaskStatus = 'new' | 'again' | 'failed';