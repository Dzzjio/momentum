import { departmentService } from "@/lib/api/departments";
import { statusService } from "@/lib/api/statuses";
import { Department} from "../lib/types/departments";
import { Status } from "@/lib/types/statuses";

export default async function DepartmentsPage() {
  const departments: Department[] = await departmentService.getAllDepartments();
  const statuses: Status[] = await statusService.getAllStatuses();

  return (
    <div className="p-4">

      <h1> დავალებების გვერდი</h1>
       <ul>
        {statuses.map((stat) => (
          <li key={stat.id} className="p-2 border-b">
            {stat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}