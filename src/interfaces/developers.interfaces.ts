type TDevelopers = {
  id: number;
  name: string;
  email: string;
};

type TDevelopersRequest = Omit<TDevelopers, "id">;

type TDeveloperInfos = {
  id: number;
  developerSince: Date;
  preferredOS: "Windows" | "Linux" | "MacOS";
  developerId: number;
};

type TDeveloperInfosRequest = Omit<TDeveloperInfos, "id" | "developerId">;

export {
  TDevelopers,
  TDevelopersRequest,
  TDeveloperInfos,
  TDeveloperInfosRequest,
};
