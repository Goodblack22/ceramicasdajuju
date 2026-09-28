import LoginForm from "./LoginForm";

export const metadata = { title: "Entrar — Painel Cerâmica da Juju" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="admin-login-screen">
      <div className="admin-login-card">
        <h1>Painel Cerâmica da Juju</h1>
        <p className="admin-login-sub">Entre com seu e-mail e senha</p>
        {erro === "sem-acesso" && (
          <p className="error-text">Esse e-mail não tem acesso ao painel.</p>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
