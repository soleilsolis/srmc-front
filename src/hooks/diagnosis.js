import axios from '@/lib/axios'

export const useDiagnosis = () => {
    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    const newDiagnosis = async ({ setErrors, ...props }) => {
        await csrf()

        axios
            .post('/api/diagnosis', props, config)
            .then(() => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const editDiagnosis = async ({ setErrors, ...props }) => {
        await csrf()

        axios
            .put(`/api/diagnosis/${props.diagnosis_id}`, props, config)
            .then(() => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    return {
        newDiagnosis,
        editDiagnosis,
    }
}
