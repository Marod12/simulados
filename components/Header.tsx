import Link from 'next/link'
import { FiPower, FiCalendar, FiClipboard } from 'react-icons/fi'
import { useRouter } from 'next/router';

interface HeaderProps {
    name: string
}

const Header: React.FC<HeaderProps> = ({ name }) => {
    const userName = name;

    const router = useRouter();

    function handleLogout() {
        localStorage.clear();
        
        router.push('/');
    }

    return (
        <header className="w-full max-w-screen-lg flex items-center px-0 py-2 sm:py-4 mx-auto my-1.5">
            <img className="w-10"
                src="/img/criatividade.svg" alt="Simulados" />

            <span className="ml-2 sm:ml-6 text-lg">
                Olá <Link href="/user">
                        <a className="text-gray-500 hover:opacity-70">
                            { userName }
                        </a>    
                    </Link>
            </span>

            <Link href="/home">
                <a className="ml-auto  hover:text-gray-500">
                    {/*<FiCalendar size={25}/>*/}
                    <img className="w-8"
                    src="/img/caderno.svg" alt="Simulados" />
                </a>
            </Link>

            <Link href="/questao">
                <a className="ml-6  hover:text-gray-500">
                    {/*<FiClipboard size={25} />*/}
                    <img className="w-8"
                    src="/img/livro.svg" alt="Questões" />
                </a>
            </Link>

            <button className="ml-6 sm:ml-10 h-10 w-10 rounded-sm ring ring-gray-50 ring-offset-1 bg-transparent hover:text-red-600"
                type="button"
                onClick={handleLogout}>
                <FiPower className="ml-2"
                    size={22} />
            </button>
            
        </header>
    )
}

export default Header;