"use client";

import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";

interface Option {
  id: string;
  name: string;
}

interface SelectorProps {
  options: Option[];
  name: string;
  label: string;
  isMulti?: boolean;
  action: (formData: FormData) => Promise<void>;
  initialSelectedIds?: string[];
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
}

export default function Selector({
  options,
  name,
  label,
  isMulti = false,
  action,
  initialSelectedIds = [],
  selectedIds,
  setSelectedIds,
}: SelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectionChange = (id: string, checked: boolean) => {
    if (isMulti) {
      if (checked) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      }
    } else {
      setSelectedIds(checked ? [id] : []);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    console.log(`Client-side selected ${name}:`, selectedIds);
    await action(formData);
    setIsOpen(false); // Close dropdown on submit (already implemented)
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form action={handleSubmit}>
        <button
          type="button"
          className="w-full p-2 text-left bg-white border border-gray-300 rounded-md flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{label}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div
            className="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
            style={{ top: "100%" }}
          >
            {options.map((option) => (
              <label
                key={option.id}
                className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type={isMulti ? "checkbox" : "radio"}
                  name={name}
                  value={option.id}
                  checked={selectedIds.includes(option.id)}
                  onChange={(e) => handleSelectionChange(option.id, e.target.checked)}
                  className="mr-2 accent-purple-600"
                />
                {option.name}
              </label>
            ))}
            <button
              type="submit"
              className="w-full p-2 bg-purple-600 text-white rounded-b-md hover:bg-purple-700"
            >
              შენახვა
            </button>
          </div>
        )}
        {selectedIds.map((id) => (
          <input key={id} type="hidden" name={`${name}_selected`} value={id} />
        ))}
      </form>
    </div>
  );
}