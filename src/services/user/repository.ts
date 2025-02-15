import { IDBPDatabase, KeyVal, openDatabase, Schema } from '../idb';
import { IRepository, IAdapter } from './ports';
import { IUpdate, IUser } from './types';
import { z, ZodError } from 'zod';

const userSchema = z.object({
    name: z.string().min(1),
    qr: z.string().min(1),
    email: z.string().email(),
    is_active: z.boolean()
});

type IUserSchema = z.infer<typeof userSchema>;

type ValidationResult =
    | { success: true; data: IUserSchema }
    | { success: false; error: ZodError };

class Repository implements IRepository {
    private dbPromise: Promise<IDBPDatabase<Schema>>;
    private keyval?: KeyVal
    private keys: (keyof IUser)[]

    private adapter: IAdapter

    constructor(adapter: IAdapter) {
        this.dbPromise = openDatabase();
        this.adapter = adapter;

        this.keys = ["name", "qr", "email", "is_active"];
    }

    private async ensureKeyVal(): Promise<void> {

        if (!this.keyval) {

            const db: IDBPDatabase<Schema> = await this.dbPromise;

            this.keyval = new KeyVal(db, "user");
        }
    }

    async fetchMe(token: string, signal?: AbortSignal): Promise<IUser> {

        const payload: IUser = await this.adapter.me(token, signal)

        await this.save(payload);

        return payload
    }

    async fetchUpdate(data: IUpdate, token: string, signal?: AbortSignal): Promise<IUser> {

        const payload: IUser = await this.adapter.update(data, token, signal)

        await this.save(payload);

        return payload
    }
    async fetchChangeQR(token: string, signal?: AbortSignal): Promise<string> {

        const payload: string = await this.adapter.qr(token, signal)

        await this.ensureKeyVal()

        await this.keyval!.setKey("qr", payload);

        return payload
    }

    async save(payload: IUser): Promise<void> {

        await this.ensureKeyVal()

        await this.keyval!.save<IUser>(payload)
    }

    async load(): Promise<IUser | null> {

        await this.ensureKeyVal()

        const values = await Promise.all(this.keys.map(key => this.keyval!.getKey(key)));

        const instance: IUser = {
            name: values[0] as string,
            qr: values[1] as string,
            email: values[2] as string,
            is_active: values[3] as boolean
        };

        const validationResult: ValidationResult = userSchema.safeParse(instance);

        if (!validationResult.success) {

            console.error("Validation failed:", validationResult.error.format());

            return null;
        }

        return validationResult.data;
    }

    async clear(): Promise<void> {

        await this.ensureKeyVal()

        await Promise.all(this.keys.map(key => this.keyval!.deleteKey(key)));
    }
}

export default Repository