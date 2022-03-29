import React, { createContext, useEffect, useState } from "react";
import { ImagePickerResponse } from "react-native-image-picker";
import coffeeAPI from "../api/coffeeAPI";
import { Producto, ProductsResponse } from "../interfaces/appInterfaces";

type ProductsContextProps = {
    products: Producto[];
    loadProducts: () =>Promise<void>;
    addProduct: (categoryId: string, productName: string) =>Promise<Producto>;
    updateProduct: (categoryId: string, productName: string, productId: string) =>Promise<void>;
    deleteProduct: (id: string) =>Promise<void>;
    loadProductById: (id: string) =>Promise<Producto>;
    uploadImage: ( data: any, id: string) =>Promise<void>
}

const baseURL = 'https://cofee-react-native.herokuapp.com/api';


export const ProductsContext = createContext({} as ProductsContextProps);


export const ProductsProvider = ({ children}: any) => {

    const [products, setProducts] = useState<Producto[]>([]);
    
    useEffect(() => {
      loadProducts();
    }, [])
    
    
    const loadProducts = async() =>{
        const response = await coffeeAPI.get<ProductsResponse>('/productos?limite=50');
        // setProducts([...products, ...response.data.productos]);
        setProducts([ ...response.data.productos]);
        console.log(products);
    
    };
    
    const addProduct = async(categoryId: string, productName: string): Promise<Producto> =>{
        const response = await coffeeAPI.post<Producto>('/productos', {
            nombre: productName,
            categoria: categoryId
        });
        setProducts([...products, response.data]);

        return response.data;
    };
    
    const updateProduct = async(categoryId: string, productName: string, productId: string) =>{
        const response = await coffeeAPI.put<Producto>(`/productos/${productId}`, {
            nombre: productName,
            categoria: categoryId
        });
        setProducts( products.map( product => product._id === productId ? response.data : product ));
    };
    
    const deleteProduct = async(id: string) => {
        await coffeeAPI.delete(`/productos/${id}`);
    };
    
    const loadProductById = async(id: string):Promise<Producto> => {
        const response = await coffeeAPI.get<Producto>(`/productos/${id}`);
        return response.data;
    };
    
    const uploadImage = async( data: ImagePickerResponse, id: string) =>{
        const fileToUpload = {
            uri: data.assets?.[0].uri,
            type: data.assets?.[0].type,
            name: data.assets?.[0].fileName
        }
        const formData = new FormData();
        formData.append('archivo', fileToUpload);
        try {
            await fetch(`${baseURL}/uploads/productos/${id}`, {
                method: 'PUT',
                body: formData
            })
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ProductsContext.Provider value={{
            products,
            loadProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            loadProductById,
            uploadImage
        }}>
            { children }
        </ProductsContext.Provider>
    )
}