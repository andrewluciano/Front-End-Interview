export const RetornoIdade = (idade: Date) => {
  if (!idade) return null;

  const nascimento = new Date(idade);
  if (isNaN(nascimento.getTime())) return null;

  const hoje = new Date();

  let anos = hoje.getFullYear() - nascimento.getFullYear();
  const jaFezAniversarioEsteAno =
    hoje.getMonth() > nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() &&
      hoje.getDate() >= nascimento.getDate());
  if (!jaFezAniversarioEsteAno) anos--;

  let diffMeses = hoje.getMonth() - nascimento.getMonth();
  if (hoje.getDate() < nascimento.getDate()) diffMeses--;
  const meses = ((diffMeses % 12) + 12) % 12;

  let dias: number;
  if (hoje.getDate() >= nascimento.getDate()) {
    dias = hoje.getDate() - nascimento.getDate();
  } else {
    const diasMesAnterior = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      0,
    ).getDate();
    dias = hoje.getDate() + diasMesAnterior - nascimento.getDate();
  }

  return anos;
  //   return <span> - {anos} anos {meses} meses {dias} dias</span>;
};
