import { CreateEventArgs, GetEventArgs } from '@magickml/core'
import { prisma } from '@magickml/prisma'

export class database {
  static async createEvent({
    type,
    agent,
    speaker,
    sender,
    client,
    channel,
    text,
  }: CreateEventArgs) {
    return await prisma.events.create({
      data: {
        type,
        agent,
        speaker,
        sender,
        client,
        channel,
        text,
        date: new Date().toUTCString(),
      },
    })
  }

  static async getEvents({
    type,
    agent = 'system',
    speaker = 'none',
    client = 'default',
    channel = 'default',
    maxCount = 10,
    max_time_diff = -1,
  }: GetEventArgs) {
    if (!type) {
      throw new Error('Missing argument for type')
    }
    if (channel === "undefined") {
      channel = undefined
    } 

    // rewrite this function to use prisma
    const event = await prisma.events.findMany({
      where: {
        type,
        agent,
        speaker,
        client,
        channel,
      },
      take: maxCount,
      orderBy: {
        date: 'desc',
      },
    })

    if (max_time_diff > 0) {
      const now = new Date()
      const filtered = event.filter((e) => {
        const diff = now.getTime() - new Date(e.date).getTime()
        return diff < max_time_diff
      })
      return filtered
    }

    return event
  }

  static async getAllEvents() {
    const events = await prisma.events.findMany()
    return events
  }

  static async deleteEvent(id: number) {
    return await prisma.events.delete({
      where: {
        id,
      },
    })
  }

  static async updateEvent(id: number, data: { [key: string]: string }) {
    const event = await prisma.events.update({
      where: {
        id,
      },
      data,
    })
    return event
  }

  static async addWikipediaData(agent: any, data: any) {
    const event = await prisma.events.create({
      data: {
        type: 'agent_data',
        agent,
        speaker: 'wikipedia',
        sender: data,
        client: 'wikipedia',
        channel: 'wikipedia',
        text: data,
        date: new Date().toUTCString(),
      },
    })
    return event
  }

  static async getWikipediaData(agent: any) {
    const event = await prisma.events.findFirst({
      where: {
        type: 'agent_data',
        agent,
        client: 'wikipedia',
        channel: 'wikipedia',
        speaker: 'wikipedia',
      },
    })
    if (event) {
      return event.text
    }
    return ''
  }

  static async wikipediaDataExists(agent: any) {
    const event = await prisma.events.findFirst({
      where: {
        type: 'agent_data',
        agent,
        client: 'wikipedia',
        channel: 'wikipedia',
        speaker: 'wikipedia',
      },
    })
    if (event) {
      return event.text
    }
    return ''
  }

  static async getEntities() {
    return await prisma.entities.findMany()
  }

  static async getEntity(id: any) {
    const entity = await prisma.entities.findFirst({
      where: {
        id,
      },
    })
    return entity
  }

  static async entityExists(id: any) {
    const entity = await prisma.entities.findFirst({
      where: {
        id,
      },
    })
    return entity ? true : false
  }

  static async deleteEntity(id: any) {
    // if id is a string, convert to number
    if (typeof id === 'string') {
      id = parseInt(id)
    }
    const entity = await prisma.entities.delete({
      where: {
        id,
      },
    })
    return entity
  }

  static async getLastUpdatedInstances() {
    const entities = await prisma.entities.findMany()
    return entities.map((e) => {
      return {
        id: e.id,
        lastUpdated: e.updated_at ? e.updated_at : 0,
      }
    })
  }

  static async setEntityDirty(id: any, value: boolean) {
    const entity = await prisma.entities.update({
      where: {
        id,
      },
      data: {
        dirty: value,
      },
    })

    return entity
  }

  static async setEntityUpdated(id: any) {
    const entity = await prisma.entities.update({
      where: {
        id,
      },
      data: {
        updated_at: (new Date()).toString(),
      },
    })

    return entity
  }

  static async createEntity() {
    const entity = await prisma.entities.create({
      data: {
        dirty: true,
        enabled: false,
        data: "",
      },
    })
    return entity
  }

  static async updateEntity(id: any, data: { [x: string]: any; dirty?: any }) {

    // if data.data is json, convert to string
    if (typeof data.data === 'object') {
      data.data = JSON.stringify(data.data)
    }

    const entity = await prisma.entities.update({
      where: {
        id,
      },
      data,
    })
    return entity
  }

  static async addDocument(
    title: any,
    description: any,
    is_included: any,
    store_id: any
  ): Promise<number> {
  // rewrite in prisma
  const document = await prisma.documents.create({
    data: {
      title,
      description,
      is_included,
      store_id,
    },
  })
  return document.id
}

  static async removeDocument(documentId: number) {
    const document = await prisma.documents.delete({
      where: {
        id: documentId,
      },
    })
    return document
  }
  
  static async updateDocument(
    document_id: any,
    title: string,
    description: any,
    is_included: any,
    store_id: any
  ) {
    const document = await prisma.documents.update({
      where: {
        id: document_id,
      },
      data: {
        title,
        description,
        is_included,
        store_id,
      },
    })
    return document
  }

  static async getDocumentsOfStore(
    storeId: number
  ): Promise<any> {
    const documents = await prisma.documents.findMany({
      where: {
        store_id: storeId,
      },
    })
    return documents
  }

  static async getAllDocuments(): Promise<any[]> {
    const documents = await prisma.documents.findMany()
    return documents
  }

  static async getAllDocumentsForSearch(): Promise<any[]> {
    const documents = await prisma.documents.findMany({
      where: {
        is_included: true,
      },
    })
    return documents
  }

  static async getSingleDocument(docId: any): Promise<any> {
    const document = await prisma.documents.findFirst({
      where: {
        id: docId,
      },
    })
    return document
  }

  static async documentIdExists(documentId: any) {
    const document = await prisma.documents.findFirst({
      where: {
        id: documentId,
      },
    })
    return document ? true : false
  }

  static async addContentObj(
    title: string,
    description: any,
    is_included: any,
    document_id: any
  ): Promise<number> {
    const contentObj = await prisma.content_objects.create({
      data: {
        title,
        description,
        is_included,
        document_id,
      },
    })
    return contentObj.id
  }

  static async editContentObj(
    obj_id: any,
    title: string,
    description: any,
    is_included: any,
    document_id: number
  ) {
    const contentObj = await prisma.content_objects.update({
      where: {
        id: obj_id,
      },
      data: {
        title,
        description,
        is_included,
        document_id,
      },
    })
    return contentObj
  }

  static async getContentObjOfDocument(
    documentId: number
  ): Promise<any> {
    const contentObjs = await prisma.content_objects.findMany({
      where: {
        document_id: documentId,
      },
    })
    return contentObjs
  }

  static async removeContentObject(objId: number) {
    const contentObj = await prisma.content_objects.delete({
      where: {
        id: objId,
      },
    })
    return contentObj
  }

  static async contentObjIdExists(contentObjId: any) {
    const contentObj = await prisma.content_objects.findFirst({
      where: {
        id: contentObjId,
      },
    })
    return contentObj ? true : false
  }

  static async addDocumentStore(name: any): Promise<number> {
    const documentStore = await prisma.documents_store.create({
      data: {
        name
      },
    })
    return documentStore.id
  }

  static async updateDocumentStore(storeId: any, name: any) {
    const documentStore = await prisma.documents_store.update({
      where: {
        id: storeId,
      },
      data: {
        name,
      },
    })
    return documentStore
  }
  
  static async removeDocumentStore(storeId: number) {
    const documentStore = await prisma.documents_store.delete({
      where: {
        id: storeId,
      },
    })
    return documentStore
  }

  static async getDocumentStores(): Promise<any[]> {
    const documentStores = await prisma.documents_store.findMany()
    return documentStores
  }

  static async getSingleDocumentStore(name: any): Promise<any> {
    const documentStore = await prisma.documents_store.findFirst({
      where: {
        name,
      },
    })
    return documentStore
  }

  static async documentStoreIdExists(documentStoreId: any) {
    const documentStore = await prisma.documents_store.findFirst({
      where: {
        id: documentStoreId,
      },
    })
    return documentStore ? true : false
  }
}
