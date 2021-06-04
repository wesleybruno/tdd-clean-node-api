import { Encrypter } from '../../data/protocols/encrypter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  private readonly saltNumber: number
  constructor (saltNumber: number) {
    this.saltNumber = saltNumber
  }

  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.saltNumber)
  }
}
