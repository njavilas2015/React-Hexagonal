import { IAdapter } from "./ports";
import { IUser, IUpdate } from "./types";

class Adapter implements IAdapter {

    async me(token: string, signal?: AbortSignal): Promise<IUser> {

        const response = await fetch("/api/users/me", {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": token },
            signal,
        });

        if (!response.ok) {

            throw new Error(`Failed to sign in: ${response.status}`);
        }

        return await response.json();
    }

    async update(data: IUpdate, token: string, signal?: AbortSignal): Promise<IUser> {

        const response = await fetch("/api/users", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": token },
            body: JSON.stringify(data),
            signal,
        });

        if (!response.ok) {

            throw new Error(`Failed to sign in: ${response.status}`);
        }

        return await response.json();
    }

    async qr(token: string, signal?: AbortSignal): Promise<string> {

        const response = await fetch("/api/users/qr", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": token },
            signal,
        });

        if (!response.ok) {

            throw new Error(`Failed to sign in: ${response.status}`);
        }

        return await response.text();
    }
}

export default Adapter