import api from "../config/axiosConnection"





export const getFuncionarios = async () => {
    const response = await api.get('super_admin/employees_admin')
    return response.data
}