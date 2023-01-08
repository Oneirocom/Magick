import { CreateEventArgs, GetEventArgs } from '@magickml/core'
import { prisma } from '@magickml/prisma'

export class database {
  static instance: database
  constructor() {
    database.instance = this
  }

  async createEvent({
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

  async getEvents({
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
  async getAllEvents() {
    const events = await prisma.events.findMany()
    return events
  }
  async deleteEvent(id: number) {
    return await prisma.events.delete({
      where: {
        id,
      },
    })
  }
  async updateEvent(id: number, data: { [key: string]: string }) {
    const event = await prisma.events.update({
      where: {
        id,
      },
      data,
    })
    return event
  }

  async addWikipediaData(agent: any, data: any) {
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

  async getWikipediaData(agent: any) {
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
  async wikipediaDataExists(agent: any) {
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

  async getEntities() {
    return await prisma.entities.findMany()
  }
  async getEntity(id: any) {
    const entity = await prisma.entities.findFirst({
      where: {
        id,
      },
    })
    return entity
  }
  async entityExists(id: any) {
    const entity = await prisma.entities.findFirst({
      where: {
        id,
      },
    })
    return entity ? true : false
  }
  async deleteEntity(id: any) {
    const entity = await prisma.entities.delete({
      where: {
        id,
      },
    })
  }
  async getLastUpdatedInstances() {
    const entities = await prisma.entities.findMany()
    return entities.map((e) => {
      return {
        id: e.id,
        lastUpdated: e.updated_at ? e.updated_at : 0,
      }
    })
  }
  async setEntityDirty(id: any, value: boolean) {
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

  async setEntityUpdated(id: any) {
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
  async createEntity() {
    const entity = await prisma.entities.create({
      data: {},
    })
    return entity
  }
  async updateEntity(id: any, data: { [x: string]: any; dirty?: any }) {
    const entity = await prisma.entities.update({
      where: {
        id,
      },
      data,
    })
    return entity
  }

  async addDocument(
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
  async removeDocument(documentId: number) {
    const document = await prisma.documents.delete({
      where: {
        id: documentId,
      },
    })
    return document
  }
  async updateDocument(
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
  async getDocumentsOfStore(
    storeId: number
  ): Promise<any> {
    const documents = await prisma.documents.findMany({
      where: {
        store_id: storeId,
      },
    })
    return documents
  }
  async getAllDocuments(): Promise<any[]> {
    const documents = await prisma.documents.findMany()
    return documents
  }
  async getAllDocumentsForSearch(): Promise<any[]> {
    const documents = await prisma.documents.findMany({
      where: {
        is_included: true,
      },
    })
    return documents
  }
  async getSingleDocument(docId: any): Promise<any> {
    const document = await prisma.documents.findFirst({
      where: {
        id: docId,
      },
    })
    return document
  }
  async documentIdExists(documentId: any) {
    const document = await prisma.documents.findFirst({
      where: {
        id: documentId,
      },
    })
    return document ? true : false
  }

  async addContentObj(
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
  async editContentObj(
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
  async getContentObjOfDocument(
    documentId: number
  ): Promise<any> {
    const contentObjs = await prisma.content_objects.findMany({
      where: {
        document_id: documentId,
      },
    })
    return contentObjs
  }
  async removeContentObject(objId: number) {
    const contentObj = await prisma.content_objects.delete({
      where: {
        id: objId,
      },
    })
    return contentObj
  }
  async contentObjIdExists(contentObjId: any) {
    const contentObj = await prisma.content_objects.findFirst({
      where: {
        id: contentObjId,
      },
    })
    return contentObj ? true : false
  }

  async addDocumentStore(name: any): Promise<number> {
    const documentStore = await prisma.documents_store.create({
      data: {
        name
      },
    })
    return documentStore.id
  }
  async updateDocumentStore(storeId: any, name: any) {
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
  async removeDocumentStore(storeId: number) {
    const documentStore = await prisma.documents_store.delete({
      where: {
        id: storeId,
      },
    })
    return documentStore
  }
  async getDocumentStores(): Promise<any[]> {
    const documentStores = await prisma.documents_store.findMany()
    return documentStores
  }
  async getSingleDocumentStore(name: any): Promise<any> {
    const documentStore = await prisma.documents_store.findFirst({
      where: {
        name,
      },
    })
    return documentStore
  }
  async documentStoreIdExists(documentStoreId: any) {
    const documentStore = await prisma.documents_store.findFirst({
      where: {
        id: documentStoreId,
      },
    })
    return documentStore ? true : false
  }
}
