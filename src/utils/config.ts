interface IConfig {
  API_URL?: string;
}

const config: IConfig = (window as any).SRCCLR_ENV || {};

export default config;
