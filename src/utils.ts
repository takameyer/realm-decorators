// const isRealmPrimitive = (type: string) => {
//   switch (type) {
//     case 'Number':
//     case 'String':

//       break
//   }
//   const t = type.toLowerCase();
//   sw
// }

export const getRealmType = (type: string) => {
  switch (type) {
    case "Date":
      return "date";
    case "String":
      return "string";
    case "Boolean":
      return "bool";
    case "Number":
      return "double"; // default to double for numbers, can be overridden in decorator.

    // TODO: case 'DATA' // no such thing...

    // BSON
    case "Decimal128":
      return "decimal128";
    case "ObjectId":
      return "objectId";
    case "UUID":
      return "uuid";

    // TODO: should we handle Arrays/Lists here?

    default:
      return type;
  }
};
