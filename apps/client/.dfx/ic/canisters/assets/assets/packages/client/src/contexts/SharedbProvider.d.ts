import { Doc } from 'sharedb';
import client from 'sharedb/lib/client';
import { Spell } from '@thothai/thoth-core/types';
interface SharedbContext {
    connection: client.Connection | null;
    getSpellDoc: (spell: Spell) => Doc | null;
}
export declare const useSharedb: () => SharedbContext;
export declare const docMap: Map<any, any>;
declare const ConditionalProvider: (props: any) => any;
export default ConditionalProvider;
