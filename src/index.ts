import "reflect-metadata";

const properties = {} 

function property(
    target: any,
    key: string,
  ) {
    var t = Reflect.getMetadata("design:type", target, key);
    properties[key] = t.name
  }

type Constructor = { new (...args: any[]): any };

function realm<T extends Constructor>(BaseClass: T) {
    return class extends BaseClass {
        static schema = {properties}
    }
}
@realm
class A{
    @property
    count: number 
    @property
    name: string

    constructor(){
        this.count = 2
        this.name = 'andrew'
    }

    static schema = {}
}

const obj = new A()

console.log("schema", A.schema)  // schema { properties: { count: 'Number', name: 'String' } }
