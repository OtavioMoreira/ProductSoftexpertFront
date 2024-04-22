'use client'
import { getSales, getSalesEdit, deleteSales, addSales, updateSales } from '@/services/Sales';
import { getProducts, getProductsEdit, updateProducts } from '@/services/Product';
import { useEffect, useState } from 'react';
import Table from "../Tables/Table";
import { keyValue } from "@/types/keyValue";
import Alert from '../Alert/Alert';

export default function ProductTypeList() {
    const [token, setToken] = useState();
    const [userId, setUserId] = useState();

    const [qtd, setQtd] = useState(1);
    const [price, setPrice] = useState(1);
    const [productId, setProductId] = useState();
    const [tax, setTax] = useState();

    const [purchasevalue, setPurchasevalue] = useState();
    const [taxvalue, setTaxvalue] = useState();
    const [totalvaluepurchase, setTotalvaluepurchase] = useState();
    const [totaltaxvaluepurchase, setTotaltaxvaluepurchase] = useState();

    const [product, setProduct] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');

    const [usersFields, setUsersFields] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [error, setError] = useState<boolean>(false);
    const [errorQtd, setErrorQtd] = useState<boolean>(false);
    const [alertRender, setAlertRender] = useState<boolean>(false);

    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [selectedUser, setSelectedUser] = useState([]);

    const [formData, setFormData] = useState({
        id: '',
        user_id: '',
        product_id: '',
        qtd: '',
        qtdProduct: '',
        purchasevalue: '',
        taxvalue: '',
        totalvaluepurchase: '',
        totaltaxvaluepurchase: '',
    });

    const handleInputChangeSelect = (e) => {
        const { name, value } = e.target;

        getProductsEdit(token, 'id=' + value)
            .then(data => {
                // console.log(data)
                setQtd(data[0].qtd)
                setPrice(data[0].price)
                setProductId(data[0].id)
                setTax(data[0].percentage)
            })
            .catch(error => {
                console.error('Erro ao obter Produto tipo:', error);
            });

        setFormData({ ...formData, [name]: value });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
    };

    const handleInputChangeQtd = (e) => {
        const { name, value } = e.target;
        const qtdValue = parseFloat(value);
        const priceValue = parseFloat(price);
        const percentage = parseFloat(tax);

        if (!isNaN(qtdValue) && !isNaN(priceValue)) {
            const purchaseValueUnit = qtdValue * priceValue;
            const taxValueUnit = price * convertToDecimal(percentage);
            const totalValuePurchase = (price * qtdValue) + (price * qtdValue) * convertToDecimal(percentage)
            const totalTaxValue = (price * qtdValue) * convertToDecimal(percentage)

            setFormData({ ...formData, [name]: value, user_id: userId, purchasevalue: purchaseValueUnit, taxvalue: taxValueUnit.toFixed(2), totalvaluepurchase: totalValuePurchase.toFixed(2), totaltaxvaluepurchase: totalTaxValue.toFixed(2) });
        } else {
            setFormData({ ...formData, [name]: value, user_id: userId, purchasevalue: '', taxvalue: '', totalvaluepurchase: '', totaltaxvaluepurchase: '' });
        }

        if (qtdValue <= qtd && qtdValue != 0) {
            setAlertRender(false);
            setErrorQtd(false);
        } else {
            setAlertRender(true);
            setErrorQtd(true);
        }
    };

    const convertToDecimal = (integer) => {
        return integer / 100;
    }

    const clearForm = (e) => {
        setFormData({
            id: '',
            user_id: '',
            product_id: '',
            qtd: '',
            qtdProduct: '',
            purchasevalue: '',
            taxvalue: '',
            totalvaluepurchase: '',
            totaltaxvaluepurchase: '',
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let qtdReload = (qtd - formData.qtdProduct)
        let idReload = formData.product_id

        let formDataQtd = {
            id: idReload,
            qtd: qtdReload
        }

        if (errorQtd == false) {
            try {
                const response = await addSales(token, formData);

                if (response.data == '') {
                    loadSales(token);
                    closeModal();
                    setAlertRender(false);
                    await updateProducts(token, formDataQtd);
                } else {
                    setError(true);
                    console.error('Erro ao adicionar produto tipo:', response.data);
                }
            } catch (error) {
                setError(true);
                console.error('Erro ao adicionar produto tipo:', error);
            } finally {

                setAlertRender(true); // Este bloco finally será executado, independentemente de a requisição ter sucesso ou falhar
            }
        } else {
            setAlertRender(true);
            setErrorQtd(true);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await updateSales(token, formData);

            if (response.data == '') {
                loadSales(token);
                setErrorQtd(false);
                closeModal();
            } else {
                setError(true);
                console.error('Erro ao adicionar venda:', response.data);
            }
        } catch (error) {
            setError(true);
            console.error('Erro ao atualizar venda:', error);
        } finally {
            setAlertRender(true); // Este bloco finally será executado, independentemente de a requisição ter sucesso ou falhar
        }

    };

    const handleSubmitDelete = (id) => {

        try {
            deleteSales(token, id)
                .then(response => {
                    const updatedUsers = usersData.filter(user => user.id !== id);
                    setUsersData(updatedUsers);
                    closeModal();
                })
                .catch(error => {
                    setError(true);
                    console.error('Erro ao excluir venda:', error);
                });
        } catch (error) {
            setError(true);
            console.error('Erro ao fazer login:', error);
        }
    };

    const openModal = (modalType) => {
        switch (modalType) {
            case 'add':
                setIsModalOpen(true);
                break;
            case 'edit':
                setIsEditModalOpen(true);
                break;
            case 'delete':
                setIsDeleteModalOpen(true);
                break;
            default:
                break;
        }
    };

    const closeModal = () => {
        clearForm();
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const handleDetailsClick = (user) => {
        setSelectedUser(user);

        getSalesEdit(token, 'id=' + user.id)
            .then(data => {
                setFormData({
                    id: data[0].id,
                    user_id: data[0].user_id,
                    product_id: data[0].product_id,
                    qtd: data[0].qtd,
                    qtdProduct: data[0].qtdProduct,
                    purchasevalue: data[0].purchasevalue,
                    taxvalue: data[0].taxvalue,
                    totalvaluepurchase: data[0].totalvaluepurchase,
                    totaltaxvaluepurchase: data[0].totaltaxvaluepurchase,
                });
            })
            .catch(error => {
                console.error('Erro ao obter Produto tipo:', error);
            });

        openModal('edit');
    };

    const handleDeleteClick = (index: number) => {
        console.log(index)
        setSelectedRowIndex(index);
        openModal('delete');
    };

    const loadProducts = (tokenLoader) => {
        getProducts(tokenLoader)
            .then(data => {
                const fieldsToIgnore = ['created_at'];

                const items = data.map(item => {
                    const newItem = {};
                    Object.keys(item).forEach(key => {
                        if (!fieldsToIgnore.includes(key)) {
                            newItem[key] = item[key];
                        }
                    });
                    return newItem;
                });

                setProduct(items);
            })
            .catch(error => {
                console.error('Erro ao obter Produto tipo:', error);
            });
    };

    const handleSelectChange = (e) => {
        setSelectedProduct(e.target.value);
    };

    const loadSales = (tokenLoader) => {
        if (tokenLoader) {
            getSales(tokenLoader)
                .then(data => {
                    const fieldsToIgnore = ['products_percentage', 'created_at'];

                    const fieldMapping = {
                        'sale_id': 'id',
                        'user_name': 'Username',
                        'products_name': 'Produto',
                        'products_price': 'Preço',
                        'products_qtd': 'Produto qtd',
                        'products_percentage': '%',
                    };

                    let fields = Object.keys(data[0]).filter(field => !fieldsToIgnore.includes(field));
                    fields = [...fields, "ações"];

                    const renamedFields = fields.map(fieldName => fieldMapping[fieldName] || fieldName);

                    let items = data.map(item => {
                        let newItem = {};
                        Object.keys(item).forEach(key => {
                            if (!fieldsToIgnore.includes(key)) {
                                const newKey = fieldMapping[key] || key; // Use o mapeamento de campo para renomear as chaves
                                newItem[newKey] = item[key];
                            }
                        });
                        return newItem;
                    });

                    setUsersFields(renamedFields);
                    setUsersData(items);
                })
                .catch(error => {
                    console.error('Erro ao obter Produto tipo:', error);
                });
        } else {
            console.error('Token não encontrado.');
        }
    };

    useEffect(() => {
        const tokenState = localStorage.getItem('token');
        setToken(tokenState);

        let userStorage = JSON.parse(localStorage.getItem('user'));
        setUserId(userStorage[0].id);

        loadProducts(tokenState);
        loadSales(tokenState);

    }, [searchTerm]);

    const filteredData = usersData.filter(item =>
        Object.values(item).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div>
            <div className="flex items-center justify-between w-full mb-4">
                <input
                    type="text"
                    placeholder="Busca"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mr-2 w-auto rounded-lg border-[1.5px]  border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />

                <button onClick={() => openModal('add')} className="flex items-center gap-3.5 px-6 py-3 text-sm font-medium duration-300 ease-in-out bg-primary text-white lg:text-base">Adicionar</button>
            </div>

            <Table fields={usersFields} items={filteredData} onDetailsClick={handleDetailsClick} onDeleteClick={handleDeleteClick} />

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-lg"> {/* Alterado para max-w-lg */}
                        <h2 className="text-2xl font-semibold mb-4">Adicionar</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='mb-4'>
                                <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">
                                    Produto
                                </label>
                                <select
                                    id="product_id"
                                    name="product_id"
                                    value={formData.product_id}
                                    onChange={handleInputChangeSelect}
                                    className="w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                >
                                    <option value="">Selecione um opcao</option>
                                    {product.map((type, index) => (
                                        <option key={index} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='mb-4'>
                                <label htmlFor="qtdProduct" className="block text-sm font-medium text-gray-700">
                                    Quantidade
                                </label>
                                <input
                                    type="number"
                                    id="qtdProduct"
                                    name="qtdProduct"
                                    value={formData.qtdProduct}
                                    onChange={handleInputChangeQtd}
                                    className="mr-2 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                    disabled={!formData.product_id}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="purchasevalue" className="block text-sm font-medium text-gray-700">
                                        Valor compra
                                    </label>
                                    <h2 className='font-bold text-black'>R$ {formData.purchasevalue}</h2>
                                </div>
                                <div>
                                    <label htmlFor="taxvalue" className="block text-sm font-medium text-gray-700">
                                        Taxa
                                    </label>
                                    <h2 className='font-bold text-black'>R$ {formData.taxvalue}</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="totalvaluepurchase" className="block text-sm font-medium text-gray-700">
                                        Total Valor compra
                                    </label>
                                    <h2 className='font-bold text-black'>R$ {formData.totalvaluepurchase}</h2>
                                </div>
                                <div>
                                    <label htmlFor="totaltaxvaluepurchase" className="block text-sm font-medium text-gray-700">
                                        Total taxa
                                    </label>
                                    <h2 className='font-bold text-black'>R$ {formData.totaltaxvaluepurchase}</h2>
                                </div>
                            </div>

                            {alertRender && (
                                errorQtd == true ? (
                                    <div className='mb-4'>
                                        <Alert type="warning" message={`Quantidade maior que o items no estoque. Estoque: ${qtd}`} />
                                    </div>
                                ) : (
                                    <span></span>
                                )
                            )}

                            {alertRender && (
                                error == true ? (
                                    <div className='mb-4'>
                                        <Alert type="error" message="Falha ao criar venda" />
                                    </div>
                                ) : (
                                    <span></span>
                                )
                            )}

                            <div className="flex justify-end">
                                <button type="submit" className="mb-4 w-full flex items-center justify-center gap-3.5 px-2 py-2 text-sm font-medium duration-300 ease-in-out bg-primary text-white lg:text-base">
                                    Enviar
                                </button>
                            </div>
                        </form>
                        <div className="flex justify-end">
                            <button className="flex items-center gap-3.5 px-2 py-2 text-sm font-medium duration-300 ease-in-out bg-danger text-white lg:text-base" onClick={closeModal}>Fechar Modal</button>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-lg">
                        <h2 className="text-2xl font-semibold mb-4">Editar</h2>

                        <form onSubmit={handleEditSubmit}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="purchasevalue" className="block text-sm font-medium text-gray-700">
                                        Valor compra
                                    </label>
                                    <h2 className='font-bold text-black'>R$ {formData.purchasevalue}</h2>
                                </div>
                                <div>
                                    <label htmlFor="taxvalue" className="block text-sm font-medium text-gray-700">
                                        Taxa
                                    </label>
                                    <h2 className='font-bold text-black'>R$ {formData.taxvalue}</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="totalvaluepurchase" className="block text-sm font-medium text-gray-700">
                                        Total Valor compra
                                    </label>
                                    <h2 className='font-bold text-black'>R$ {formData.totalvaluepurchase}</h2>
                                </div>
                                <div>
                                    <label htmlFor="totaltaxvaluepurchase" className="block text-sm font-medium text-gray-700">
                                        Total taxa
                                    </label>
                                    <h2 className='font-bold text-black'>R$ {formData.totaltaxvaluepurchase}</h2>
                                </div>
                            </div>
                            {alertRender && (
                                error == true ? (
                                    <div className='mb-4'>
                                        <Alert type="error" message="Falha ao editar venda" />
                                    </div>
                                ) : (
                                    <span></span>
                                )
                            )}
                        </form>
                        <button className="flex items-center gap-3.5 px-2 py-2 text-sm font-medium duration-300 ease-in-out bg-danger text-white lg:text-base" onClick={closeModal}>Fechar Modal</button>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-lg"> {/* Alterado para max-w-lg */}
                        <h2 className="text-2xl font-semibold mb-4">Excluir</h2>
                        <h4 className="mb-4">Voce deseja mesmo excluir esse item?</h4>
                        <h4 className="mb-4 font-bold">Os itens vinculados tambem serao excluidos</h4>

                        <div className="flex items-center justify-between w-full">
                            <button onClick={() => handleSubmitDelete(selectedRowIndex)} className=" mr-3 flex items-center gap-3.5 px-4 py-2 text-sm font-medium duration-300 ease-in-out bg-danger text-white lg:text-base">Deletar</button>

                            <button className="flex items-center gap-3.5 px-2 py-2 text-sm font-medium duration-300 ease-in-out bg-primary text-white lg:text-base" onClick={closeModal}>Fechar Modal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
