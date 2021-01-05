import Head from 'next/head'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function ObterCodigoPage() {
    const [ name, setName ] = useState('');

    const router = useRouter();

    async function handleRegister(e) {
      e.preventDefault();
      
      try {
        const response = await axios.post(`http://localhost:3000/api/user`, { name });
        alert(`Seu ID de acesso: ${response.data.code}`);
        router.push('/');
      } catch (err) {
        alert('Erro ao obter o código de acesso');
      }
    }
    
    return (
      <div className="flex items-center justify-center h-screen">
        <Head>
          <title>Obter Código</title>
          <link rel="icon" href="/img/criatividade.svg" />
        </Head>

        <section className="max-w-7xl py-24 px-10 flex flex-1 flex-col items-center justify-center">
          <img src="/img/criatividade.svg"
            className="w-40"
          />

          <form className="w-full h-24 mt-16 flex flex-1 flex-col items-center justify-center"
            onSubmit={handleRegister}>
            <h1 className="mb-4 text-xl text-black">
              Obter Código
            </h1>

            <input className="px-2.5 py-1.5 focus:ring-1 focus:ring-gray-700 focus:outline-none w-auto text-sm text-black placeholder-gray-400 border border-gray-200 rounded-md" 
              type="text" 
              placeholder="Insira seu nome"
              required
              value={name}
              onChange={e => setName(e.target.value)} />
            
            <button type="submit"
              className="mt-2 p-1.5 w-56 flex items-center justify-center rounded-md bg-black text-sm text-white hover:opacity-60">
              Obter
            </button>

            <Link href="/">
                <a className="mt-14 text-gray-400 cursor-pointer hover:text-gray-700 flex flex-row text-sm">
                  <FiArrowLeft className="mr-1" size={18} />
                  Já tenho um código
                </a>
            </Link>
          </form>
        </section>
      </div>
    )
}