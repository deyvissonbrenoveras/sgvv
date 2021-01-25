import app from './app';

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server Running on port ${PORT}`);
});
