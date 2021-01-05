import Head from 'next/head'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import axios from 'axios'

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
  
    const userId = process.browser ? localStorage.getItem('userId') : '';
    const simuladoId = process.browser ? localStorage.getItem('simuladoId') : '';

    useEffect(() => {
      axios.get(`http://localhost:3000/api/simulado/${simuladoId}`, { 
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

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          <Head>
            <title>Simulado</title>
            <link rel="icon" href="/img/criatividade.svg" />
          </Head>

          <section className="mt-10 flex flex-col items-center justify-center gap-1">
              <p>{title}</p>
              <p>{nota}</p>

              <p>{qtQuestoes}</p>

              <h3>Questões Corretas</h3>
              {qCorretas.map(correta => (
                <div>
                  <p>{correta.materia}</p>
                  <p>{correta.pergunta}</p>
                  <p>{correta.resposta}</p>
                </div>
              ))}

              <h3>Questões Erradas</h3>
              {qErradas.map(errada => (
                <div>
                  <p>{errada.materia}</p>
                  <p>{errada.pergunta}</p>
                  <p>{errada.resposta}</p>
                  <p>{errada.minhaResposta}</p>
                </div>
              ))}

              <h3>Questões em Branco</h3>
              {qNull.map(emBranco => (
                <div>
                  <p>{emBranco.materia}</p>
                  <p>{emBranco.pergunta}</p>
                  <p>{emBranco.resposta}</p>
                </div>
              ))}
            
          </section>
 
      </div>
    )
}

export default SimuladoPage
