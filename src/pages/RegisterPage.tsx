import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, UserPlus } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { BRAZILIAN_STATES, formatCep, formatCpf } from "@/lib/masks";
import { cn } from "@/lib/utils";

const fieldClass = "h-11";
const selectClass =
  "h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-colors dark:bg-input/30 dark:hover:bg-input/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [complemento, setComplemento] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (cpf.replace(/\D/g, "").length !== 11) {
      setError("Informe um CPF válido com 11 dígitos.");
      return;
    }
    if (cep.replace(/\D/g, "").length !== 8) {
      setError("Informe um CEP válido com 8 dígitos.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        cpf,
        address: {
          rua: rua.trim(),
          numero: numero.trim(),
          bairro: bairro.trim(),
          cidade: cidade.trim(),
          cep,
          estado,
          ...(complemento.trim() ? { complemento: complemento.trim() } : {}),
        },
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar sua conta. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      badge="Novo cliente"
      wide
      title={
        <>
          Crie sua conta{" "}
          <span className="text-nexora nexora-text-glow">Nexora.</span>
        </>
      }
      description="Cadastre-se para comprar hardware premium, acompanhar pedidos e finalizar o checkout."
    >
      <Card className="border border-border/60 bg-card/70 ring-1 ring-nexora/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Cadastro</CardTitle>
          <CardDescription>
            Preencha seus dados pessoais e o endereço de entrega.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-5">
            {error ? (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <fieldset className="grid gap-4">
              <legend className="mb-1 text-xs font-medium tracking-wider text-nexora uppercase">
                Dados da conta
              </legend>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Maria Silva"
                  className={fieldClass}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@email.com"
                    className={fieldClass}
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className={fieldClass}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  value={cpf}
                  onChange={(event) => setCpf(formatCpf(event.target.value))}
                  placeholder="000.000.000-00"
                  className={cn(fieldClass, "sm:max-w-xs")}
                  disabled={loading}
                />
              </div>
            </fieldset>

            <fieldset className="grid gap-4">
              <legend className="mb-1 text-xs font-medium tracking-wider text-nexora uppercase">
                Endereço
              </legend>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="rua">Rua</Label>
                  <Input
                    id="rua"
                    type="text"
                    autoComplete="address-line1"
                    required
                    value={rua}
                    onChange={(event) => setRua(event.target.value)}
                    placeholder="Av. Paulista"
                    className={fieldClass}
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    type="text"
                    required
                    value={numero}
                    onChange={(event) => setNumero(event.target.value)}
                    placeholder="1000"
                    className={fieldClass}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    type="text"
                    required
                    value={bairro}
                    onChange={(event) => setBairro(event.target.value)}
                    placeholder="Bela Vista"
                    className={fieldClass}
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    type="text"
                    autoComplete="address-level2"
                    required
                    value={cidade}
                    onChange={(event) => setCidade(event.target.value)}
                    placeholder="São Paulo"
                    className={fieldClass}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    required
                    value={cep}
                    onChange={(event) => setCep(formatCep(event.target.value))}
                    placeholder="00000-000"
                    className={fieldClass}
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    id="estado"
                    required
                    value={estado}
                    onChange={(event) => setEstado(event.target.value)}
                    className={selectClass}
                    disabled={loading}
                  >
                    <option value="">UF</option>
                    {BRAZILIAN_STATES.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    type="text"
                    value={complemento}
                    onChange={(event) => setComplemento(event.target.value)}
                    placeholder="Apto 12"
                    className={fieldClass}
                    disabled={loading}
                  />
                </div>
              </div>
            </fieldset>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4 border-t border-border/40 bg-transparent">
            <Button
              type="submit"
              disabled={loading}
              className="h-11 bg-nexora text-primary-foreground hover:bg-nexora/90"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
              ) : (
                <UserPlus className="size-4" data-icon="inline-start" />
              )}
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="font-medium text-nexora hover:underline">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}
