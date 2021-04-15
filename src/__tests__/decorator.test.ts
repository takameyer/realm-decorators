import { Decimal128, ObjectId, UUID } from "bson";
import { classModel, linkedTo, property } from "../";
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

describe("decorator", () => {
  it("to work as expected", () => {
    // @ts-ignore
    expect(TestModel.schema).toStrictEqual({
      properties: {
        _id: { type: "objectId", indexed: true },
        manNumber: { type: "int", indexed: true },
        manString: { type: "string" },
        optDecimal: { type: "decimal128", optional: true },
        optUuid: { type: "uuid", optional: true },
        optBool: { type: "bool", optional: true },
        optStringList: { type: "list", optional: true, objectType: "string" },
        optEmbeddedObjects: {
          type: "list",
          optional: true,
          objectType: "EmbeddedModel",
        },
        items: { type: "Item" },
      },
      primaryKey: "_id",
      name: "TestModel",
    });

    // @ts-ignore
    expect(Item.schema).toStrictEqual({
      properties: {
        _id: { type: "objectId", indexed: true },
        models: {
          type: "linkingObjects",
          objectType: "TestModel",
          property: "items",
        },
      },
      primaryKey: "_id",
      name: "Item",
    });
  });
});
