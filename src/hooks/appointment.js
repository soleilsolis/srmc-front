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

    const { data: stats } = useSWR('/api/appointments/stats', () =>
        axios.get('/api/appointments/stats', config).then(res => res.data.data),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    const getAppointment = async id => {
        await csrf()
        axios.get(`/api/appointment/${id}`, config).then(res => res.data.data)
    }

    const checkInAppointment = async ({ ...props }) => {
        await csrf()

        axios
            .patch(`/api/appointment/checkIn/${props.id}`)
            .then(() => location.reload())
    }

    const checkOutAppointment = async ({ ...props }) => {
        await csrf()

        axios
            .patch(`/api/appointment/checkOut/${props.id}`)
            .then(() => location.reload())
    }

    const getSummary = async ({ setErrors, ...props }) => {
        await csrf()

        config['responseType'] = 'blob'
        axios
            .post(`/api/appointments/export`, props, config)
            .then(res => {
                const href = URL.createObjectURL(res.data)
                open(href)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const appointmentsQuery = async ({ ...props } = {}) => {
        await csrf()
        return axios.get(`/api/appointments/query/${props.type}/1`, config)
    }

    const cancelAppointment = async id => {
        await csrf()
        axios
            .patch(`/api/appointment/cancel/${id}`, config)
            .then(() => location.reload())
    }

    const rescheduleAppointment = async ({ setErrors, ...props }) => {
        await csrf()

        axios
            .put(
                `/api/appointment/reschedule/${props.appointment_id}`,
                props,
                config,
            )
            .then(
                () => (location.href = `/appointment/${props.appointment_id}`),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const followUpAppointment = async ({ setErrors, ...props }) => {
        await csrf()

        axios
            .put(
                `/api/appointment/followUp/${props.appointment_id}`,
                props,
                config,
            )
            .then(
                () => (location.href = `/appointment/${props.appointment_id}`),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const newAppointment = async ({ setErrors, ...props }) => {
        await csrf()

        axios
            .post('/api/appointment', props, config)
            .then(() => (location.href = '/appointments'))
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const newVitals = async ({ setErrors, ...props }) => {
        await csrf()

        axios
            .post(`/api/appointment/vitals/${props.id}`, props, config)
            .then(() => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const acceptAppointment = async ({ setErrors, id, ...props }) => {
        await csrf()

        axios
            .put(`/api/appointment/${id}`, props, config)
            .then(() => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    return {
        doctors,
        stats,
        cancelAppointment,
        acceptAppointment,
        newAppointment,
        getAppointment,
        rescheduleAppointment,
        followUpAppointment,
        appointmentsQuery,
        getSummary,
        checkInAppointment,
        checkOutAppointment,
        newVitals,
    }
}
