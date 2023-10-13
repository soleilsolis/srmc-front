import axios from '@/lib/axios'
import useSWR from 'swr'

export const useAppointment = () => {
    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    const { data: doctors } = useSWR('/api/users/doctors', () =>
        axios.get('/api/users/doctors', config).then(res => res.data.data),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    const availableDates = async id => {
        await csrf()

        axios
            .get(`/api/users/doctors/${id}/dates`, config)
            .then(res => res.data.data)
    }

    const cancelAppointment = async id => {
        await csrf()
                
        axios
            .put(`/api/appointment/cancel/${id}`, config)
            .then(() => location.reload())
    }

    const newAppointment = async ({ setErrors, ...props }) => {
        await csrf()

        axios
            .post('/api/appointment', props, config)
            .then(() => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const acceptAppointment = async ({ setErrors, id, ...props }) => {
        await csrf()

        axios
            .patch(`/api/appointment/${id}`, props, config)
            .then(() => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    return {
        doctors,
        availableDates,
        cancelAppointment,
        acceptAppointment,
        newAppointment,
    }
}
