'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import defaultProfilePic from '../../../public/img/avatar-placeholder.png';
import { departmentService } from '../../lib/api/departments';
import { employeeService } from '../../lib/api/employees';
import { Department } from '@/lib/types/departments';
import { CreateEmployeePayload } from '@/lib/types/employees';
import { validateName, validateFile, validateAvatar, validateDepartment } from '@/lib/utils/validations';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEmployeeModal = ({ isOpen, onClose }: CreateEmployeeModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', surname: '', department_id: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    name: { minLength: '', maxLength: '' },
    surname: { minLength: '', maxLength: '' },
    avatar: '',
    department_id: '',
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentService.getAllDepartments();
        setDepartments(data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };
    if (isOpen) fetchDepartments();
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);
    setPreviewImage(file ? URL.createObjectURL(file) : null);
    setValidationErrors((prev) => ({ ...prev, avatar: !validateAvatar(file) ? 'invalid' : '' }));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] || null;
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
    setValidationErrors((prev) => ({ ...prev, avatar: !validateAvatar(file) ? 'invalid' : '' }));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'name' || name === 'surname') {
      const validation = validateName(value);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: { minLength: value && !validation.minLength ? 'invalid' : '', maxLength: value && !validation.maxLength ? 'invalid' : '' },
      }));
    } else if (name === 'department_id') {
      setValidationErrors((prev) => ({ ...prev, department_id: value && !validateDepartment(value, departments) ? 'invalid' : '' }));
      setIsDropdownOpen(false);
    }
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error creating employee: ${errorMessage}`);
      console.error('Detailed error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', surname: '', department_id: '' });
    setSelectedImage(null);
    setPreviewImage(null);
    setValidationErrors({ name: { minLength: '', maxLength: '' }, surname: { minLength: '', maxLength: '' }, avatar: '', department_id: '' });
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) onClose();
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
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

  const getValidationColor = (field: keyof typeof formData, rule?: 'minLength' | 'maxLength') => {
    if (!formData[field]) return 'text-gray-500';
    if (field === 'name' || field === 'surname') {
      return rule === 'minLength'
        ? validationErrors[field].minLength
          ? 'text-red-500'
          : 'text-green-500'
        : validationErrors[field].maxLength
          ? 'text-red-500'
          : 'text-green-500';
    }
    return validationErrors[field] ? 'text-red-500' : 'text-green-500';
  };

  const isFormValid = () => {
    const nameValidation = validateName(formData.name);
    const surnameValidation = validateName(formData.surname);
    return (
      formData.name &&
      nameValidation.isValid &&
      formData.surname &&
      surnameValidation.isValid &&
      formData.department_id &&
      validateDepartment(formData.department_id, departments) &&
      selectedImage &&
      validateAvatar(selectedImage)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
      <div ref={modalRef} className="bg-white rounded-lg p-8 w-1/2 shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">✕</button>
        <h2 className="text-2xl font-bold text-center mb-8">თანამშრომლის დამატება</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">სახელი*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full border ${
                  validationErrors.name.minLength || validationErrors.name.maxLength ? 'border-red-500' : 'border-gray-300'
                } rounded-md p-3 text-base focus:outline-none focus:ring-1 focus:ring-purple-500`}
                placeholder="სახელი"
                required
              />
              <div className="mt-2 space-y-1">
                <p className={`flex items-center ${getValidationColor('name', 'minLength')}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  მინიმუმ 2 სიმბოლო
                </p>
                <p className={`flex items-center ${getValidationColor('name', 'maxLength')}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  მაქსიმუმ 255 სიმბოლო
                </p>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">გვარი*</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                className={`w-full border ${
                  validationErrors.surname.minLength || validationErrors.surname.maxLength ? 'border-red-500' : 'border-gray-300'
                } rounded-md p-3 text-base focus:outline-none focus:ring-1 focus:ring-purple-500`}
                placeholder="გვარი"
                required
              />
              <div className="mt-2 space-y-1">
                <p className={`flex items-center ${getValidationColor('surname', 'minLength')}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  მინიმუმ 2 სიმბოლო
                </p>
                <p className={`flex items-center ${getValidationColor('surname', 'maxLength')}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  მაქსიმუმ 255 სიმბოლო
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">ავატარი*</p>
            <div
              className={`flex justify-center my-4 py-4 border-2 ${
                validationErrors.avatar ? 'border-red-500' : 'border-gray-400'
              } border-dashed w-full rounded-md`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <label htmlFor="profile-picture" className="cursor-pointer">
                <div className="relative w-[150px] h-[150px]">
                  <Image
                    src={previewImage || defaultProfilePic}
                    alt="Profile Picture"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <input id="profile-picture" type="file" accept="image/*" className="hidden" onChange={handleFileChange} required />
              </label>
            </div>
            {validationErrors.avatar && (
              <p className="text-red-500 text-sm mt-2">
                {validateFile(selectedImage) ? 'ავატარი სავალდებულოა' : 'ფოტო უნდა იყოს 600KB-ზე ნაკლები'}
              </p>
            )}
          </div>
          
          <div className="w-[calc(50%-24px)]">
            <label className="block text-sm font-medium text-gray-700 mb-2">დეპარტამენტი*</label>
            <div className="relative" ref={selectRef}>
              <div className={`border-2 ${isDropdownOpen ? 'border-purple-500' : 'border-gray-300'} rounded-md ${isDropdownOpen ? 'shadow-md' : ''}`}>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleInputChange}
                  onMouseDown={() => setIsDropdownOpen(true)}
                  onBlur={() => setIsDropdownOpen(false)}
                  className={`w-full border-0 p-3 text-base focus:outline-none appearance-none bg-white pr-10 rounded-md ${
                    validationErrors.department_id ? 'text-red-500' : 'text-gray-700'
                  }`}
                  required
                >
                  <option value="" disabled>
                    აირჩიეთ დეპარტამენტი
                  </option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id} className="text-gray-700 bg-white hover:bg-gray-100">
                      {department.name}
                    </option>
                  ))}
                </select>
                <span
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-purple-500' : 'rotate-0 text-gray-500'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="w-[calc(50%-24px)] ml-auto right-0 flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-purple-500 text-purple-500 px-6 py-2 rounded-md text-base hover:bg-purple-50"
              disabled={isLoading}
            >
              გაუქმება
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-500 text-white px-6 py-2 rounded-md text-base hover:bg-purple-600 disabled:bg-purple-300"
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? 'ემატება...' : 'დაამატეთ თანამშრომელი'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;