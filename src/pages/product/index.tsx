import Head from 'next/head';
import { Header } from '../../components/Header';
import styles from './styles.module.scss';

import { canSSRAuth } from '../../utils/canSSRAuth';
import { Input, TextArea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function Product(){
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
                        <select>
                            <option>
                                Bebida
                            </option>
                            <option>
                                Pizzas
                            </option>
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
    return{
        props:{}
    }
})