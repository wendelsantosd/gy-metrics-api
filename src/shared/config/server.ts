type Server = {
  port: string;
};

export const server: Server = {
  port: process.env.PORT,
};
