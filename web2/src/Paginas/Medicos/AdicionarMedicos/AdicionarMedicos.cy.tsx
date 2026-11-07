import React from "react";
import { AdicionarMedicos } from "./AdicionarMedicos";

describe("<AdicionarMedicos />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AdicionarMedicos />);
  });
});
