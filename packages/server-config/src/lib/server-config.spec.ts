import { serverConfig } from './server-config';

describe('serverConfig', () => {
    it('should work', () => {
        expect(serverConfig()).toEqual('server-config');
    })
})