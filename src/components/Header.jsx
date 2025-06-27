import { useBranding } from '../context/Brandingcontext';

const Header = () => {
  const branding = useBranding();

  return (
    <header className="p-4 shadow" style={{ backgroundColor: branding?.theme?.color }}>
      <div className="flex items-center gap-4">
        <img src={branding?.logo || '/default-logo.png'} alt="Logo" className="h-10" />
        <h1 className="text-white text-xl font-semibold">
          {branding?.institute || 'Instify Platform'}
        </h1>
      </div>
    </header>
  );
};

export default Header;
