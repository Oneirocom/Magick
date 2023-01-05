import { prisma } from './prisma';

describe('prisma', () => {
    it('should work', () => {
        expect(prisma()).toEqual('prisma');
    })
})