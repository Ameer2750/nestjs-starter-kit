export enum NodeEnv {
    Dev = 'development',
    Prod = 'production',
  }
  
  export interface EnvironmentVariables {
    nodeEnv: NodeEnv;
    jwtSecret: string;
    jwtRefreshSecret: string;
  }
  
  export default (): EnvironmentVariables => {
    const jwtSecret = process.env.JWT_ACCESS_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  
    if (!jwtSecret) {
      throw new Error('Jwt secret is not set in env');
    }
  
    if (!jwtRefreshSecret) {
      throw new Error('Jwt refresh secret is not set in env');
    }
  
    return {
      nodeEnv: process.env.NODE_ENV === NodeEnv.Prod ? NodeEnv.Prod : NodeEnv.Dev,
      jwtSecret,
      jwtRefreshSecret
    };
  };