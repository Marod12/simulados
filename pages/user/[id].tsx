import Head from 'next/head'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';

export default function EditUser() {
    const [ name, setName ] = useState('');

    const userId = process.browser ? localStorage.getItem('userId') : '';
    const userName = process.browser ? localStorage.getItem('userName') : 'User';

    const router = useRouter();
    
    async function handleUpdateUser(e) {
      e.preventDefault();

      const data = {
        name
      };

      try {
        await axios.put(`/api/user/${userId}`, data, { 
          headers: {
            Authorization: userId,
          }
        }).then(response => {
          localStorage.setItem('userName', response.data.name);
          router.push('/user');
        }); 
      } catch (err) {
        alert('Erro não foi possível alterar');
      }
    }

    return (
      <div className="max-w-5xl my-auto mx-auto px-4 sm:px-6 md:px-8">
        <Head>
          <title>Edita {userName}</title>
          <link rel="icon" href="/img/einstein.svg" />
        </Head>

        <section className="max-w-7xl py-24 px-10 flex flex-1 flex-col items-center justify-center">
          <img src="/img/einstein.svg"
            className="w-40"
          />
          
          <form className="w-full h-24 mt-16 flex flex-1 flex-col items-center justify-center"
            onSubmit={handleUpdateUser}>
            <input className="px-2.5 py-1.5 focus:ring-1 focus:ring-gray-700 focus:outline-none w-auto text-sm text-black placeholder-gray-400 border border-gray-200 rounded-md" 
              type="text"
              required
              placeholder={userName}
              value={name}
              onChange={e => setName(e.target.value)}
            />
            
            <button type="submit"
              className="mt-2 p-1.5 w-56 flex items-center justify-center rounded-md bg-black text-sm text-white hover:opacity-60">
              Editar
            </button>

            <Link href="/user">
                <a className="mt-14 pb-16 text-gray-500 cursor-pointer hover:text-gray-700 flex flex-row text-sm">
                  <FiArrowLeft className="mr-1" size={18} />
                  Voltar
                </a>
            </Link>
          </form>
        </section>
      </div>
    )
}