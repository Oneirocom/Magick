export declare class singleton {
    static instance: speechUtils;
    static getInstance(): speechUtils;
}
declare class speechUtils {
    bufferSize: number;
    AudioContext: any;
    context: any;
    processor: any;
    input: any;
    globalStream: any;
    finalWord: boolean;
    removeLastSentence: boolean;
    streamStreaming: boolean;
    constraints: {
        audio: boolean;
        video: boolean;
    };
    socket: import("socket.io-client").Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
    constructor();
    initRecording: (newMessageCallback: Function) => void;
    microphoneProcess: (e: any) => void;
    stopRecording: () => void;
    downsampleBuffer: (buffer: any, sampleRate: any, outSampleRate: any) => any;
}
export default singleton;
