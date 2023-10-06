import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useAppointment } from '@/hooks/appointment'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'
import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
  } from "@material-tailwind/react";


const NewAppointments = () => {
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    New Appointment
                </h2>
            }>
            <Head>
                <title>Appointments - SRMC</title>
            </Head>
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className=" overflow-hidden shadow-sm sm:rounded-lg">
                        <form method='POST' action='http://localhost:8000/api/appointment'>
                        <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
       New Appointment
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Create new Appointment
      </Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-4 flex flex-col gap-6">
          <Input size="lg" label="Name" />
          <Input size="lg" label="Email" />
          <Input type="password" size="lg" label="Password" />
        </div>
        <Checkbox
          label={
            <Typography
              variant="small"
              color="gray"
              className="flex items-center font-normal"
            >
              I agree the
              <a
                href="#"
                className="font-medium transition-colors hover:text-gray-900"
              >
                &nbsp;Terms and Conditions
              </a>
            </Typography>
          }
          containerProps={{ className: "-ml-2.5" }}
        />
        <Button className="mt-6" fullWidth>
          Register
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <a href="#" className="font-medium text-gray-900">
            Sign In
          </a>
        </Typography>
      </form>
    </Card>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default NewAppointments
