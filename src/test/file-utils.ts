import {readFileSync, writeFileSync} from "fs";


const encodingOpts = { encoding: "utf8" };

export function readJson(path: string) {
    return JSON.parse(readFileSync(path, encodingOpts));
}

export function writeJson(path: string, json: any) {
    writeFileSync(path, JSON.stringify(json, null, 2), encodingOpts);
}

