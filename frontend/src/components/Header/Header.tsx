import './Header.css';

interface HeaderProps {
  title?: string;
}

export const Header = ({ title = "Rae AI" }: HeaderProps) => {
  return (
    <header className="header">
      <h1 className="header__title">{title}</h1>
    </header>
  );
}; 