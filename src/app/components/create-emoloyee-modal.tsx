'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import defaultProfilePic from '../../../public/img/default-avatar.png';
import { departmentService } from '../../lib/api/departments';
import { employeeService } from '../../lib/api/employees';
import { Department } from '@/lib/types/departments';
import { CreateEmployeePayload } from '@/lib/types/employees';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEmployeeModal = ({ isOpen, onClose }: CreateEmployeeModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    department_id: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentService.getAllDepartments();
        setDepartments(data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };

    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload: CreateEmployeePayload = {
        name: formData.name,
        surname: formData.surname,
        avatar: selectedImage,
        department_id: Number(formData.department_id),
      };

      const createdEmployee = await employeeService.createEmployee(payload);
      console.log('Created employee:', createdEmployee);

      alert('Employee created successfully!');
      resetForm();
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || 'Unknown error occurred';
      setError(`Error creating employee: ${errorMessage}`);
      console.error('Detailed error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      surname: '',
      department_id: '',
    });
    setSelectedImage(null);
    setPreviewImage(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mb-6">თანამშრომლის დამატება</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
        
        <div className='flex gap-4'>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                სახელი*
                </label>
                <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="ელენე"
                required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                გვარი*
                </label>
                <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="მეტრეველი"
                required
                />
            </div>
        </div>

            <div
                className="flex justify-center my-4 border-2 border-gray-400 border-dashed w-full"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                >
            <label htmlFor="profile-picture" className="cursor-pointer">
              <div className="relative">
                <Image
                  src={previewImage || defaultProfilePic}
                  alt="Profile Picture"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm">შეცვალე სურათი</span>
                </div>
              </div>
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className='w-1/2 mr-[-16px]'>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              დეპარტამენტი*
            </label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" disabled>
                აირჩიეთ თანამდებობა
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="border border-purple-500 text-purple-500 px-4 py-2 rounded-md hover:bg-purple-50"
              disabled={isLoading}
            >
              გაუქმება
            </button>
            <button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 disabled:bg-purple-300"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'თანამშრომლის შექმნა'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;