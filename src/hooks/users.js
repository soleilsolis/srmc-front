import axios from '@/lib/axios'

export const useUsers = () => {
    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    const usersQuery = async ({ ...props } = {}) => {
        await csrf()
        return axios.get(`/api/users/query/${props.type}/1`, config)
    }

    return {
        usersQuery,
    }
}
