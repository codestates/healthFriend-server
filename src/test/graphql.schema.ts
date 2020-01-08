
export const registerMutation = (email: string) => `
mutation {
  registerForTest(email: "${email}") {
    token
  }
}
`;
