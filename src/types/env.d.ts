declare module "@env" {
    export const API_BASE: string;
    export const UNSPLASH_ACCESSKEY: string;
    export const UNSPLASH_SECRETKEY: string;
    export const ENV: "dev" | "prod";
}

declare module "react-native-dotenv" {
    export const UNSPLASH_ACCESSKEY: string;
    export const UNSPLASH_SECRETKEY: string;
    export const ENV: "dev" | "prod";
}
