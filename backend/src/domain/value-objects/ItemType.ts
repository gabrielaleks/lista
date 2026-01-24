export class ItemType {
  private constructor(private readonly value: 'UNIT' | 'KG') { }

  static readonly UNIT = new ItemType('UNIT')
  static readonly KG = new ItemType('KG')

  static from(value: string): ItemType {
    if (value === 'UNIT') return ItemType.UNIT
    if (value === 'KG') return ItemType.KG
    throw new Error(`Invalid ItemType: ${value}`)
  }

  getValue(): 'UNIT' | 'KG' {
    return this.value
  }

  equals(other: ItemType): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
