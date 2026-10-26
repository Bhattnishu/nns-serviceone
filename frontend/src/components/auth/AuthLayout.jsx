const AuthLayout = ({
    pageClass,
    cardClass,
    title,
    subtitle,
    subtitleClass,
    children,
    footer,
}) => {
    return (
        <main className={pageClass}>
            <section className={cardClass}>
                <h1>{title}</h1>
                <p className={subtitleClass}>{subtitle}</p>

                {children}

                {footer}
            </section>
        </main>
    );
};

export default AuthLayout;
