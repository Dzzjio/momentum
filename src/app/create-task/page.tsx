import React from 'react'
import type { Metadata } from 'next'
import Form from 'next/form'
 

export const metadata: Metadata = {
    title: 'Create Task',
    description: 'From this page you can create a new task',
  }

const page = () => {
  return (
    <section>
        <h2 className='text-black'>შექმენი ახალი დავალება</h2>
        <div>
          :D
        </div>
    </section>
  )
}

export default page