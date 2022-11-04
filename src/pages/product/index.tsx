import Head from 'next/head';
import { Header } from '../../components/Header';
import styles from './styles.module.scss';

import { canSSRAuth } from '../../utils/canSSRAuth';
import { Input, TextArea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FiUpload } from 'react-icons/fi'
import { useState, ChangeEvent, ChangeEventHandler } from 'react';
import { setupAPIClient } from '../../services/api';

type ItemProps = {
    id: string;
    name: string;
}

interface CategoryProps{
    categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps){

    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState<File|null>(null);

    const [categories, setCategories] = useState(categoryList || []);
    const [categorySelected, setCategorySelected] = useState('');

    function handleFile(e: ChangeEvent<HTMLInputElement>){

        if(!e.target.files){
          return;
        }
    
        const image = e.target.files[0];
    
        if(!image){
          return;
        }
    
        if(image.type === 'image/jpeg' || image.type === 'image/png'){
    
          setImageAvatar(image);
          setAvatarUrl(URL.createObjectURL(image));
    
        }
    
    }

    function handleChangeCategory(e: ChangeEvent<HTMLSelectElement>){
        setCategorySelected(e.target.value);
    }


    return(
        <>
            <Head>
                <title>Novo Produto - Sujeito Pizzaria</title>
            </Head>
            <Header/>
            <div>  
                <main className={styles.container}>
                    <h1>Novo Produto</h1>
                    <form className={styles.form}>

                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={30} color='#FFF'/>
                            </span>
                            <input type='file' accept='image/png, image/jpeg' onChange={handleFile}/>

                            {avatarUrl && (
                                <img
                                className={styles.preview}
                                src={avatarUrl}
                                alt="Foto do produto"
                                width={250}
                                height={250}
                                />
                            )}

                        </label>

                        <select value={categorySelected} onChange={handleChangeCategory}>
                            {categories.map((item, index)=>{
                                return(
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>

                        <Input
                        placeholder='Digite o nome do produto'
                        />
                        <Input
                        placeholder='Preço do produto'
                        />

                        <TextArea
                        placeholder='Descreva seu produto...'
                        />

                        <Button type='submit'>
                            Cadastrar
                        </Button>
                    </form>
                </main>
                
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async(ctx)=>{

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/category');

    return{
        props:{
            categoryList: response.data
        }
    }
})