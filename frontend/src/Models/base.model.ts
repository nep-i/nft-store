export default interface IEntityModel<T> {
  serialize: () => T;
  serializeForRespond?: () => T;
}

export class BaseModel implements IEntityModel<Object> {
  public id?: string;
  constructor(public params: { [key: string]: string } = {}) {
    this.id = params.id;
    return this;
  }

  public static deserialize(input: any): BaseModel {
    return new BaseModel(input.id);
  }

  public serialize(): {} {
    return { id: this.params.id };
  }

  public static mapEntityArray(inputArray: any[], entityModel: any): any[] {
    const returnArray: BaseModel[] = [];

    inputArray &&
      inputArray.forEach((element: any) => {
        returnArray.push(entityModel.deserialize(element));
      });

    return returnArray;
  }

  public static StringToFloat(input: string): number {
    return parseFloat(input);
  }

  public static FloatToString(input: number): string {
    return input.toString();
  }
}
