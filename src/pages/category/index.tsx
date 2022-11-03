import Head from "next/head";
import { FormEvent, useState } from "react";
import { Header } from "../../components/Header";
import styles from './styles.module.scss';
import { setupAPIClient } from '../../services/api';
import { toast } from "react-toastify";
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function Category() {

    const [name, setName] = useState('');

    async function handleRegister(event: FormEvent){
        event.preventDefault();
        if(name === ''){
            return;
        }

        const apiClient = setupAPIClient();
        await apiClient.post('/category', {
            name: name
        })

        toast.success('Categoria cadastrada com sucesso!');
        setName('');
    }

    return (
        <>
        <Head>
            <title>Nova categoria - Sujeito Pizzaria</title>
        </Head>s
        <Header/>
        <div>
            <main className ={styles.container}>
                <h1>Cadastrar categorias</h1>

                <form className={styles.form} onSubmit={handleRegister}>
                    <Input
                    placeholder='Digite o nome da categoria'
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    />

                    <Button type='submit'>Cadastrar</Button>
                </form>
            </main>
        </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return{
        props:{}
    }
})
