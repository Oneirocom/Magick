import type { FromSchema } from '@feathersjs/schema'

abstract class Service {
    async find(): Promise<void> {};
    async get(): Promise<void> {};
    async create(): Promise<void> {};
    async update(): Promise<void> {};
    async patch(): Promise<void> {};
    async remove(): Promise<void> {};
}





export class Service_Plugin<Service> extends Service{
    protected arr_store: any[];
    
    constructor(
        params
      ){
        super()
        const {create, find, get, update, patch, remove} = params
        this.create = create
        if(find !== null)this.find = find
        if(get !== null) this.get = get
        if(update !== null)this.update = update
        if(patch !== null)this.patch = patch
        if(remove !== null)this.remove = remove
        this.arr_store = []
    }

    alter_store(value: any){
        this.arr_store = value
    }
}
