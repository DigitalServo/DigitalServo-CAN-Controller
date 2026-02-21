export enum ValueType {
  String, Number
}

export interface KeyValue {
  id?: string | number,
  type?: ValueType,
  key: string,
  value: string | number
};

export type KeyValues = KeyValue[];
