// DOCUMENTED
/**
 * Service for handling image uploads
 * @class
 */
export class UploadService {
  /**
   * Blob service to be injected when uploading to cloud storage
   */
  blobService: any

  /**
   * Array to store image metadata
   */
  image_store: Array<any>

  /**
   * @constructor
   * Initializes the image store as an empty array
   */
  constructor() {
    this.image_store = []
  }

  /**
   * Creates a new entry in the image store or updates an existing one if the id already exists
   * @param body - The request body
   * @param params - The request parameters
   * @returns The metadata of the newly created or updated image
   */
  async create(body: any): Promise<any> {
    const img_body = {
      id: body['id'],
      uri: body['uri'],
    }
    const idx = this.image_store.map(e => e.id).indexOf(body['id'])

    idx === -1
      ? this.image_store.push(img_body)
      : (this.image_store[idx] = img_body)
    this.image_store.push(img_body) // This line seems unnecessary since we added the img_body to the array in the previous line
    return img_body
  }

  /**
   * Finds an image in the store by its id
   * @param id - The id of the image to search for
   * @param params - The request parameters
   * @returns The metadata of the image if found, otherwise a string "Image Not Found"
   */
  async find(id: any): Promise<any> {
    let img_found = this.image_store.find(element => {
      return element.id === id.query.id
    })

    typeof img_found == 'undefined'
      ? (img_found = 'Image Not Found')
      : console.log('Image Found !!')
    return img_found
  }

  /**
   * Removes an image from the store using its id
   * @param id - The id of the image to remove
   * @param params - The request parameters
   * @returns The result of the removal operation handled by the blob service
   */
  async remove(id: any, params: any): Promise<any> {
    return this.blobService.remove(id, params)
  }
}
