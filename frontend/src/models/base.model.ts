import { entries } from "lodash";

export default interface IEntityModel<T> {
  serialize: () => T;
  serializeForRespond?: () => T;

  mapEntityArray?: () => T[];
}

export class BaseModel implements IEntityModel<Object> {
  public id?: string;
  constructor(public params: { [key: string]: any } = {}) {
    this.id = params.id;
    return this;
  }

  public deserialize(input: any): BaseModel {
    return new BaseModel(input.id);
  }

  public serialize(): {} {
    return { id: this.params.id };
  }

  public static mapEntityArray<T extends BaseModel>(
    inputArray: any[],
    model: { deserialize: (input: any) => T }
  ): T[] {
    const returnArray: T[] = [];

    inputArray?.forEach((element: any) => {
      returnArray.push(model.deserialize(element));
    });
    return returnArray;
  }
}
