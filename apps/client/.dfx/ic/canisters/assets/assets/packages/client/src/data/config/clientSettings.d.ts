declare const apiKeys: ({
    client: string;
    name: string;
    type: string;
    defaultValue: string;
} | {
    client: string;
    name: string;
    type: string;
    defaultValue: boolean;
})[];
export default apiKeys;
