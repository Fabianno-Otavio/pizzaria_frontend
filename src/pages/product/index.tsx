import Head from 'next/head';
import { Header } from '../../components/Header';
import styles from './styles.module.scss';

import { canSSRAuth } from '../../utils/canSSRAuth';
import { Input, TextArea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FiUpload } from 'react-icons/fi'
import { useState, ChangeEvent, FormEvent } from 'react';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';

type ItemProps = {
    id: string;
    name: string;
}

interface CategoryProps{
    categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps){

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

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

    async function handleRegister(event: FormEvent){
        event.preventDefault();

        try{

            const data: FormData = new FormData();

            if(name === '' || price === '' || description === '' || imageAvatar === null){
                toast.error("Preencha todos os campos.");
                return;
            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[Number(categorySelected)].id);
            data.append('file', imageAvatar);

            const apiClient = setupAPIClient();

            await apiClient.post('/product', data);

            toast.success('Produto cadastrado com sucesso!');

        }catch(err){
            console.log(err);
            toast.error('Ops, erro ao cadastrar produto.');
        }

        setName('');
        setPrice('');
        setDescription('');
        setImageAvatar(null);
        setAvatarUrl('');
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
                    <form className={styles.form} onSubmit={handleRegister}>

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
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                        />
                        <Input
                        placeholder='Preço do produto'
                        value={price}
                        onChange={(e)=> setPrice(e.target.value)}
                        />

                        <TextArea
                        placeholder='Descreva seu produto...'
                        value={description}
                        onChange={(e)=> setDescription(e.target.value)}
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