import type { RoleId } from "./types";

export interface RoleProfile {
  id: RoleId;
  label: string;
  description: string;
  permissions: string[];
  color: string;
}

export const roleProfiles: RoleProfile[] = [
  {
    id: "ADMIN",
    label: "Administrador",
    description: "Acceso total al sistema",
    permissions: [
      "Crear y administrar usuarios",
      "Asignar y modificar roles",
      "Acceso a todos los módulos",
      "Configuración del sistema",
    ],
    color: "navy",
  },
  {
    id: "FISCAL",
    label: "Fiscal",
    description: "Gestiona el expediente sumarial asignado",
    permissions: [
      "Ver expedientes asignados",
      "Instruir actuaciones",
      "Emitir resoluciones",
      "Ver trazabilidad del expediente",
    ],
    color: "teal",
  },
  {
    id: "ACTUARIO",
    label: "Actuario",
    description: "Carga actuaciones y documentos",
    permissions: [
      "Cargar actuaciones",
      "Registrar notificaciones",
      "Adjuntar documentos",
      "Foliar expediente",
    ],
    color: "info",
  },
  {
    id: "JEFATURA",
    label: "Jefatura / Dirección",
    description: "Consulta estado, plazos y reportes",
    permissions: [
      "Consultar estado de sumarios",
      "Ver plazos y alertas",
      "Acceder a reportes",
      "Vista panel de control",
    ],
    color: "warning",
  },
  {
    id: "JURIDICA",
    label: "Jurídica",
    description: "Revisa antecedentes e informes",
    permissions: [
      "Revisar antecedentes",
      "Analizar informes",
      "Validar resoluciones",
      "Acceso de lectura",
    ],
    color: "success",
  },
  {
    id: "AUDITOR",
    label: "Auditor / Control interno",
    description: "Acceso de lectura y trazabilidad",
    permissions: [
      "Acceso de lectura total",
      "Revisar trazabilidad",
      "Auditar eventos del sistema",
    ],
    color: "neutral",
  },
];

export function getRoleLabel(id: RoleId): string {
  return roleProfiles.find((r) => r.id === id)?.label ?? id;
}

export function getRoleProfile(id: RoleId): RoleProfile | undefined {
  return roleProfiles.find((r) => r.id === id);
}
