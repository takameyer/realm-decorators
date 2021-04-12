import "reflect-metadata";

const typeMetadataKey = Symbol("type");
function property(type: string) {
  return Reflect.metadata(typeMetadataKey, type);
}

function getType(target: any, propertyKey: string) {
  return Reflect.getMetadata(typeMetadataKey, target, propertyKey);
}

function test(C: any):any {
    console.log("where am i called?")
    return class extends C{
            constructor(){
                super()
                this.a=3
            }
            static schema = {value:"test"}
        }
}

@test
class A {
    @property("number")
    a:number 

    constructor(){
        this.a = 2
    }
}

//@ts-ignore
console.log("before instantiation", A.schema)
const a = new A()
//@ts-ignore
console.log("after:", a.schema)
console.log(a.a)

