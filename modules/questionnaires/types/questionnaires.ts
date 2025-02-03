export interface IQuestion {
  _id: string;
  text: string;
  type: "TEXT" | "OPTION" | "RADIO" | "CHECK" | "TEXTAREA";
  options: {
    correct_answer?: boolean;
    score?: number;
    text: string;
    _id: string;
  }[];
  groupId: string;
  state: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  name: string;
  description: string;
  state: true;
  questions: IQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Questionnaire {
  title: string;
  description: string;
  questions: IQuestion[];
  groups: Group[];
  createdAt: string;
  updatedAt: string;
  uid: string;
}

export interface GroupBasic {
  name: string;
  description: string;
  state?: true;
  questions: string[];
  createdAt?: string;
  updatedAt?: string;
}
