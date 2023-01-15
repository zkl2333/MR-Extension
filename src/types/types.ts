export interface AuthData {
  baseUrl: string;
  accessKey: string;
}

export interface Userinfo {
  id: number;
  gmt_modified: string;
  username: string;
  role: number;
  qywx_user: string;
  pushdeer_key: string;
  score_rule_name: string;
  nickname: string;
  gmt_create: string;
  douban_user: string;
  telegram_user_id?: string;
  bark_url: string;
  avatar: string;
  role_name: string;
}

export interface SiteConfig {
  config_filepath: string;
  id: string;
  name: string;
  domain: string;
  encoding: string;
  config_url: string;
  version: number;
  login?: {
    required?: boolean;
    test: {
      selector: string;
    };
  };
}

export interface SiteSetting {
  alias: string;
  cookie: string;
  domain: string;
  download_size: number;
  gmt_create: string;
  gmt_modified: string;
  id: number;
  is_vip: number;
  proxies: string;
  share_rate: number;
  site_name: string;
  smart_download: number;
  status: number;
  traffic_management_status: number;
  uid: number;
  upload_kpi: number;
  upload_size: number;
  user_agent: string;
  username: string;
  web_search: number;
}
