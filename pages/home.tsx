import Head from 'next/head'
import Header from '../components/Header'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function HomePage() {
    const [simulados, setSimulados] = useState([]);

    const userId = process.browser ? localStorage.getItem('userId') : '';
    const userName = process.browser ? localStorage.getItem('userName') : 'User';

    useEffect(() => {
      axios.get(`/api/simulado`, { 
        headers: {
          Authorization: userId,
        }
      }).then(response => {
        setSimulados(response.data);
      })
    }, [userId]);

    function localSimuladoId(id) {
      localStorage.setItem('simuladoId', id);
    }

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          <Head>
            <title>Home</title>
            <link rel="icon" href="/img/criatividade.svg" />
          </Head>

          <Header
            name={userName}
           />

          <section className="px-4 sm:px-6 lg:px-4 xl:px-6 pt-4 pb-4 sm:pb-6 lg:pb-4 xl:pb-6 space-y-4">
            <header className="flex items-center justify-between">
              <h2 className="text-lg leading-6 font-medium text-black">Simulados {simulados.length}</h2>
              <a href="/simulado/new">
                <button className="hover:bg-black hover:text-white group flex items-center rounded-md text-sm font-medium px-4 py-2">
                  <svg className="group-hover:text-white text-black mr-2" width="12" height="20" fill="currentColor">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6 5a1 1 0 011 1v3h3a1 1 0 110 2H7v3a1 1 0 11-2 0v-3H2a1 1 0 110-2h3V6a1 1 0 011-1z"/>
                  </svg>
                  Novo
                </button>
              </a>
            </header>
            <form className="relative">
              <svg width="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
              <input className="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10" type="text" aria-label="Filtrar simulados" placeholder="Filtrar simulado" />
            </form>
            <ul className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-1 xl:grid-cols-4 gap-4">
              {simulados.map(simulado => (
                <li key={simulado._id} x-for="item in items"
                className="relative">
                <Link href={`/simulado/${simulado._id}`}>
                  <a className="hover:border-transparent hover:shadow-lg group block rounded-lg p-4 border border-gray-200"
                    onClick={() => localSimuladoId(simulado._id)}>
                  <p className="text-center">
                    {simulado.title}
                  </p>

                  <h1 className="mt-4 text-center text-4xl italic">
                    {simulado.nota}
                  </h1>

                  {/*<div className="w-full mt-4 flex items-center text-sm">
                    <p>{simulado.qCorretas.length}</p>
                    <p className="ml-auto">
                      {simulado.qtQuestoes}
                    </p>
                  </div> */}
                </a>
                </Link>
              </li>
              ))}
              <li className="hover:shadow-lg flex rounded-lg">
                <a href="/simulado/new" className="hover:border-transparent hover:shadow-xs w-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm font-medium py-4">
                  Novo Simulado
                </a>
              </li>
            </ul>
          </section>
      </div>
    )
}