//@ts-nocheck

export class UploadService {
    blobService: any
    image_store: Array<Object>
    constructor(){
        this.image_store = new Array<Object>();
    }
    async create(body, params){
        let img_body = {
            "id": body["id"],
            "uri":body["uri"]
        }
        let idx = this.image_store.map(e => e.id).indexOf(body["id"]);
        console.log(body["id"])
        idx === -1 ? this.image_store.push(img_body) : this.image_store[idx] = img_body;
        this.image_store.push(img_body)
        return img_body
    }

    async find(id, params){
     let img_found = this.image_store.find((Element)=>{
        return Element["id"] === id["query"]["id"]
      })
      console.log(id["query"]["id"])
      typeof(img_found) == "undefined" ? img_found = "Image Not Found" : console.log("Image Found !!")
      return img_found
    }
    async remove(id, params){
        return this.blobService.remove(id, params)
    }
}