import { ObjectId } from "bson";
import "reflect-metadata";

const _schemas = {} 

// function property(
//     target: any,
//     key: string,
//   ) {
//       console.log(`target: ${target.constructor.name}` )
//     const type = Reflect.getMetadata("design:type", target, key);
//     //properties[key] = type?.name
//   }

  interface AttributeProperties{
    type: string,
    optional?: boolean,
    linkingObject?: string,
    property?: string
  }

  /**
   * 
    name: 'TodoItem',
    properties: {
      _id: 'objectId',
      description: 'string',
      done: {type: 'bool', default: false},
      lists: {
        type: 'linkingObjects',
        objectType: 'TodoList',
        property: 'items',
      },
      deadline: 'date?',
    },
    primaryKey: '_id',
   */

function property(properties?: AttributeProperties) {
    return function(target:any, key:string){
        const schema = getSchemaFromTarget(target)
        const type = Reflect.getMetadata("design:type", target, key);
        schema.properties[key] = {type: type?.name, ...properties }
    }
  }

  function getSchemaFromTarget(target){
    if(_schemas[target.constructor.name] == undefined){
        _schemas[target.constructor.name] = {
            name: target.constructor.name,
            properties: {}

        }
    }
    return _schemas[target.constructor.name]
  }

function primaryKey(
    target: any,
    key: string,
  ) {
        const schema = getSchemaFromTarget(target)
        schema.primaryKey = key
  }

function linked(properties?: AttributeProperties) {
    return function(target:any, key:string){
        const schema = getSchemaFromTarget(target)
        const type = Reflect.getMetadata("design:type", target, key);
        schema.properties[key] = {type: properties?.type || type?.name, optional: properties?.optional || false }
    }
  }


type Constructor = { new (...args: any[]): any };

type Float = number

function realm<T extends Constructor>(BaseClass: T) {
    console.log("here first?")
    //@ts-ignore
    const test = Reflect.getMetadata("design:type", BaseClass, "count") 
    console.log("my type: ", test?.name)
    return class extends BaseClass {
        static schema = _schemas[BaseClass.name]
    }
}

class Collection{}

@realm
class A{
    @property() @primaryKey _id: ObjectId
    @property({type: 'double', linkingObject: 'B', property: 'items' }) @primaryKey count: number 
    @property() weight?: Float
    @property() name: string[]

    primaryKey?: string

    constructor(){
        this._id = new ObjectId()
        this.count = 2
        //this.weight = 2.2
        this.name = ['andrew']
    }

    static schema = {}
}

@realm
class B{
    @property({type: 'ObjectId', optional: true}) @primaryKey _id: ObjectId
    @property() count: number 
    @property() weight?: Float
    @property() name: string[]

    primaryKey?: string

    constructor(){
        this._id = new ObjectId()
        this.count = 2
        //this.weight = 2.2
        this.name = ['andrew']
    }

    

    static schema = {}

}

const obj = new A()

console.log("A schema", A.schema)  // schema { properties: { count: 'Number', name: 'String' } }

const obj2 = new B()
console.log("B schema", B.schema)  // schema { properties: { count: 'Number', name: 'String' } }
