

 /*
  static schema: ObjectSchema = {
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
  };
 */ 
  
class TodoList { 
    @property() _id: ObjectId;
    @property() name: string;
    @property() items: Realm.List<TodoItem>;
}

  /*
   static schema: ObjectSchema = {
    name: 'TodoList',
    properties: {
      _id: 'objectId',
      name: 'string',
      items: 'TodoItem[]',
    },
    primaryKey: '_id',
  };*/
  
class TodoItem{
    @property() _id: ObjectId;
    @property() description: string;
    @property() done: boolean;
    @property() deadline?: Date;
    @linkedTo(TodoList, 'items')
    lists: TodoList[];
}
