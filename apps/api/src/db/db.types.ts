export interface UserRecord {
  _id: string;
  address: string;
  age: number;
  balance: string;
  company: string;
  email: string;
  eyeColor: string;
  guid: string;
  isActive: boolean;
  name: {
    first: string;
    last: string;
  };
  password: string;
  phone: string;
  picture: string;
}

export interface SessionRecord {
  createdAt: string;
  expiresAt: string;
  id: string;
  userId: string;
}

export interface DbShape {
  sessions: SessionRecord[];
  users: UserRecord[];
}
