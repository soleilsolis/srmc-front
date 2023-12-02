import axios from '@/lib/axios'
import useSWR from 'swr'
import { useAuth } from './auth'

export const useAppointment = () => {
    const { user } = useAuth({ middlware: 'auth' })
    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

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

    const getSummary = async ({ ...props }) => {
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
                console.log(error.response.data)
            })
    }

    const getSummary2 = async ({ ...props }) => {
        await csrf()

        config['responseType'] = 'blob'
        axios
            .post(`/api/appointments/export2`, props, config)
            .then(res => {
                const href = URL.createObjectURL(res.data)
                open(href)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                console.log(error.response.data)
            })
    }

    const appointmentsQuery = async ({ ...props } = {}) => {
        await csrf()
        return axios.get(
            `/api/appointments/query/${props.status}?page=${
                props.page
            }&search=${props.search ?? ''}&type=${
                props.type ?? ''
            }&followed_up_at=${props.followed_up_at ?? ''}`,
            config,
        )
    }

    const cancelAppointment = async id => {
        await csrf()
        axios
            .patch(`/api/appointment/cancel/${id}`, config)
            .then(() => location.reload())
    }

    const meetingLink = async ({ setErrors, ...props }) => {
        await csrf()
        axios
            .patch(`/api/appointment/${props.id}/meetingLink`, props, config)
            .then(() => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
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
            .then(() => {
                user?.type === 'patient'
                    ? (location.href = '/appointments')
                    : (location.href = '/admin/appointments')
            })
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
        stats,
        cancelAppointment,
        acceptAppointment,
        newAppointment,
        getAppointment,
        rescheduleAppointment,
        followUpAppointment,
        appointmentsQuery,
        getSummary,
        getSummary2,
        checkInAppointment,
        checkOutAppointment,
        newVitals,
        meetingLink,
    }
}
