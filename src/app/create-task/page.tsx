"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/lib/api/tasks";
import { TaskCreateRequest } from "@/lib/types/tasks";
import { departmentService } from "@/lib/api/departments";
import { priorityService } from "@/lib/api/priorities";
import { statusService } from "@/lib/api/statuses";
import { employeeService } from "@/lib/api/employees";
import { Department } from "@/lib/types/departments";
import { Priority } from "@/lib/types/priorities";
import { Status } from "@/lib/types/statuses";
import { Employee } from "@/lib/types/employees";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsData, prioritiesData, statusesData, employeesData] = await Promise.all([
          departmentService.getAllDepartments(),
          priorityService.getAllPriorities(),
          statusService.getAllStatuses(),
          employeeService.getAllEmployees(),
        ]);

        setDepartments(departmentsData);
        setPriorities(prioritiesData);
        setStatuses(statusesData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const taskData: TaskCreateRequest = {
      name: formData.get("title") as string,
      description: formData.get("description") as string,
      due_date: formData.get("date") as string,
      status_id: parseInt(formData.get("statuses") as string, 10),
      employee_id: parseInt(formData.get("employees") as string, 10),
      priority_id: parseInt(formData.get("priorities") as string, 10),
      department_id: parseInt(formData.get("departments") as string, 10),
    };

    try {
      const createdTask = await taskService.createTask(taskData);
      alert(`Task created successfully!\n\nDetails:\n${JSON.stringify(createdTask, null, 2)}`);
      router.push("/");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 bg-[#FBF9FFA6] border border-[#DDD2FF]">
      <h1 className="text-2xl font-bold mb-4">შექმენი ახალი დავალება</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-semibold">სათაური*</label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full p-2 border rounded"
            required
          />
          <span className="text-sm text-gray-600">
            <p>min 2 symbols</p>
            <p>max 255 symbols</p>
          </span>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-lg font-semibold">აღწერა</label>
          <textarea
            id="description"
            name="description"
            className="w-full p-2 border rounded"
          />
          <span className="text-sm text-gray-600">
            <p>min 2 symbols</p>
            <p>max 255 symbols</p>
          </span>
        </div>

        <div className="mb-4">
          <label htmlFor="departments" className="block text-lg font-semibold">დეპარტამენტები*</label>
          <select
            id="departments"
            name="departments"
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="priorities" className="block text-lg font-semibold">პრიორიტეტი</label>
          <select
            id="priorities"
            name="priorities"
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a priority</option>
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="statuses" className="block text-lg font-semibold">სტატუსი</label>
          <select
            id="statuses"
            name="statuses"
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a status</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="employees" className="block text-lg font-semibold">პასუხისმგებელი თანამშრომელი</label>
          <select
            id="employees"
            name="employees"
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} {employee.surname}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-lg font-semibold">Due Date</label>
          <input
            type="date"
            id="date"
            name="date"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <input
          type="submit"
          value={loading ? "Submitting..." : "Submit"}
          className="bg-blue-500 text-white p-2 rounded cursor-pointer disabled:bg-gray-400"
          disabled={loading}
        />
      </form>
    </section>
  );
};

export default Page;