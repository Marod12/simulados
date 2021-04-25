import Head from 'next/head'
import { useState, useEffect } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import axios from 'axios'
import { useRouter } from 'next/router'

interface Simulado {
    title: string,
    nota: string,
    qtQuestoes: string,
    qCorretas : Array<object>,
    qErradas : Array<object>,
    qNull : Array<object>,
}

const SimuladoPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [nota, setNota] = useState('');
    const [qtQuestoes, setQtQuestoes] = useState('');
    const [qCorretas, setQCorretas] = useState([]);
    const [qErradas, setQErradas] = useState([]);
    const [qNull, setQNull] = useState([]);
    const [styleCorretas, setStyleCorretas] = useState('none');
    const [styleErradas, setStyleErradas] = useState('none');
    const [styleNulls, setStyleNulls] = useState('none');
  
    const userId = process.browser ? localStorage.getItem('userId') : '';
    const simuladoId = process.browser ? localStorage.getItem('simuladoId') : '';

    useEffect(() => {
      axios.get(`/api/simulado/${simuladoId}`, { 
        headers: {
          Authorization: userId,
        }
      }).then(response => {
        setTitle(response.data.title);
        setNota(response.data.nota);
        setQtQuestoes(response.data.qtQuestoes);
        setQCorretas(response.data.qCorretas);
        setQErradas(response.data.qErradas);
        setQNull(response.data.qNull);
      })
    }, [userId]);

    function showOrHiddenCorretas(e) {
      e.preventDefault();

      if(styleCorretas === 'none'){
        setStyleCorretas('flex')
        setStyleErradas('none')
        setStyleNulls('none')
      } else {
        setStyleCorretas('none')
      }
    } 
    
    function showOrHiddenErradas(e) {
      e.preventDefault();

      if(styleErradas === 'none'){
        setStyleErradas('flex')
        setStyleCorretas('none')
        setStyleNulls('none')
      } else {
        setStyleErradas('none')
      }
    } 

    function showOrHiddenNulls(e) {
      e.preventDefault();

      if(styleNulls === 'none'){
        setStyleNulls('flex')
        setStyleCorretas('none')
        setStyleErradas('none')
      } else {
        setStyleNulls('none')
      }
    } 

    const router = useRouter();

    async function handleDeleteSimulado(id) {
      try { 
        await axios.delete(`/api/simulado/${id}`, {
          headers: {
            Authorization: userId,
          } 
        });
        localStorage.removeItem('simuladoId');
        router.push('/home');
      } catch (err) {
        alert('Erro ao deletar simulado');
      }
    } 

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          <Head>
            <title>{title}</title>
            <link rel="icon" href="/img/criatividade.svg" />
          </Head>

          <header className="w-full max-w-screen-lg flex items-center px-0 py-2 sm:py-4 mx-auto my-1.5">
            <button className="ml-6 sm:ml-10 h-10 w-10 rounded-sm ring ring-gray-50 ring-offset-1 bg-transparent hover:text-red-600"
                type="button"
                onClick={() => handleDeleteSimulado(simuladoId)}>
                <FiTrash2 className="ml-2"
                    size={22} />
            </button>
          </header>

          <section className="mt-2 sm:mt-10 flex flex-col items-center justify-center gap-1">
              <h1 className="my-10 text-4xl md:text-6xl text-black text-center">
                {title}
              </h1>

              <div className="shadow-lg group block rounded-lg p-4 border border-gray-200">
                <p className="my-4 mx-4 text-center text-5xl italic">
                  {nota}
                  /
                  {qtQuestoes}
                </p>
              </div>

              <ul className="mt-10 grid grid-cols-3 gap-4">
                <li className="relative">
                  <a className="hover:border-transparent shadow-lg group block rounded-lg p-4 border border-green-300 cursor-pointe"
                    onClick={showOrHiddenCorretas}>
                    <p className="text-center">
                      Corretas
                    </p>
                    <h1 className="mt-4 text-center text-4xl italic">
                      {qCorretas.length}
                    </h1>
                  </a>
                </li>
                
                <li className="relative">
                  <a className="hover:border-transparent shadow-lg group block rounded-lg p-4 border border-red-300 cursor-pointe"
                    onClick={showOrHiddenErradas}>
                    <p className="text-center">
                      Erradas
                    </p>
                    <h1 className="mt-4 text-center text-4xl italic">
                      {qErradas.length}
                    </h1>
                  </a>
                </li>

                <li className="relative">
                  <a className="hover:border-transparent shadow-lg group block rounded-lg p-4 border border-gray-300 cursor-pointer"
                    onClick={showOrHiddenNulls}>
                    <p className="text-center">
                      Em branco
                    </p>
                    <h1 className="mt-4 text-center text-4xl italic">
                      {qNull.length}
                    </h1>
                  </a>
                </li>
              </ul>

              <div className="mt-16 flex-1 flex-col items-center justify-center gap-1"
                style={{display: styleCorretas}}>
                {qCorretas.map(correta => (
                  <div className="flex flex-col items-center justify-center gap-1 p-4 md:p-16 border shadow-lg rounded-3xl mb-12" 
                    key={correta._id}>
    
                    <p className="p-6 md:py-2 mb-4 text-md">
                      {correta.pergunta}
                    </p>

                    <p>
                      {correta.resposta === 'T' ? ('Correta') : correta.resposta === 'F' ? ('Errada') : correta.resposta}
                    </p>

                    <div className="mt-8 grid grid-cols-3 gap-4">
                      <div className="shadow-lg text-center rounded-lg py-3 sm:px-24 px-10 border border-green-300">
                        {correta.statistic.c}
                      </div>
                      <div className="shadow-lg text-center rounded-lg py-3 sm:px-24 px-10 border border-red-300">
                        {correta.statistic.e}
                      </div>
                      <div className="shadow-lg text-center rounded-lg py-3 sm:px-24 px-10 border border-gray-300">
                        {correta.statistic.n}
                      </div>
                    </div>
                  </div>
                ))}  
              </div>

              <div className="mt-16 flex-1 flex-col items-center justify-center gap-1"
                style={{display: styleErradas}}>
                {qErradas.map(errada => (
                  <div className="flex flex-col items-center justify-center gap-1 p-4 md:p-16 border shadow-lg rounded-3xl mb-12" 
                    key={errada._id}>
    
                    <p className="p-6 md:py-2 mb-4 text-md">
                      {errada.pergunta}
                    </p>

                    <p>
                      Resposta: {errada.resposta === 'T' ? ('Correta') : errada.resposta === 'F' ? ('Errada') : errada.resposta}
                    </p>
                    <p> 
                      Sua resposta: {errada.minhaResposta === 'T' ? ('Correta') : errada.minhaResposta === 'F' ? ('Errada') : errada.minhaResposta}
                    </p>

                    <div className="mt-8 grid grid-cols-3 gap-4">
                      <div className="shadow-lg text-center rounded-lg py-3 sm:px-24 px-10 border border-green-300">
                        {errada.statistic.c}
                      </div>
                      <div className="shadow-lg text-center rounded-lg py-3 sm:px-24 px-10 border border-red-300">
                        {errada.statistic.e}
                      </div>
                      <div className="shadow-lg text-center rounded-lg py-3 sm:px-24 px-10 border border-gray-300">
                        {errada.statistic.n}
                      </div>
                    </div>
                  </div>
                ))}  
              </div>

              <div className="mt-16 hidden flex-1 flex-col items-center justify-center gap-1"
                style={{display: styleNulls}}>
                {qNull.map(emBranco => (
                  <div className="flex flex-col items-center justify-center gap-1 p-4 md:p-16 border shadow-lg rounded-3xl mb-12" 
                    key={emBranco._id}>
    
                    <p className="p-6 md:py-2 mb-4 text-md">
                      {emBranco.pergunta}
                    </p>

                    <p>
                      {emBranco.resposta === 'T' ? ('Correta') : emBranco.resposta === 'F' ? ('Errada') : emBranco.resposta}
                    </p>

                    <div className="mt-8 grid grid-cols-3 gap-4">
                      <div className="shadow-lg text-center rounded-lg py-3 sm:px-24 px-10 border border-green-300">
                        {emBranco.statistic.c}
                      </div>
                      <div className="shadow-lg text-center rounded-lg py-3 sm:px-24 px-10 border border-red-300">
                        {emBranco.statistic.e}
                      </div>
                      <div className="shadow-lg text-center rounded-lg py-3 sm:px-24 px-10 border border-gray-300">
                        {emBranco.statistic.n}
                      </div>
                    </div>  
                  </div>
                ))}  
              </div>

          </section>
 
      </div>
    )
}

export default SimuladoPage
