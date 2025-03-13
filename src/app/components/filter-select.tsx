"use client";

import { useState } from "react";
import Selector from "./select-options";

interface Option {
  id: string;
  name: string;
}

interface FilterSectionProps {
  priorityOptions: Option[];
  departmentOptions: Option[];
  selectedItems: { type: string; id: string; name: string }[];
  initialPriorities: string[];
  initialDepartments: string[];
  handlePrioritySelection: (formData: FormData) => Promise<void>;
  handleDepartmentSelection: (formData: FormData) => Promise<void>;
  removeSelection: (type: string, id: string) => Promise<void>;
  clearAllSelections: () => Promise<void>;
}

export default function FilterSection({
  priorityOptions,
  departmentOptions,
  selectedItems,
  initialPriorities,
  initialDepartments,
  handlePrioritySelection,
  handleDepartmentSelection,
  removeSelection,
  clearAllSelections,
}: FilterSectionProps) {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(initialPriorities);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(initialDepartments);

  const handleRemoveSelection = async (type: string, id: string) => {
    if (type === "priorities") {
      setSelectedPriorities(selectedPriorities.filter((item) => item !== id));
    } else if (type === "departments") {
      setSelectedDepartments(selectedDepartments.filter((item) => item !== id));
    }
    await removeSelection(type, id);
  };

  const handleClearAll = async () => {
    setSelectedPriorities([]);
    setSelectedDepartments([]);
    await clearAllSelections();
  };

  return (
    <div className="relative">
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Selector
            options={priorityOptions}
            name="priorities"
            label="აირჩიეთ პრიორიტეტი"
            isMulti={true}
            action={handlePrioritySelection}
            initialSelectedIds={initialPriorities}
            selectedIds={selectedPriorities}
            setSelectedIds={setSelectedPriorities}
          />
        </div>

        <div className="flex-1">
          <Selector
            options={departmentOptions}
            name="departments"
            label="აირჩიეთ დეპარტამენტი"
            isMulti={true}
            action={handleDepartmentSelection}
            initialSelectedIds={initialDepartments}
            selectedIds={selectedDepartments}
            setSelectedIds={setSelectedDepartments}
          />
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <form
              key={`${item.type}-${item.id}`}
              action={handleRemoveSelection.bind(null, item.type, item.id)}
              className="flex items-center bg-white border border-gray-300 rounded-full px-2 py-1"
            >
              <span className="text-sm text-gray-600">{item.name}</span>
              <button
                type="submit"
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </form>
          ))}
          <form action={handleClearAll} className="ml-2">
            <button
              type="submit"
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              გასუფთავება
            </button>
          </form>
        </div>
      )}
    </div>
  );
}