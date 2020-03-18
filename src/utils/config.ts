interface IConfig {
  API_URL?: string;
  BOARD_REFRESH_RATE_MS?: number;
}

const config: IConfig = (window as any).SRCCLR_ENV || {};

export default config;
