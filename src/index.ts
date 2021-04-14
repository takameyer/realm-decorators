import { Decimal128, ObjectId, UUID } from 'bson';
import { classModel, property } from './decorators';

@classModel()
class TestModel {
    @property({ primary: true })
    _id: ObjectId;

    @property({ type: 'int', indexed: true })
    age: number;

    @property()
    name: string;

    @property({ optional: true })
    large?: Decimal128;

    @property({ optional: true })
    uuid?: UUID;

    @property({ optional: true })
    hasKids?: boolean;

    @property({ type: 'string[]?' })
    friends?: Array<string>;

    constructor(age: number, name: string) {
      this.age = age;
      this.name = name;
    }
}

// @ts-ignore
console.log("SCHEMA:", TestModel.schema);

const tm = new TestModel(3, 'Jens');
console.log('>> TEST:', tm);


