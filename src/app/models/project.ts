import { Employee } from './employee';

export interface Project {
  id: number,
  workers: Map<number, Employee>
}
