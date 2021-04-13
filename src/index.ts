import { Decimal128, ObjectId, UUID } from 'bson';
import { classModel, property } from './decorators';

@classModel()
class TestModel {
    @property()
    _id: ObjectId;

    @property({type: 'int', indexed: true})
    age: number;

    @property({ primary: true })
    name: string;

    @property({ optional: true })
    large?: Decimal128;

    @property({ optional: true })
    uuid?: UUID;

    @property({ optional: true })
    hasKids?: boolean;

    @property({ optional: true })
    friends?: Array<string>;

    constructor(age: number, name: string) {
      this.age = age;
      this.name = name;
    }

    

    static schema = {}

}

// @ts-ignore
console.log("SCHEMA:", TestModel.schema);
