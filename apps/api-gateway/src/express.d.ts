declare namespace Express {
  export interface Request {
    myLogout?: () => void;
    isLoggedIn: () => boolean;
  }
}
