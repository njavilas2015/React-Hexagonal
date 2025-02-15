import { IUpdate, IUser } from "./types";

export interface IRepository {
    save(payload: IUser): Promise<void>
    load(): Promise<IUser | null>
    clear(): Promise<void>

    fetchMe(token: string, signal?: AbortSignal): Promise<IUser>
    fetchUpdate(data: IUpdate, token: string, signal?: AbortSignal): Promise<IUser>
    fetchChangeQR(token: string, signal?: AbortSignal): Promise<string>
}

export interface IAdapter {
    me(token: string, signal?: AbortSignal): Promise<IUser>
    update(data: IUpdate, token: string, signal?: AbortSignal): Promise<IUser>
    qr(token: string, signal?: AbortSignal): Promise<string>
}