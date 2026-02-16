export interface SignupUserInput {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }

export interface LoginUserInput {
    email: string;
    password: string;
  }
  
  export type SignupUserResponse = {
    success: boolean; // Indicates if the signup was successful
    message: string;  // A message describing the result;
  }

  export type LoginUserResponse = {
    success: boolean; // Indicates if the login was successful
    message: string;  // A message describing the result;
    token: string;    // The authentication token if login was successful
  }

  export declare function signupUser(user: SignupUserInput): Promise<SignupUserResponse>;
  export declare function loginUser(user: LoginUserInput): Promise<LoginUserResponse>;
