export interface LinkResponse {
  links: string[];
}

export interface LinkRequest {
  link: {
    title: string;
    url: string;
  };
}
