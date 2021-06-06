import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {

  connection: null as MongoClient,
  uri: null as string,
  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.connection.close()
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.connection) await this.connect(this.uri)
    return this.connection.db().collection(name)
  },

  mapper (collection: any): any {
    const { _id: id, ...collectiontWithoutId } = collection
    return {
      id,
      ...collectiontWithoutId
    }
  }
}
