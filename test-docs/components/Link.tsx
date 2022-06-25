type Props = {
  children: React.ReactNode;
  href: string;
  title: string;
};

function Link({ children, href, title }: Props) {
  return (
    <a
      href={href}
      title={title}
      className="decoration-sky-400 font-semibold text-lg text-sky-500 underline"
    >
      {children}
    </a>
  );
}

export default Link;
