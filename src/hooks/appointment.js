import axios from '@/lib/axios'
import { useState } from 'react'
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from '@material-tailwind/react'

export const useAppointment = () => {
    const newAppointment = ({ ...props }) => {
        axios
            .post('/api/appointment', props)
            .then(() => {
                location.reload()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
            })
    }

    return {
        newAppointment,
        indexAppointments,
    }
}
