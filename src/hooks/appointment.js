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

    const cancelAppointment = async id => {
        await csrf()

        axios
            .put(`/api/appointment/cancel/${id}`, config)
            .then(() => location.reload())
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
        cancelAppointment,
        acceptAppointment,
        error,
        mutate,
    }
}
