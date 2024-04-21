import axiosUtils from '../utils/AxiosConfig';

const getSales = async (token, params = '') => {
    try {
        const response = await axiosUtils.get('/getSales?' + params, {
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

const getSalesEdit = async (token, params = '') => {
    try {
        const response = await axiosUtils.get('/getSalesEdit?' + params, {
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

const deleteSales = async (token, id) => {
    const requestData = {
        id: id
    };

    try {
        const response = await axiosUtils.post('/deleteSales', JSON.stringify(requestData), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
};

const addSales = async (token, params) => {
    const requestData = {
        user_id: params.user_id,
        product_id: params.product_id,
        qtd: params.qtdProduct,
        purchaseValue: params.purchasevalue,
        taxValue: params.taxvalue,
        totalValuePurchase: params.totaltaxvaluepurchase,
        totalTaxValuePurchase: params.totalvaluepurchase,
    };

    try {
        const response = await axiosUtils.post('/addSales', JSON.stringify(requestData), {
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

const updateSales = async (token, params) => {
    const requestData = {
        id: params.id,
        user_id: params.user_id,
        product_id: params.product_id,
        qtd: params.qtd,
        purchaseValue: params.purchaseValue,
        taxValue: params.taxValue,
        totalValuePurchase: params.totalValuePurchase,
        totalTaxValuePurchase: params.totalTaxValuePurchase,
    };

    try {
        const response = await axiosUtils.post('/updateSales', JSON.stringify(requestData), {
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

export { getSales, deleteSales, addSales, updateSales, getSalesEdit };