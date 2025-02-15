import { IUpdate, IUser, IState } from './types';

import Repository from './repository';
import Adapter from './adapter'

import { create } from 'zustand';

const repository: Repository = new Repository(new Adapter())

const useStore = create<IState>((set) => ({
    profile: undefined,
    isLoading: false,

    error: undefined,
    isError: false,

    isFetchingMe: false,
    isUpdatingProfile: false,
    isChangingQR: false,

    fetchMe: async (token: string, signal?: AbortSignal): Promise<void> => {

        set({ isFetchingMe: true, isError: false, error: undefined });

        try {
            const payload: IUser = await repository.fetchMe(token, signal);

            set({ profile: payload });

        } catch (err: any) {

            console.error(err);

            set({ error: err.message, isError: true });

        } finally {
            set({ isFetchingMe: false });
        }
    },
    fetchUpdate: async (data: IUpdate, token: string, signal?: AbortSignal): Promise<void> => {

        set({ isUpdatingProfile: true, error: undefined, isError: false });

        try {

            const payload: IUser = await repository.fetchUpdate(data, token, signal);

            await repository.save(payload);

            set({ profile: payload });

        } catch (err: any) {

            console.error(err);

            set({ error: err.message, isError: true });

        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    fetchChangeQR: async (token: string, signal?: AbortSignal): Promise<void> => {

        set({ isChangingQR: true, error: undefined, isError: false });

        try {

            const payload: string = await repository.fetchChangeQR(token, signal);

            set((prev) => {

                if (prev.profile === undefined) {
                    /***
                     * Notify error
                     */
                    return {}
                }

                return { profile: { ...prev.profile!, qr: payload } }
            });

        } catch (err: any) {

            console.error(err);

            set({ error: err.message, isError: true });

        } finally {
            set({ isChangingQR: false });
        }
    },
    load: async () => {

        set({ isLoading: true });

        try {

            const payload = await repository.load();

            set({ profile: payload ?? undefined });

        } catch (err: any) {

            console.error(err);

            set({ error: err.message, isError: true });

        } finally {
            set({ isLoading: false });
        }
    },
    logout: async (): Promise<void> => {
        try {

            await repository.clear();

            set({ profile: undefined });

        } catch (err: any) {

            console.error(err);

            set({ error: err.message, isError: true });
        }
    },
}));

export default useStore