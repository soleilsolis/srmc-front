import axios from '@/lib/axios'

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
    }
}
