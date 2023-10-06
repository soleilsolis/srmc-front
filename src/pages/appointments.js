import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useAppointment } from '@/hooks/appointment'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";

const Appointments = () => {

    const [appointments, getAppointments] = useState([]);


    async function x () {
        axios
        .get('/api/appointments')
        .then(res => {
            
            getAppointments(res.data.data)
        })
        .catch(error => {
            if (error.response.status !== 409) throw error

            router.push('/verify-email')
        })
    }
   
    useEffect(() => {
        x();
    }, []);


    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Appointments
                </h2>
            }>
            <Head>
                <title>Appointments - SRMC</title>
            </Head>
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className=" overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="">
                            <div className='grid grid-cols-4 gap-4'>
                            {appointments.map((appointment) => (
                                 <Card className="mt-6 w-full">
                                 <CardBody>
                                   <Typography variant="h5" color="blue-gray" className="mb-2">
                                     #{appointment.id}
                                   </Typography>
                                   <Typography>
                                   { 'paid at: '+appointment.verified_at ?? 'not yet paid' }
                                   </Typography>
                                 </CardBody>
                                 <CardFooter className="pt-0">
                                   <a className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700' href={appointment.payment_link} >Pay Now</a>
                                 </CardFooter>
                               </Card>
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Appointments
