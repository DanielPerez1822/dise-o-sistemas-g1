import { Programa } from "../programas/programa";

export class Estudiante {
  id: number;
  status: string;
  nombreEstudiante: string;
  edad: number;
  documento: number;
  status_At: string;
  programaId:Programa
}