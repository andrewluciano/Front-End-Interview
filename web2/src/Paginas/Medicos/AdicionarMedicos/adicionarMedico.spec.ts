describe("Teste do formulário AdicionarMedicos", () => {
  beforeEach(() => {
    // Acesse a página onde o formulário está
    cy.visit("/adicionar-medico"); // ajuste a rota conforme sua aplicação
  });

  it("Preenche e envia o formulário corretamente", () => {
    // Preencher o nome do médico
    cy.get('input[name="full_name"]').type("Dr. João Silva");

    // Preencher telefone (considerando máscara, apenas inserir valor)
    cy.get('input[name="phone"]').type("11999999999");

    // Preencher email
    cy.get('input[name="email"]').type("dr.joao@exemplo.com");

    // Preencher CRM
    cy.get('input[name="crm"]').type("123456");

    // Preencher especialidade
    cy.get('input[name="specialty"]').type("Cardiologia");

    // Enviar o formulário
    cy.get("form").submit();

    // Verificar se a mensagem de sucesso aparece (supondo que exista um toast ou mensagem)
    cy.contains("Médico adicionado com sucesso!").should("be.visible");

    // Opcional: verificar se a função de callback para fechar modal foi chamada
    // ou se a requisição foi feita, dependendo do seu fluxo de testes
  });
});
