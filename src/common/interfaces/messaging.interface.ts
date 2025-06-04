export interface Messaging { send(message: string, options: object): Promise<void>; }
