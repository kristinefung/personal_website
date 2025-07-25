export default function Greeting() {

    const handleAboutMeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const el = document.getElementById('about');
        const header = document.querySelector('header');

        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY;
            const headerHeight = header ? header.getBoundingClientRect().height : 0;
            window.scrollTo({
                top: y - headerHeight,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section id="section-greeting" className="px-16 flex flex-col items-start justify-center min-h-[100vh]">
            <p className="text-[#7fffd4] text-lg font-mono mb-2">
                Hi, my name is
            </p>
            <h1 className="text-6xl font-bold text-gray-100 mb-2">Kristine Fung</h1>
            <h2 className="text-5xl font-bold text-gray-400 mb-6">I build things for the web.</h2>
            <p className="text-gray-400 text-lg max-w-xl mb-8">
                I'm a software developer specializing in building exceptional digital experiences. Currently, I'm focused on creating accessible, human-centered products.
            </p>
            <a
                onClick={handleAboutMeClick}
                className="px-4 py-2 border-2 border-[#7fffd4] text-[#7fffd4] rounded-md text-lg hover:bg-[#7fffd4] hover:text-[#0a1628] transition-colors cursor-pointer"
            >
                Check out me
            </a>
        </section>
    );
} 