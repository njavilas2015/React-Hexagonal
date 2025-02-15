import { DBSchema, IDBPDatabase, openDB } from "idb";
import { IUser } from "./user/types";

const dbName: string = 'demo';

const dbVersion: number = 1;

export type { IDBPDatabase }

export interface Database {
    auth: {},
    user: {
        key: string
        value: IUser
    }
}

export type Schema = { [K in keyof Database]: Database[K]; } & DBSchema;

export async function openDatabase(): Promise<IDBPDatabase<Schema>> {

    const db: IDBPDatabase<Schema> = await openDB<Schema>(dbName, dbVersion, {

        upgrade(db) {

            const tables_key: (keyof Database)[] = [
                'user'
            ];

            for (const x of tables_key) {

                if (!db.objectStoreNames.contains(x)) {
                    db.createObjectStore(x);
                }

            }


            const tables: (keyof Database)[] = [

            ];

            for (const x of tables) {

                if (!db.objectStoreNames.contains(x)) {

                    db.createObjectStore(x, { keyPath: 'id' });
                }
            }
        },
    });

    return db;
};

export async function setItemInDB<T>(name: keyof Database, data: T[]): Promise<void> {

    const db: IDBPDatabase<Schema> = await openDatabase();

    const tx = db.transaction(name, 'readwrite');

    const store = tx.objectStore(name);

    data.forEach((value) => store.put(value));

    await tx.done;
}

export async function getItemFromDB<T>(name: keyof Database): Promise<T[]> {

    const db: IDBPDatabase<Schema> = await openDatabase();

    const tx = db.transaction(name, 'readonly');

    const store = tx.objectStore(name);

    const data = await store.getAll();

    await tx.done;

    return data as T[]
}

export class KeyVal {
    private db: IDBPDatabase<Schema>
    private table: keyof Database

    constructor(db: IDBPDatabase<Schema>, table: keyof Database) {
        this.db = db
        this.table = table
    }

    async save<T extends {}>(value: T) {

        for (const x of Object.keys(value)) {

            await this.setKey(x, value[x as keyof T]);
        }
    }

    async setKey<T>(key: string, value: T): Promise<void> {

        const tx = this.db.transaction(this.table, 'readwrite');

        const store = tx.objectStore(this.table);

        await store.put(value, key);

        await tx.done;
    }

    async getKey<T>(key: string): Promise<T> {

        return await this.db.get(this.table, key) as T
    }

    async deleteKey(key: string): Promise<void> {

        const tx = this.db.transaction(this.table, 'readwrite');

        const store = tx.objectStore(this.table);

        await store.delete(key);

        await tx.done;
    }

}