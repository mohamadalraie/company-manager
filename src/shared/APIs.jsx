export const LoginApi="/api/login"
export const getAllEngineersApi="/api/engineers/all";
export const createEngineerApi="/api/engineers/create";
export const deleteEngineerApi="/api/engineers/delete/"; //it takes the Engineer id
// export const activateEngineerApi="/api/users/activate";
export const getAllConsultingEngineersApi="/api/consultingEngineers/";
export const createConsultingEngineerApi="/api/consultingEngineers/create";
export const deleteConsultingEngineerApi="/api/consultingEngineers/delete/";
export const getAllConsultingCompaniesApi="/api/consultingCompany/all";
export const deleteConsultingCompanyApi="/api/consultingCompany/delete/";
export const createConsultingCompanyApi="/api/consultingCompany/create";
export const getAllOwnersApi="/api/owner/all";
export const deleteOwnerApi="/api/owner/delete/";
export const createOwnerApi="/api/owner/create";
export const createProjectApi="/api/project/create";
export const getAllProjectsApi="/api/project/all";
export const getOneProjectApi="/api/project/";
export const addParticipantApi="/api/projectParticipant/create";
export const deleteParticipantApi="/api/projectParticipant/delete/"
export const createProjectManagerApi="/api/projectManagers/create";
export const getAllProjectManagersApi="/api/projectManagers/all";
export const deleteProjectManagerApi="/api/projectManagers/delete/";
export const deleteProjectFileApi="/api/projectFiles/delete/";
export const  addProjectFileApi=(projectId) =>{return `/api/projectFiles/${projectId}/create`; }
export const  getProjectFilesApi=(projectId) =>{return `/api/projectFiles/${projectId}/all`; }