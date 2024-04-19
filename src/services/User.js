import axiosUtils from '../utils/AxiosConfig';

const getUsers = async (token) => {
    try {
        const response = await axiosUtils.get('/getUsers', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
};

const deleteUsers = async (token, id) => {
    const requestData = {
        id: id
    };

    try {
        const response = await axiosUtils.post('/deleteUsers', JSON.stringify(requestData), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
};

const addUsers = async (token, params) => {
    const requestData = {
        username: params.username,
        email: params.email,
        password: params.password,
    };

    try {
        const response = await axiosUtils.post('/addUsers', JSON.stringify(requestData), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
};

const updateUsers = async (token, params) => {
    const requestData = {
        id: params.id,
        username: params.username,
        email: params.email,
        password: params.password,
    };

    try {
        const response = await axiosUtils.post('/updateUsers', JSON.stringify(requestData), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
};

export { getUsers, deleteUsers, addUsers, updateUsers };