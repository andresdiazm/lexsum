export type RoleId =
  | "ADMIN"
  | "FISCAL"
  | "ACTUARIO"
  | "JEFATURA"
  | "JURIDICA"
  | "AUDITOR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleId;
  unit: string;
  password: string;
  active: boolean;
  createdAt: string;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: RoleId;
}

export interface Sujeto {
  nombre: string;
  cargo?: string;
}

export interface Sumario {
  id: string;
  numero: string;
  resolucionInstructora: string;
  fechaResolucion: string;
  objeto: string;
  sujetos: Sujeto[];
  fiscalId: string;
  fiscalNombre: string;
  fechaDesignacion: string;
  plazo: number;
  estado: "INSTRUIDO" | "EN_TRAMITE" | "CERRADO";
  resolucionDesignacion?: string;
  archivoNombre?: string;
  createdAt: string;
  createdBy: string;
}
