import { ItemType } from "../../src/domain/value-objects/ItemType"

describe('ItemType Value Object', () => {
  it('should create UNIT and KG instances via static properties', () => {
    expect(ItemType.UNIT.getValue()).toBe('UNIT')
    expect(ItemType.KG.getValue()).toBe('KG')
  })

  it('should create instances from a string using from()', () => {
    const unit = ItemType.from('UNIT')
    const kg = ItemType.from('KG')

    expect(unit).toBe(ItemType.UNIT)
    expect(kg).toBe(ItemType.KG)
  })

  it('should throw an error for invalid values in from()', () => {
    expect(() => ItemType.from('INVALID')).toThrow('Invalid ItemType: INVALID')
  })

  it('should correctly compare equality with equals()', () => {
    const unit1 = ItemType.UNIT
    const unit2 = ItemType.from('UNIT')
    const kg = ItemType.KG

    expect(unit1.equals(unit2)).toBe(true)
    expect(unit1.equals(kg)).toBe(false)
  })

  it('toString() should return the string value', () => {
    expect(ItemType.UNIT.toString()).toBe('UNIT')
    expect(ItemType.KG.toString()).toBe('KG')
  })
})
