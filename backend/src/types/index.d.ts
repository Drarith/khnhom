declare global {
  namespace Express {
    export interface Request {
      user?: CustomJwtPayload;
      profile?: IProfile;
    }
  }
}

// This empty export is crucial.
// It signals to TypeScript that this file is a module,
// which is necessary for the global namespace augmentation to work.
export {};