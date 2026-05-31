export interface AuthDTO {
  email: string;
  password: string;
}

export interface SignUpDto {
  name: string;
  email: string;
  password: string;
}

export type SessionData = {
  uid: string;
  name: string;
  email: string;
  utid: string;
};