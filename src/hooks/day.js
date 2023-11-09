import axios from '@/lib/axios'

export const useDay = () => {
    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    const getDays = async ({ setDays }) => {
        await csrf()
        axios.get(`/api/days`, config).then(res => setDays(res.data.data))
    }

    return {
        getDays,
    }
}
