export interface IUser {
    name: string
    qr: string
    email: string
    is_active: boolean
}

export interface IUpdate {
    name: string
}

export interface IState {
    profile?: IUser
    isLoading: boolean

    error?: string
    isError: boolean

    isFetchingMe: boolean;
    isUpdatingProfile: boolean;
    isChangingQR: boolean;

    fetchMe: (token: string, signal?: AbortSignal) => Promise<void>;
    fetchUpdate: (data: IUpdate, token: string, signal?: AbortSignal) => Promise<void>;
    fetchChangeQR: (token: string, signal?: AbortSignal) => Promise<void>;
    load: () => void;
    logout: () => void;
}
