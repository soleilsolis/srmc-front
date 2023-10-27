import axios from '@/lib/axios'

export const usePrescription = () => {
    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    const newPrescription = async ({ setErrors, ...props }) => {
        await csrf()

        axios
            .post(`/api/prescription/appointment/${props.id}`, props, config)
            .then(() => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const deletePrescription = async ({ setErrors, ...props }) => {
        await csrf()

        axios
            .delete(`/api/prescription/${props.id}`, props, config)
            .then(() => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    return {
        newPrescription,
        deletePrescription,
    }
}
