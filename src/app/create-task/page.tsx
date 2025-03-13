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
        <form className='border-[#DDD2FF] bg-[#FBF9FFA6] felx'>
            
        </form>
    </section>
  )
}

export default page