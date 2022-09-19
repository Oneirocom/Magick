import { Socket } from 'sharedb/lib/sharedb';
interface SharedbContext {
    socket: Socket | null;
}
export declare const useWebSocket: () => SharedbContext;
export declare const docMap: Map<any, any>;
declare const ConditionalProvider: (props: any) => any;
export default ConditionalProvider;
