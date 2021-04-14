import { Decimal128, ObjectId, UUID } from "bson";
import { classModel, linkedTo, property } from "./decorators";

@classModel({ name: "", embedded: true })
class EmbeddedModel {
  @property()
  name: string;
}

@classModel()
class TestModel {
  @property({ primary: true })
  _id: ObjectId;

  @property({ type: "int", indexed: true })
  manNumber: number;

  @property()
  manString: string;

  @property({ optional: true })
  optDecimal?: Decimal128;

  @property({ optional: true })
  optUuid?: UUID;

  @property({ optional: true })
  optBool?: boolean;

  @property({ type: "string[]?" })
  optStringList?: Array<string>;

  @property({ type: "EmbeddedModel[]?" })
  optEmbeddedObjects?: Realm.List<EmbeddedModel>;

  @property({ type: "Item" })
  items?: any;

  constructor(num: number, str: string) {
    this.manNumber = num;
    this.manString = str;
  }
}

@classModel()
class Item {
  @property({ primary: true })
  _id: ObjectId;
  @linkedTo(TestModel, "items")
  models: any;
}

// @ts-ignore
console.log("SCHEMA:", TestModel.schema);

//@ts-ignore
console.log("LINKEDSCHEMA: ", Item.schema);
