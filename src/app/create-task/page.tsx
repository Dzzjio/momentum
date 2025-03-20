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
import { validateName } from "@/lib/utils/validations";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    status_id: "",
    employee_id: "",
    priority_id: "",
    department_id: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    title: { minLength: "", maxLength: "" },
    description: { minLength: "", maxLength: "" },
  });

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "title" || name === "description") {
      const validation = validateName(value);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: {
          minLength: value && !validation.minLength ? "invalid" : "",
          maxLength: value && !validation.maxLength ? "invalid" : "",
        },
      }));
    }
  };

  const isFormValid = () => {
    const titleValidation = validateName(formData.title);
    const descriptionValidation = validateName(formData.description || "");
    return (
      formData.title &&
      titleValidation.isValid &&
      formData.due_date &&
      formData.status_id &&
      formData.employee_id &&
      formData.priority_id &&
      formData.department_id &&
      (!formData.description || descriptionValidation.isValid)
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid()) return;
    setLoading(true);
    const taskData: TaskCreateRequest = {
      name: formData.title,
      description: formData.description,
      due_date: formData.due_date,
      status_id: parseInt(formData.status_id, 10),
      employee_id: parseInt(formData.employee_id, 10),
      priority_id: parseInt(formData.priority_id, 10),
      department_id: parseInt(formData.department_id, 10),
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

  const getValidationColor = (field: keyof typeof validationErrors, rule: "minLength" | "maxLength") =>
    !formData[field] ? "text-gray-500" : validationErrors[field][rule] ? "text-red-500" : "text-green-500";

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">შექმენი ახალი დავალება</h1>
      <form onSubmit={handleSubmit} className="p-6 bg-[#FBF9FF] rounded-xl">
        <div className="grid grid-cols-2 gap-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-2">სათაური*</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg ${
                validationErrors.title.minLength || validationErrors.title.maxLength
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-purple-500`}
              required
            />
            <div className="mt-2 space-y-1 text-sm">
              <p className={`flex items-center ${getValidationColor("title", "minLength")}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                მინიმუმ 2 სიმბოლო
              </p>
              <p className={`flex items-center ${getValidationColor("title", "maxLength")}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                მაქსიმუმ 255 სიმბოლო
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="department_id" className="block text-sm font-medium mb-2">დეპარტამენტები*</label>
            <select
              id="department_id"
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none bg-white"
              required
            >
              <option value="">აირჩიეთ დეპარტამენტი</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 col-span-2">
            <label htmlFor="description" className="block text-sm font-medium mb-2">აღწერა</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg ${
                validationErrors.description.minLength || validationErrors.description.maxLength
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-purple-500 h-32`}
            />
            <div className="mt-2 space-y-1 text-sm">
              <p className={`flex items-center ${getValidationColor("description", "minLength")}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                მინიმუმ 2 სიმბოლო
              </p>
              <p className={`flex items-center ${getValidationColor("description", "maxLength")}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                მაქსიმუმ 255 სიმბოლო
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="priority_id" className="block text-sm font-medium mb-2">პრიორიტეტი*</label>
            <select
              id="priority_id"
              name="priority_id"
              value={formData.priority_id}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none bg-white"
              required
            >
              <option value="">აირჩიეთ პრიორიტეტი</option>
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="status_id" className="block text-sm font-medium mb-2">სტატუსი*</label>
            <select
              id="status_id"
              name="status_id"
              value={formData.status_id}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none bg-white"
              required
            >
              <option value="">აირჩიეთ სტატუსი</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="employee_id" className="block text-sm font-medium mb-2">პასუხისმგებელი თანამშრომელი*</label>
            <select
              id="employee_id"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none bg-white"
              required
            >
              <option value="">აირჩიეთ თანამშრომელი</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} {employee.surname}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="due_date" className="block text-sm font-medium mb-2">ვადა*</label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:bg-purple-300"
            disabled={loading || !isFormValid()}
          >
            {loading ? "Submitting..." : "დავალების შექმნა"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Page;