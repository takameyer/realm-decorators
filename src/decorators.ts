import 'reflect-metadata'
import { ObjectSchema, ObjectSchemaProperty } from 'realm'
import { getRealmType } from './utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Class<T> = { new (...arg: any[]): T }

const CLEAN_PROPERTY_DECLARATION_REGEX = /[[\]{}<>?]/g // chars: [ ] { } < > ?

const schemaMap: { [type: string]: Partial<ObjectSchema> } = {}

const getPartialSchema = (name: string): Partial<ObjectSchema> =>
  schemaMap[name] ?? (schemaMap[name] = { properties: {} })

export type ClassModelOptions = {
  name?: string
  embedded?: boolean
}

export const classModel = (options: ClassModelOptions = {}): ClassDecorator => <T extends Function>(
  constructor: T,
) => {
  const schema = getPartialSchema(constructor.name)

  schema.name = options.name ?? constructor.name
  if (options.embedded) {
    schema.embedded = true
  }

  // attach schema as a static prop on the type (in the future, register with Realm directly)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(constructor as any).schema = schema
}

export type PropertyOptions = {
  type?: string
  primary?: boolean
  indexed?: boolean
  optional?: boolean
  mapTo?: string
  default?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const property = (options: PropertyOptions = {}): PropertyDecorator => (
  target: Object,
  key: string,
) => {
  const schema = getPartialSchema(target.constructor.name)

  const metadata = Reflect.getMetadata('design:type', target, key)

  let type: string = metadata?.name
  let objectType: string | undefined

  if (!type && !options.type) {
    throw new Error(`Not able to derive type from ${key}. Set and explicit 'type' to fix this.`)
  }

  const { type: typeOverride, primary, ...rest } = options

  if (primary) {
    if (schema.primaryKey) {
      throw new Error(
        `Only one primary key allowed per ObjectSchema. Currently "${schema.primaryKey}" & "${key}" are both marked as primary.`,
      )
    }

    schema.primaryKey = key
    rest.indexed = true // This is handled by core - this is mostly for consistency.
  }

  // TODO: List/Array detection (& setting objectType to the generic-wrapped type).

  // NOTE: should we parse it/clean it up the same way it's currently works, e.g. 'string?[]'
  if (typeOverride) {
    const cleanedType = typeOverride.replace(CLEAN_PROPERTY_DECLARATION_REGEX, '')

    // optional check
    if (typeOverride.includes('?')) {
      rest.optional = true
    }

    if (typeOverride.includes('[')) {
      objectType = cleanedType
      type = 'list'
    } else if (typeOverride.includes('{')) {
      objectType = cleanedType
      type = 'dict' // TODO: or is it 'dictionary'?
    } else if (typeOverride.includes('<')) {
      objectType = cleanedType
      type = 'set'
    } else {
      type = typeOverride
    }
  }

  type = getRealmType(type)
  const properties: ObjectSchemaProperty = {
    type,
    ...rest,
  }

  if (objectType) {
    properties.objectType = objectType
  }

  schema.properties[key] = properties
}

export const linkedTo = <T>(parentClass: Class<T>, linkedProperty: Extract<keyof T, string>) => {
  return (target: Object, key: string): void => {
    const schema = getPartialSchema(target.constructor.name)
    schema.properties[key] = {
      type: 'linkingObjects',
      objectType: parentClass.name,
      property: linkedProperty,
    }
  }
}
