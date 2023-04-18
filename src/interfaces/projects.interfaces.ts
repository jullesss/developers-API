type TProjects = {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate?: Date;
  developerId: number;
};

type TProjectsRequest = Omit<TProjects, "id">;

type TTechs = {
  id: number;
  name: string;
};

type TTechsRequest = Omit<TTechs, "id">;

type TProjectsTechs = {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: Date;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate?: Date;
  projectDeveloperId: number;
  technologyId?: number;
  technologyName?: number;
};

export { TProjects, TProjectsRequest, TProjectsTechs, TTechs, TTechsRequest };
