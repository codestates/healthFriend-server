import axios from 'axios';

const host = process.env.TEST_HOST as string;

export const user = async (variables: any) =>
  axios.post(host, {
    query: `
      query {
        allDistricts
      }
    `,
    variables,
  });
