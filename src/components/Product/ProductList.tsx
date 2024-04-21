'use client'
import { getProducts, deleteProducts, addProducts, updateProducts, deleteProductsRel, updateProductsRel } from '@/services/Product';
import { getProductsType } from '@/services/ProductType';
import { useEffect, useState } from 'react';
import Table from "../Tables/Table";
import { keyValue } from "@/types/keyValue";
import Alert from '../Alert/Alert';

export default function ProductList() {
    const [token, setToken] = useState();

    const [usersFields, setUsersFields] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [error, setError] = useState<boolean>(false);
    const [alertRender, setAlertRender] = useState<boolean>(false);

    const [productTypes, setProductTypes] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState('');

    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [selectedRowIndex2, setSelectedRowIndex2] = useState(null);
    const [selectedUser, setSelectedUser] = useState([]);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        price: '',
        qtd: 0,
        product_id: '',
        product_type_id: '',
        old_product_type_id: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const clearForm = (e) => {
        setFormData({
            id: '',
            name: '',
            description: '',
            price: '',
            qtd: 0,
            product_id: '',
            product_type_id: '',
            old_product_type_id: ''
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await addProducts(token, formData);

            if (response.data == '') {
                loadProducts(token);
                closeModal();
            } else {
                setError(true);
                console.error('Erro ao adicionar produto:', response.data);
            }
        } catch (error) {
            setError(true);
            console.error('Erro ao adicionar produto:', error);
        } finally {
            setAlertRender(true); // Este bloco finally será executado, independentemente de a requisição ter sucesso ou falhar
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await updateProducts(token, formData);

            const responseRel = await updateProductsRel(token, formData);

            if (response.data == '') {
                loadProducts(token);
                closeModal();
            } else {
                setError(true);
                console.error('Erro ao adicionar produto:', response.data);
            }
        } catch (error) {
            setError(true);
            console.error('Erro ao atualizar produto:', error);
        } finally {
            setAlertRender(true); // Este bloco finally será executado, independentemente de a requisição ter sucesso ou falhar
        }
    };

    const handleSubmitDelete = (id, productTypeId) => {
        try {
            deleteProducts(token, id)
                .then(response => {
                    const updatedUsers = usersData.filter(user => user.id !== id);
                    setUsersData(updatedUsers);
                    closeModal();
                })
                .catch(error => {
                    setError(true);
                    console.error('Erro ao excluir produto:', error);
                });

            deleteProductsRel(token, id, productTypeId)
                .then(response => {
                    const updatedUsers = usersData.filter(user => user.id !== id);
                    setUsersData(updatedUsers);
                    closeModal();
                })
                .catch(error => {
                    setError(true);
                    console.error('Erro ao excluir produto:', error);
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

        setFormData({
            id: user.id,
            name: user.name,
            description: user.description,
            price: user.price,
            qtd: user.qtd,
            product_id: user.product_id,
            product_type_id: user.product_type_id,
            old_product_type_id: user.product_type_id
        });

        openModal('edit');
    };

    const handleDeleteClick = (index: number, index2: number) => {
        setSelectedRowIndex(index);
        setSelectedRowIndex2(index2);
        openModal('delete');
    };

    const loadProductsType = (tokenLoader) => {
        getProductsType(tokenLoader)
            .then(data => {
                const fieldsToIgnore = ['percentage', 'created_at'];

                const items = data.map(item => {
                    const newItem = {};
                    Object.keys(item).forEach(key => {
                        if (!fieldsToIgnore.includes(key)) {
                            newItem[key] = item[key];
                        }
                    });
                    return newItem;
                });

                setProductTypes(items);
            })
            .catch(error => {
                console.error('Erro ao obter Produto tipo:', error);
            });
    };

    const handleSelectChange = (e) => {
        setSelectedProductType(e.target.value);
    };

    const loadProducts = async (tokenLoader) => {
        if (tokenLoader) {
            getProducts(tokenLoader)
                .then(data => {
                    // const fieldsToIgnore = ['productId', 'created_at'];
                    const fieldsToIgnore = ['percentage', 'description', 'product_id', 'productId', 'old_product_type_id', 'created_at'];

                    let fields = Object.keys(data[0]).filter(field => !fieldsToIgnore.includes(field));

                    let items = data.map(item => {
                        let newItem = {};
                        Object.keys(item).forEach(key => {
                            if (!fieldsToIgnore.includes(key)) {
                                newItem[key] = item[key];
                            }
                        });
                        return newItem;
                    });

                    fields = [...fields, "ações"];
                    setUsersFields(fields);
                    setUsersData(items);
                })
                .catch(error => {
                    console.error('Erro ao obter Produto:', error);
                });
        } else {
            console.error('Token não encontrado.');
        }
    };

    useEffect(() => {
        const tokenState = localStorage.getItem('token');
        setToken(tokenState);

        loadProductsType(tokenState);
        loadProducts(tokenState);

    }, [searchTerm]);

    const filteredData = usersData.filter(item =>
        Object.values(item).some(value =>
            value !== undefined && value !== null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div>
            <h4 className="text-title-sm2 font-bold mb-4 text-black dark:text-white">
                Produtos
            </h4>
            <div className="flex items-center justify-between w-full mb-4">
                <input
                    type="text"
                    placeholder="Busca"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                                <label htmlFor="product_type_id" className="block text-sm font-medium text-gray-700">
                                    Tipo
                                </label>
                                <select
                                    id="product_type_id"
                                    name="product_type_id"
                                    value={formData.product_type_id}
                                    onChange={handleInputChange}
                                    className="w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                >
                                    <option value="">Selecione um opcao</option>
                                    {productTypes.map((type, index) => (
                                        <option key={index} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="qtd" className="block text-sm font-medium text-gray-700">
                                    Quantidade
                                </label>
                                <input
                                    type="number"
                                    id="qtd"
                                    name="qtd"
                                    value={formData.qtd}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>

                            {alertRender && (
                                error == true ? (
                                    <div className='mb-4'>
                                        <Alert type="error" message="Falha ao criar produto" />
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
                            <input
                                type="hidden"
                                id="old_product_type_id"
                                name="old_product_type_id"
                                value={formData.old_product_type_id}
                                onChange={handleInputChange}
                            />
                            <div className='mb-4'>
                                <label htmlFor="product_type_id" className="block text-sm font-medium text-gray-700">
                                    Tipo
                                </label>
                                <select
                                    id="product_type_id"
                                    name="product_type_id"
                                    value={formData.product_type_id}
                                    onChange={handleInputChange}
                                    className="w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                >
                                    <option value="">Selecione um opcao</option>
                                    {productTypes.map((type, index) => (
                                        <option key={index} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="qtd" className="block text-sm font-medium text-gray-700">
                                    Quantidade
                                </label>
                                <input
                                    type="number"
                                    id="qtd"
                                    name="qtd"
                                    value={formData.qtd}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>
                            {alertRender && (
                                error == true ? (
                                    <div className='mb-4'>
                                        <Alert type="error" message="Falha ao editar produto" />
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
                            <button onClick={() => handleSubmitDelete(selectedRowIndex, selectedRowIndex2)} className=" mr-3 flex items-center gap-3.5 px-4 py-2 text-sm font-medium duration-300 ease-in-out bg-danger text-white lg:text-base">Deletar</button>

                            <button className="flex items-center gap-3.5 px-2 py-2 text-sm font-medium duration-300 ease-in-out bg-primary text-white lg:text-base" onClick={closeModal}>Fechar Modal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
