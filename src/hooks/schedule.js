import axios from '@/lib/axios'

export const useSchedule = () => {
    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    const newSchedule = async ({ setErrors, ...props }) => {
        await csrf()
        axios
            .post(`/api/schedule/user/${props.id}`, props, config)
            .then(() => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const editSchedule = async ({ setErrors, ...props }) => {
        await csrf()
        axios
            .put(`/api/schedule/${props.id}`, props, config)
            .then(() => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const deleteSchedule = async ({ ...props }) => {
        await csrf()
        axios
            .delete(`/api/schedule/${props.id}`, config)
            .then(() => location.reload())
    }

    return {
        newSchedule,
        editSchedule,
        deleteSchedule,
    }
}
