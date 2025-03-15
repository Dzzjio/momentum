// Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/img/logo-hourglass.png';
import CreateEmployeeModal from './create-emoloyee-modal';
import { useState } from 'react';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="py-4">
        <nav className="mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">
            <Link href="/">
              <Image src={logo} alt="Momentum Logo" width={150} height={50} priority />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="border border-[var(--brand-primary)] text-[var(--brand-primary)] px-4 py-2 rounded-md hover:bg-[var(--brand-primary)] hover:text-white"
            >
              თანამშრომლის შექმნა
            </button>
            <Link
              href="/create-task"
              className="border border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[var(--brand-primary)]"
            >
              + შექმენი ახალი დავალება
            </Link>
          </div>
        </nav>
      </header>

      {/* Render the Modal */}
      <CreateEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Header;