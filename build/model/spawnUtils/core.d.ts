export interface SpawnOutput {
    out: string;
    err: string;
}
export declare function spawnSync(command: string, args: string[], working_dir: string): Promise<SpawnOutput>;
export declare function spawnHello(): Promise<SpawnOutput>;
